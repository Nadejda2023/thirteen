import { LikeStatus, LikeStatusTypePost, PostModel, db} from "../../db/db"
import { PostViewModel2, PostViewModel, PostsDBModels } from "../../models/posts-model"
import { UsersModel } from "../../models/users-model"

 
 export class PostsRepository{
    async findAllPosts(): Promise<PostViewModel2[]> { 

        const filter: any = {}
    
        return PostModel.find((filter), {projection:{_id:0, "extendedLikesInfo._id": 0, "extendedLikesInfo.statuses._id" : 0, "extendedLikesInfo.newestLikes._id":0, "extendedLikesInfo.newestLikes.myStatus._id":0}}) //PostsDBModels.getViewModel(user, foundPost)}}).lean()
         
        }
        async findPostById(id: string): Promise<PostsDBModels | null> {
            return PostModel.findOne({id: id}, {projection: {_id: 0, 
                "extendedLikesInfo._id": 0, "extendedLikesInfo.statuses._id" : 0, "extendedLikesInfo.newestLikes._id":0, "extendedLikesInfo.newestLikes.myStatus._id":0}}) //PostsDBModels.getViewModel(user, foundPost)
            
        
            
        }
 
    async createPost(newPost:PostViewModel2, user: UsersModel | null): Promise<PostViewModel2| null> {
        try {
        const result = await PostModel.create(newPost)
        //return result;
        
        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
            extendedLikesInfo: {
            likesCount: newPost.extendedLikesInfo.likesCount,
            dislikesCount: newPost.extendedLikesInfo.dislikesCount,
            myStatus:newPost.extendedLikesInfo.myStatus,
            newestLikes: user ?[{
                addedAt: newPost.extendedLikesInfo.newestLikes[0]?.addedAt || '',
                userId: newPost.extendedLikesInfo.newestLikes[0]?.userId || '',
                login: newPost.extendedLikesInfo.newestLikes[0]?.login || ''
                }] : []
            
            }
        }
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }

          }
        
            
        
    
    async updatePost(
        id: string, title: string, shortDescription: string, content: string, blogId: string)
         : Promise<boolean | undefined> {
        let foundPost = await PostModel.findOne({id:id},  {projection: {_id: 0, 
            "extendedLikesInfo._id": 0, "extendedLikesInfo.statuses._id" : 0, "extendedLikesInfo.newestLikes._id":0, "extendedLikesInfo.newestLikes.myStatus._id":0}}) //PostsDBModels.getViewModel(user, foundPost))
        let foundBlogName = await PostModel.findOne({id: blogId}, {projection: {_id:0}})
        if(foundPost){
            if(foundBlogName) {
                const result = await PostModel.updateOne({ id : id }, { $set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId} })
                return result.matchedCount === 1

            }
        }
        
    
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({id: id})
        return result.deletedCount === 1
   
    }
    async deleteAllPosts(): Promise<boolean> {
        const result = await PostModel.deleteMany({})
      
        return result.acknowledged  === true
    
        
    }

 }
 export const postsRepository = new PostsRepository







