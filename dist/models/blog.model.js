import mongoose, { Document, Schema } from "mongoose";
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    thumbnail: {
        type: String,
        default: null,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
//# sourceMappingURL=blog.model.js.map