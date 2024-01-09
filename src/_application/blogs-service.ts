import {  BlogsViewDBModel, BlogsViewModel, } from "../models/blogs-model";
import { randomUUID } from "crypto";
import { BlogsRepository } from "../infrastructure/repositories/blogs-repository";


export class BlogService {
    
    constructor(protected blogsRepository: BlogsRepository){
    }
    
    async findAllBlogs(title: string | null | undefined): Promise<BlogsViewDBModel[]> { 
        return this.blogsRepository.findAllBlogs(title)
         
        }
    
       async findBlogById(id: string): Promise<BlogsViewModel | null> {
            return this.blogsRepository.findBlogById(id) 
    
        }
        
        async createBlog(name: string, description: string, website: string): Promise<BlogsViewDBModel| null > {
            const newBlog: BlogsViewModel = {
                id: randomUUID(),   
                name: name,
                description: description,
                websiteUrl: website,
                createdAt: (new Date()).toISOString(),
                isMembership: true,
                
            }
            
            const newBlogId = await this.blogsRepository.createBlog(newBlog)
            return newBlogId
        }
    
        async updateBlog(id: string, name: string, description: string, website: string): Promise< boolean | undefined> {
             return await this.blogsRepository.updateBlog(id, name, description, website)
           
            
        
        }
    
        async deleteBlog(id: string) {
            return await this.blogsRepository.deleteBlog(id)
           
            
        }
    
        async deleteAllBlogs(): Promise<boolean> {
            return await this.blogsRepository.deleteAllBlogs()
            
        } 
    } 
    




