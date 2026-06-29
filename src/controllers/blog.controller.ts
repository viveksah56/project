import type { Request, Response, NextFunction } from "express";
import blogService from "../services/blog.service.js";
import { ApiError } from "../utils/AppError.js";

class BlogController {
  async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError("Unauthorized", 401);
      const blog = await blogService.createBlog(req.user._id, req.body);
      res.status(201).json({ success: true, message: "Blog created successfully", data: blog });
    } catch (error) {
      next(error);
    }
  }

  async getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.getAllBlogs(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getBlogsByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.getBlogsByAuthor(req.params.authorId as string, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getMyBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError("Unauthorized", 401);
      const result = await blogService.getBlogsByAuthor(req.user._id, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await blogService.getBlogBySlug(req.params.slug as string);
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await blogService.getBlogById(req.params.id as string);
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError("Unauthorized", 401);
      const blog = await blogService.updateBlog(req.params.id as string, req.user._id, req.body);
      res.status(200).json({ success: true, message: "Blog updated successfully", data: blog });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError("Unauthorized", 401);
      await blogService.deleteBlog(req.params.id as string, req.user._id);
      res.status(200).json({ success: true, message: "Blog deleted successfully", data: null });
    } catch (error) {
      next(error);
    }
  }
}

const blogController = new BlogController();
export default blogController;