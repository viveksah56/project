import mongoose, { Document } from "mongoose";
export type BlogStatus = "draft" | "published" | "archived";
export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    thumbnail?: string;
    author: mongoose.Types.ObjectId;
    tags: string[];
    status: BlogStatus;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Blog: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
export default Blog;
//# sourceMappingURL=blog.model.d.ts.map