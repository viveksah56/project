import mongoose, { Document, Schema } from "mongoose";

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

const blogSchema = new Schema<IBlog>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;