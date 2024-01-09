import {Request, Response} from "express";
import { PostService } from "../_application/posts-service";
import { PaginatedPost, PostViewModel2, PostsDBModels } from "../models/posts-model";
import { postsRepository } from "../infrastructure/repositories/posts-repository";
import { LikeStatus, LikeStatusTypePost, NewestLikeTypePost, UserModel } from "../db/db";
import { postsQueryRepository } from "../composition-root";
import { PaginatedCommentViewModel, commentViewType } from "../models/comment-models";
import { commentRepository } from "../infrastructure/repositories/comment-repository";
import { getPaginationFromQuery } from "../hellpers/pagination";
import { blogsRepository } from "../infrastructure/repositories/blogs-repository";
import { blogQueryRepo } from "../composition-root";
import { sendStatus } from "../routers/send-status";

export class PostsController{
  
    constructor(protected postsService: PostService) {
      
    }
  
    async updatePostWithLikeStatus(req: Request, res: Response){
      const postId = req.params.postId;
      const likeStat = req.body;
      const user = req.user 
  
      const existingPost: PostsDBModels | null = await postsRepository.findPostById(postId)
        if (!existingPost) {
          return res.sendStatus(404);
        }
  
        const isReactionExist = existingPost.extendedLikesInfo.statuses.find(((s: LikeStatusTypePost) => s.userId === user!.id))
        console.log('isReactionExist:', isReactionExist)
  
        if(isReactionExist){
          
          if (likeStat.likeStatus === 'Like' && isReactionExist.myStatus === 'None'){
            isReactionExist.myStatus = LikeStatus.Like;
            existingPost.extendedLikesInfo.likesCount += 1;
          } else if (likeStat.likeStatus === 'Like' && isReactionExist.myStatus === 'Dislike'){
            isReactionExist.myStatus = LikeStatus.Like;
            existingPost.extendedLikesInfo.likesCount += 1;
            existingPost.extendedLikesInfo.dislikesCount -= 1;
          } else  if (likeStat.likeStatus === 'Dislike' && isReactionExist.myStatus === 'None'){
            isReactionExist.myStatus = LikeStatus.Dislike
            existingPost.extendedLikesInfo.dislikesCount += 1;
          } else if (likeStat.likeStatus === 'Dislike' && isReactionExist.myStatus === 'Like'){
            isReactionExist.myStatus = LikeStatus.Dislike;
            existingPost.extendedLikesInfo.likesCount -= 1;
            existingPost.extendedLikesInfo.dislikesCount += 1;
          } else if(likeStat.likeStatus === 'None' && isReactionExist.myStatus === 'Dislike') {
            isReactionExist.myStatus = LikeStatus.None
            existingPost.extendedLikesInfo.dislikesCount -= 1;
          } else if(likeStat.likeStatus === 'None' && isReactionExist.myStatus === 'Like') {
            isReactionExist.myStatus = LikeStatus.None
            existingPost.extendedLikesInfo.likesCount -= 1;
          } 
        
        }else {
          if (likeStat.likeStatus === 'Like') {
            existingPost.extendedLikesInfo.likesCount += 1;
            existingPost.extendedLikesInfo.statuses.push({
                  myStatus:LikeStatus.Like,
                  userId: user!.id,
                  createdAt: new Date().toISOString()
                })
              } else if (likeStat.likeStatus === 'Dislike'){
                existingPost.extendedLikesInfo.dislikesCount += 1;
                existingPost.extendedLikesInfo.statuses.push({
                  myStatus:LikeStatus.Dislike,
                  userId: user!.id,
                  createdAt: new Date().toISOString()
                })
        
              } else if (likeStat.likeStatus === 'None'){
                existingPost.extendedLikesInfo.statuses.push({
                  myStatus:LikeStatus.None,
                  userId: user!.id,
                  createdAt: new Date().toISOString()
                })
              }
            }
         
            const latestLikes = await Promise.all(existingPost.extendedLikesInfo.statuses
                .filter((like: LikeStatusTypePost) => like.myStatus === LikeStatus.Like)
                .sort((a: LikeStatusTypePost, b: LikeStatusTypePost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map(async (latestLikes: LikeStatusTypePost): Promise<NewestLikeTypePost> => {
                  const user = await UserModel.findOne({ id: latestLikes.userId },
                     {projection: { "extendedLikesInfo._id": 0, "extendedLikesInfo.statuses._id" : 0, "extendedLikesInfo.newestLikes._id":0} //PostsDBModels.getViewModel(user, foundPost)
                  });
                  return { 
                    addedAt: latestLikes.createdAt,
                    userId: latestLikes.userId,
                    login: user?.login || 'Unknown', 
                    
                  };
                })
            )
            
  
                await postsQueryRepository.updatePostLikeStatus(existingPost, latestLikes);
  
            
            return res.sendStatus(204) 
    }
  
    async getCommentFromPost(req: Request, res: Response){   
      const foundedPostId = await postsRepository.findPostById(req.params.postId)
      if(!foundedPostId) {
      return res.sendStatus(404)
      
    }
    const pagination = getPaginationFromQuery(req.query)
    const user = req.user
    const allCommentsForPostId: PaginatedCommentViewModel<commentViewType> =
    await commentRepository.getAllCommentsForPost(req.params.postId, pagination, user) 
       return res.status(200).send(allCommentsForPostId)
        
   }
  
   async createCommentsPost(req: Request, res: Response) { 
    
      const postWithId: PostsDBModels| null = await postsRepository.findPostById(req.params.postId);
      
      if(!postWithId) {
        return res.sendStatus(404)
      
      }
  
      
    
    const comment: commentViewType | null = await postsQueryRepository
    .createPostComment(postWithId.id, req.body.content, {userId: req.user!.id, userLogin: req.user!.login})
    
        return res.status(201).send(comment)
  
    }
  
   async getPostWithPagination(req: Request, res: Response<PaginatedPost<PostViewModel2>>) {
    const pagination = getPaginationFromQuery(req.query)
    const user = req.user
    const foundPost: PaginatedPost<PostViewModel2>= await blogQueryRepo.findAllPosts(pagination, user)
    if (!foundPost) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
      
  
      return res.status(sendStatus.OK_200).send(foundPost);
    }
  }
  
   
    async getPostById(req: Request, res: Response<PostViewModel2| undefined | null>) {
      const user = req.user!
      const foundPost: PostsDBModels | null = await this.postsService.findPostById(req.params.id)    
        if (foundPost) {
         
          return res.status(sendStatus.OK_200).send(PostsDBModels.getViewModel(user, foundPost))
          
        } else {
          
          return res.sendStatus(sendStatus.NOT_FOUND_404)
      }
      }
  
      async createPost(req: Request, res: Response<PostViewModel2 | undefined | null>) {
        const findBlogById =  await blogsRepository.findBlogById(req.body.blogId)
        const user = req.user 
        
        if (findBlogById) {
          const { title ,shortDescription, content, blogId} = req.body
        const newPost : PostViewModel2| null= await this.postsService.createPost(title,shortDescription, content, blogId, user)
        console.log('newPost :', newPost)
        
          if(!newPost) {
            
            return res.sendStatus(sendStatus.BAD_REQUEST_400 )
        } else {
          
          return res.status(sendStatus.CREATED_201).send(newPost)
        }
      }
      
      } 
  
      async updatePost(req: Request , res: Response<boolean | undefined>) {
        const id = req.params.id
        const { title, shortDescription, content, blogId} = req.body
        const updatePost = await this.postsService.updatePost(id, title, shortDescription, content, blogId)
    
      
        if (!updatePost) {
          return res.sendStatus(sendStatus.NOT_FOUND_404)
        } else {
          return res.sendStatus(sendStatus.NO_CONTENT_204)
        }
    }
  
    async deletePostById(req: Request, res: Response) {
      const foundPost = await this.postsService.deletePost(req.params.id)
      if (!foundPost) {
        return res.sendStatus(sendStatus.NOT_FOUND_404);
        } 
       res.sendStatus(sendStatus.NO_CONTENT_204)
      }
  
  
  
  }
  
  
  