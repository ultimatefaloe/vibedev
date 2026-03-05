import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import connectDB from "@utils/database";
import Post from "@models/Post";
import User from "@models/User";

export const dynamic = "force-dynamic";

// POST /api/post/new
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, content, category, anonymous } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Try to get logged-in user
    let creatorId = null;
    const session = await getServerSession(authOptions);

    if (session?.user?.email && !anonymous) {
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user) creatorId = user._id;
    }

    const post = await Post.create({
      title: title?.trim() || undefined,
      content: content.trim(),
      category: category.toLowerCase(),
      creator: creatorId,
      anonymous: anonymous || !creatorId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[POST /api/post/new]", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}