import { Schema, model, models } from "mongoose";

const CATEGORIES = ["education", "coding", "engineering", "graphic", "others"];

const PostSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
      lowercase: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// deletedAt is included in indexes so { deletedAt: null } filter is index-covered
PostSchema.index({ deletedAt: 1, category: 1, createdAt: -1 });
PostSchema.index({ deletedAt: 1, createdAt: -1 });

const Post = models.Post || model("Post", PostSchema);

export default Post;