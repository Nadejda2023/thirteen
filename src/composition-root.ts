import "reflect-metadata";
import { UserService } from "./_application/users-service";
import { UserRepository } from "./infrastructure/repositories/users-repository";
import { UsersController } from "./controllers/users-controller";
import { BlogsRepository } from "./infrastructure/repositories/blogs-repository";
import { BlogService } from "./_application/blogs-service";
import { BlogsController } from "./controllers/blogs-controller";
import { PostsRepository } from "./infrastructure/repositories/posts-repository";
import { PostService } from "./_application/posts-service";
import { PostsController } from "./controllers/posts-controller";
import { CommentRepository } from "./infrastructure/repositories/comment-repository";
import { CommentService } from "./_application/comment-service";
import { CommentController } from "./controllers/comment-controller"
import { AuthRepository } from "./infrastructure/repositories/auth-repositori";
import { AuthService } from "./_application/auth-service";
import { JwtService } from "./_application/jwt-service";
import { AuthController } from "./controllers/auth-controller";
import { UsersQueryRepository } from "./infrastructure/repositories/users-query-repository";
import { BlogQueryRepo } from "./infrastructure/repositories/blogs-query-repository";
import { PostsQueryRepository } from "./infrastructure/repositories/posts-query-repository";
import { DeviceRepository } from "./infrastructure/repositories/device-repository";
import { DeviceService } from "./_application/device-service";
import { DeviceController } from "./controllers/device-controller";
import { Container } from "inversify";



// const objects: any[] = []
// //users
// const usersRepository = new UserRepository()
// objects.push(usersRepository)
 export const usersQueryRepository = new UsersQueryRepository() //delete all export except ioc
// objects.push(usersQueryRepository)
// const usersService = new UserService(usersRepository)
// objects.push(usersService)
// export const usersController = new UsersController(usersService)
// objects.push(usersController)

// export const ioc = {
//     getInstance<T>(ClassType: any){
//         const targetInstance = objects.find(o => o instanceof ClassType)
//         return targetInstance as T
//     }
// }

export const container = new Container();

container.bind(UsersController).to(UsersController);
container.bind(UserService).to(UserService);
container.bind(UserRepository).to(UserRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);


//blogs
const blogsRepository = new BlogsRepository()
export const blogQueryRepo = new BlogQueryRepo()
const blogService = new BlogService(blogsRepository)
export const blogsController = new BlogsController(blogService)

//posts
const postsRepository = new PostsRepository()
export const postsQueryRepository = new PostsQueryRepository()
const postService = new PostService(postsRepository)
export const postsController = new PostsController(postService)

//comments
const commentRepository = new CommentRepository()
const commentService = new CommentService(commentRepository)
export const commentController = new CommentController(commentService)

//auth
const authRepository = new AuthRepository()
const authQueryRepository = new AuthRepository()
const authService = new AuthService(authRepository)
export const jwtService = new JwtService(authRepository)
export const authController  = new AuthController(jwtService)

//device
const deviceRepository = new DeviceRepository()
const deviceService = new DeviceService(deviceRepository)
export const deviceController = new DeviceController(deviceService)



