import {Router } from "express";
import { authorizationValidation} from "../middlewares/inputvalidationmiddleware";
import { createPostValidation} from "../middlewares/postsvalidation";
import { updatePostValidation } from "../middlewares/postsvalidation";
import { authMiddleware } from "../middlewares/auth-middleware";
import { createPostValidationC } from "../middlewares/commentInputValidation";
import { userMiddleware } from "../middlewares/userMiddleware";
import { validationCommentLikeStatus } from "../middlewares/likemiddleware";
import { postsController } from "../composition-root";

export const postsRouter = Router({})

 
postsRouter.put('/:postId/like-status', 
authMiddleware,
validationCommentLikeStatus,
postsController.updatePostWithLikeStatus.bind(postsController))
postsRouter.get('/:postId/comments', userMiddleware, postsController.getCommentFromPost.bind(postsController))
postsRouter.post('/:postId/comments',
 authMiddleware, 
 createPostValidationC,
 postsController.createCommentsPost.bind(postsController) )

postsRouter.get('/', userMiddleware, postsController.getPostWithPagination.bind(postsController) )

postsRouter.get('/:id', userMiddleware, postsController.getPostById.bind(postsController) )
  
postsRouter.post('/', 
  authorizationValidation,
  createPostValidation,
  postsController.createPost.bind(postsController)
 )
  

postsRouter.put('/:id', 
authorizationValidation,
updatePostValidation,
postsController.updatePost.bind(postsController))
  
postsRouter.delete('/:id', 
authorizationValidation,
postsController.deletePostById.bind(postsController)
)
