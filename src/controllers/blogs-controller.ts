import {Request, Response } from "express";
import { getPaginationFromQuery, getSearchNameTermFromQuery } from "../hellpers/pagination"
import { BlogService } from "../_application/blogs-service";
import { BlogsViewDBModel, BlogsViewModel, PaginatedBlog } from "../models/blogs-model";
import { blogsRepository } from "../infrastructure/repositories/blogs-repository";
import { sendStatus } from "../routers/send-status";
import { PaginatedPost, PostViewModel2 } from "../models/posts-model";
import { BlogQueryRepo } from "../infrastructure/repositories/blogs-query-repository"
import { blogQueryRepo } from "../composition-root";

export class BlogsController{
    constructor(protected blogsService: BlogService) {}
  
    async getBlogs(req: Request, res: Response) : Promise<void> {
      const pagination = getPaginationFromQuery(req.query)
      const name = getSearchNameTermFromQuery(req.query.searchNameTerm as string)
        const foundBlogs:PaginatedBlog<BlogsViewModel> = await blogQueryRepo.findBlogs({...pagination, ...name})
        
        res.status(sendStatus.OK_200).send(foundBlogs)
      }
  
    async createBlog(req: Request , res: Response<BlogsViewDBModel | null >) {
      const { name, description, websiteUrl} = req.body
    const newBlog : BlogsViewDBModel| null  = await this.blogsService.createBlog(name, description, websiteUrl)
    
    return res.status(sendStatus.CREATED_201).send(newBlog)
    
      }
  
    async getPostByBlogId(req: Request, res: Response) { 
      const user = req.user!
      const blogPost:BlogsViewModel | null = await blogsRepository.findBlogById(req.params.blogId)
    if(!blogPost) {
      return res.sendStatus(404)
      
     }
     
     const pagination = getPaginationFromQuery(req.query)
     
      const BlogsFindPosts: PaginatedPost<PostViewModel2> = 
      await blogQueryRepo.findPostForBlog(req.params.blogId, pagination, user)
      
        return res.status(200).send(BlogsFindPosts)
        
       
    }
  
    async createPostForBlog(req: Request, res: Response) { 
      const blogWithId: BlogsViewModel| null = await blogsRepository.findBlogById(req.params.blogId) 
      if(!blogWithId) {
        return res.sendStatus(404)
       
      }
      const user = req.user
        const blogsCreatePost: PostViewModel2 | null = await blogQueryRepo.createPostForBlog(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId, user)
        if(blogsCreatePost) {
          return res.status(201).send(blogsCreatePost)
          
         }
      }
  
      async getBlogById(req: Request, res: Response<BlogsViewModel| null>) {
        const foundBlog: BlogsViewModel | null = await this.blogsService.findBlogById(req.params.id)
        if (foundBlog) {
          return res.status(sendStatus.OK_200).send(foundBlog)
        } else {
          return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
    }
  
    async updateBlog(req: Request , res: Response <boolean | undefined>) {
      const id = req.params.id
      const { name, description, websiteUrl} = req.body
  
      const updateBlog = await this.blogsService.updateBlog(id, name, description, websiteUrl)
      if (updateBlog) {
        return res.sendStatus(sendStatus.NO_CONTENT_204)
        
      } else {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
      }
  }
  
    async deleteBlogById(req: Request, res: Response) {
      const foundBlog = await this.blogsService.deleteBlog(req.params.id);
      if (!foundBlog) {
        return  res.sendStatus(sendStatus.NOT_FOUND_404)
      } else {
      return res.sendStatus(sendStatus.NO_CONTENT_204)
      }
    } 
  }