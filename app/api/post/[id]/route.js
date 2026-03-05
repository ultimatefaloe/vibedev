import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import connectDB from "@utils/database";
import Post from "@models/Post";
import User from "@models/User";

// GET /api/post/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();

    const post = await Post.findOne({ _id: params.id, deletedAt: null })
      .populate("creator", "username image email")
      .lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("[GET /api/post/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// Helper: resolve session user and verify they own the post
async function authorizeOwner(request, postId) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Unauthorized", status: 401 };

  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return { error: "Unauthorized", status: 401 };

  const post = await Post.findOne({ _id: postId, deletedAt: null }).lean();
  if (!post) return { error: "Post not found", status: 404 };

  // Only the creator may mutate the post
  if (!post.creator || post.creator.toString() !== user._id.toString()) {
    return { error: "Forbidden", status: 403 };
  }

  return { user, post };
}

// PATCH /api/post/[id]
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const auth = await authorizeOwner(request, params.id);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { title, content, category } = await request.json();

    const updated = await Post.findByIdAndUpdate(
      params.id,
      { title, content, category },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/post/[id]]", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE /api/post/[id]  — soft delete: sets deletedAt timestamp
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const auth = await authorizeOwner(request, params.id);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await Post.findByIdAndUpdate(params.id, { deletedAt: new Date() });

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/post/[id]]", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}