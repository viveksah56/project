import Blog, {} from "../models/blog.model.js";
import { ApiError } from "../utils/AppError.js";
import { generateSlug } from "../utils/slugGenerator.js";
import { getPaginationParams, buildPaginationMeta, } from "../utils/pagination.js";
class BlogService {
    async createBlog(authorId, input) {
        const slug = await generateSlug(input.title);
        const blog = await Blog.create({
            ...input,
            slug,
            author: authorId,
        });
        return blog.populate("author", "name email avatar");
    }
    async getAllBlogs(query) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
        const filter = {
            status: query.status || "published",
        };
        if (query.search) {
            filter.$or = [
                { title: { $regex: query.search, $options: "i" } },
                { excerpt: { $regex: query.search, $options: "i" } },
                { tags: { $regex: query.search, $options: "i" } },
            ];
        }
        if (query.tag) {
            filter.tags = { $in: [query.tag] };
        }
        const [data, total] = await Promise.all([
            Blog.find(filter)
                .populate("author", "name email avatar")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Blog.countDocuments(filter),
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit),
        };
    }
    async getBlogsByAuthor(authorId, query) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
        const filter = { author: authorId };
        const [data, total] = await Promise.all([
            Blog.find(filter)
                .populate("author", "name email avatar")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Blog.countDocuments(filter),
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit),
        };
    }
    async getBlogBySlug(slug) {
        const blog = await Blog.findOneAndUpdate({ slug, status: "published" }, { $inc: { views: 1 } }, { new: true }).populate("author", "name email avatar");
        if (!blog) {
            throw new ApiError("Blog not found", 404);
        }
        return blog;
    }
    async getBlogById(id) {
        const blog = await Blog.findById(id).populate("author", "name email avatar");
        if (!blog) {
            throw new ApiError("Blog not found", 404);
        }
        return blog;
    }
    async updateBlog(id, authorId, input) {
        const blog = await Blog.findById(id);
        if (!blog) {
            throw new ApiError("Blog not found", 404);
        }
        if (String(blog.author) !== authorId) {
            throw new ApiError("You are not authorized to update this blog", 403);
        }
        if (input.title && input.title !== blog.title) {
            input.slug = await generateSlug(input.title);
        }
        const updated = await Blog.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true,
        }).populate("author", "name email avatar");
        return updated;
    }
    async deleteBlog(id, authorId) {
        const blog = await Blog.findById(id);
        if (!blog) {
            throw new ApiError("Blog not found", 404);
        }
        if (String(blog.author) !== authorId) {
            throw new ApiError("You are not authorized to delete this blog", 403);
        }
        await Blog.findByIdAndDelete(id);
    }
}
const blogService = new BlogService();
export default blogService;
//# sourceMappingURL=blog.service.js.map