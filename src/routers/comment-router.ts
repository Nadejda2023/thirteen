import { Router, Request, Response} from "express";
import { createPostValidationC } from "../middlewares/commentInputValidation";
import { authMiddleware } from "../middlewares/auth-middleware";
import { CommentDB, commentViewModel, commentViewType} from "../models/comment-models";
import { commentRepository } from "../infrastructure/repositories/comment-repository";
import { validationCommentLikeStatus } from "../middlewares/likemiddleware";
import { LikeStatus, LikeStatusType } from "../db/db";
import { userMiddleware } from "../middlewares/userMiddleware";
import { CommentService } from "../_application/comment-service";
import { commentController } from "../composition-root";



export const commentRouter = Router({})



commentRouter.put('/:commentId/like-status',
authMiddleware,
validationCommentLikeStatus,
 commentController.commentUpdateLikeStatus.bind(commentController)
 )

  commentRouter.put('/:commentId',
  authMiddleware,
  createPostValidationC, commentController.updateCommentById.bind(commentController)
  )

  commentRouter.get('/:commentId',userMiddleware, commentController.getCommentById.bind(commentController)
  ) 

  commentRouter.delete('/:commentId', 
  authMiddleware, commentController.deleteCommentById.bind(commentController)
  ) 

