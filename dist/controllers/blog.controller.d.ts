import type { Request, Response, NextFunction } from "express";
declare class BlogController {
    createBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBlogsByAuthor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyBlogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBlogById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const blogController: BlogController;
export default blogController;
//# sourceMappingURL=blog.controller.d.ts.map