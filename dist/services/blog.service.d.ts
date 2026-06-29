import { type IBlog, type BlogStatus } from "../models/blog.model.js";
import { type IPaginationQuery, type IPaginatedResult } from "../utils/pagination.js";
export interface ICreateBlogInput {
    title: string;
    content: string;
    excerpt: string;
    thumbnail?: string;
    tags?: string[];
    status?: BlogStatus;
}
export interface IUpdateBlogInput {
    title?: string;
    content?: string;
    excerpt?: string;
    thumbnail?: string;
    tags?: string[];
    status?: BlogStatus;
}
declare class BlogService {
    createBlog(authorId: string, input: ICreateBlogInput): Promise<IBlog>;
    getAllBlogs(query: IPaginationQuery & {
        status?: BlogStatus;
        tag?: string;
    }): Promise<IPaginatedResult<IBlog>>;
    getBlogsByAuthor(authorId: string, query: IPaginationQuery): Promise<IPaginatedResult<IBlog>>;
    getBlogBySlug(slug: string): Promise<IBlog>;
    getBlogById(id: string): Promise<IBlog>;
    updateBlog(id: string, authorId: string, input: IUpdateBlogInput): Promise<IBlog>;
    deleteBlog(id: string, authorId: string): Promise<void>;
}
declare const blogService: BlogService;
export default blogService;
//# sourceMappingURL=blog.service.d.ts.map