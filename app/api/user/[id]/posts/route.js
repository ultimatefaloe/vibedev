import { NextResponse } from "next/server";
import connectDB from "@utils/database";
import Post from "@models/Post";

// GET /api/user/[id]/posts
export async function GET(request, { params }) {
  try {
    const creatorId = (await params).id;
    
    await connectDB();
    const posts = await Post.find({ creator: creatorId, deletedAt: null })
      .populate("creator", "username image email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("[GET /api/user/[id]/posts]", error);
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 });
  }
}