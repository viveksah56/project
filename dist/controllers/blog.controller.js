import blogService from "../services/blog.service.js";
import { ApiError } from "../utils/AppError.js";
class BlogController {
    async createBlog(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const blog = await blogService.createBlog(req.user._id, req.body);
            res.status(201).json({ success: true, message: "Blog created successfully", data: blog });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllBlogs(req, res, next) {
        try {
            const result = await blogService.getAllBlogs(req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlogsByAuthor(req, res, next) {
        try {
            const result = await blogService.getBlogsByAuthor(req.params.authorId, req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async getMyBlogs(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const result = await blogService.getBlogsByAuthor(req.user._id, req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlogBySlug(req, res, next) {
        try {
            const blog = await blogService.getBlogBySlug(req.params.slug);
            res.status(200).json({ success: true, data: blog });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlogById(req, res, next) {
        try {
            const blog = await blogService.getBlogById(req.params.id);
            res.status(200).json({ success: true, data: blog });
        }
        catch (error) {
            next(error);
        }
    }
    async updateBlog(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const blog = await blogService.updateBlog(req.params.id, req.user._id, req.body);
            res.status(200).json({ success: true, message: "Blog updated successfully", data: blog });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteBlog(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            await blogService.deleteBlog(req.params.id, req.user._id);
            res.status(200).json({ success: true, message: "Blog deleted successfully", data: null });
        }
        catch (error) {
            next(error);
        }
    }
}
const blogController = new BlogController();
export default blogController;
//# sourceMappingURL=blog.controller.js.map