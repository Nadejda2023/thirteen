import { Router } from "express";
import { CreateBlogValidation , UpdateBlogValidation } from "../middlewares/blogsvalidation";
import { authorizationValidation } from "../middlewares/inputvalidationmiddleware";
import {  createPostValidationForBlogRouter } from "../middlewares/postsvalidation";
import { userMiddleware } from "../middlewares/userMiddleware";
import { blogsController } from "../composition-root";



export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
  

blogsRouter.post('/',
  authorizationValidation,
  ...CreateBlogValidation,
  blogsController.createBlog.bind(blogsController))
  

blogsRouter.get('/:blogId/posts', userMiddleware, blogsController.getPostByBlogId.bind(blogsController))

//3
blogsRouter.post('/:blogId/posts',
authorizationValidation, 
createPostValidationForBlogRouter,
blogsController.createPostForBlog.bind(blogsController))

  blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))
  
blogsRouter.put('/:id',
  authorizationValidation,
  ...UpdateBlogValidation,
  blogsController.updateBlog.bind(blogsController))
  
blogsRouter.delete('/:id', 
  authorizationValidation,
  blogsController.deleteBlogById.bind(blogsController)) 