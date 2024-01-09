import { LikeStatusType, LikeStatus } from "../db/db";
import { CommentService } from "../_application/comment-service";
import { Request, Response} from "express";
import { CommentDB, commentViewType } from "../models/comment-models";
import { commentRepository } from "../infrastructure/repositories/comment-repository";

export class CommentController {
    constructor(protected commentService: CommentService) {}
    async commentUpdateLikeStatus(req: Request, res: Response) {
      const commentId = req.params.commentId;
      const likeStat = req.body;
      const user = req.user 
  
        const existingComment: CommentDB | null = await commentRepository.findCommentById(commentId);
  
        if (!existingComment) {
          return res.sendStatus(404);
        }
  
      
      const isReactionExist = existingComment.likesInfo.statuses.find(((s: LikeStatusType) => s.userId === user!.id))
  
  if(isReactionExist){
    if (likeStat.likeStatus === 'Like' && isReactionExist.myStatus === 'None'){
      isReactionExist.myStatus = LikeStatus.Like;
      existingComment.likesInfo.likesCount += 1;
    } else if (likeStat.likeStatus === 'Like' && isReactionExist.myStatus === 'Dislike'){
      isReactionExist.myStatus = LikeStatus.Like;
      existingComment.likesInfo.likesCount += 1;
      existingComment.likesInfo.dislikesCount -= 1;
    } else  if (likeStat.likeStatus === 'Dislike' && isReactionExist.myStatus === 'None'){
      isReactionExist.myStatus = LikeStatus.Dislike
      existingComment.likesInfo.dislikesCount += 1;
    } else if (likeStat.likeStatus === 'Dislike' && isReactionExist.myStatus === 'Like'){
      isReactionExist.myStatus = LikeStatus.Dislike;
      existingComment.likesInfo.likesCount -= 1;
      existingComment.likesInfo.dislikesCount += 1;
    } else if(likeStat.likeStatus === 'None' && isReactionExist.myStatus === 'Dislike') {
      isReactionExist.myStatus = LikeStatus.None
      existingComment.likesInfo.dislikesCount -= 1;
    } else if(likeStat.likeStatus === 'None' && isReactionExist.myStatus === 'Like') {
      isReactionExist.myStatus = LikeStatus.None
      existingComment.likesInfo.likesCount -= 1;
    } 
  }else {
    if (likeStat.likeStatus === 'Like') {
          existingComment.likesInfo.likesCount += 1;
          existingComment.likesInfo.statuses.push({
            myStatus:LikeStatus.Like,
            userId: user!.id,
            createdAt: new Date().toISOString()
          })
        } else if (likeStat.likeStatus === 'Dislike'){
          existingComment.likesInfo.dislikesCount += 1;
          existingComment.likesInfo.statuses.push({
            myStatus:LikeStatus.Dislike,
            userId: user!.id,
            createdAt: new Date().toISOString()
          })
  
        } else if (likeStat.likeStatus === 'None'){
          existingComment.likesInfo.statuses.push({
            myStatus:LikeStatus.None,
            userId: user!.id,
            createdAt: new Date().toISOString()
          })
        }
      }
        
          await commentRepository.updateCommentLikeStatus(existingComment);
  
          return res.sendStatus(204);
      
  
      
    }
    
  
      
    
  
    async updateCommentById(req: Request , res: Response) {
      
      const user = req.user!
      const commentId = req.params.commentId
  
      const existingComment = await commentRepository.findCommentById(commentId);
      if (!existingComment) {
          return res.sendStatus(404); 
      }
  
      if (existingComment.commentatorInfo.userId !== user.id) {
        return res.sendStatus(403); 
      }
      
      const updateComment = await commentRepository.updateComment(commentId, req.body.content);
  
      if (updateComment) {
        return res.sendStatus(204); 
      } 
    }  
  
  
    async getCommentById(req: Request, res: Response<commentViewType| undefined >) {
      const user = req.user!
      const foundComment: CommentDB | null = await commentRepository.findCommentById(req.params.commentId)
         
        if (foundComment) {
          return res.status(200).send(CommentDB.getViewModel(user, foundComment)) 
        } else {
          return res.sendStatus(404)
      }
      }
  
      async deleteCommentById(req: Request, res: Response) {
        const user = req.user!
        const commentId = req.params.commentId
        const comment = await commentRepository.findCommentById(commentId)
        
        if (!comment) {
          return res.sendStatus(404)
        } else {
        const commentUserId = comment.commentatorInfo.userId
        if (commentUserId !== user.id) {
            return res.sendStatus(403)
        }
        const commentDelete = await commentRepository.deleteComment(req.params.commentId);
        if(commentDelete){
            return res.sendStatus(204)
          }
    
    }
  }
  }
   