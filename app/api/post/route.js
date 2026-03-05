import { NextResponse } from "next/server";
import connectDB from "@utils/database";
import Post from "@models/Post";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

/**
 * GET /api/post
 *   ?category=coding        — filter by category (omit or "all" for everything)
 *   ?cursor=<ISO-timestamp> — fetch posts older than this createdAt value
 *   ?limit=20               — optional override (max 50)
 *
 * Returns:
 *   { posts: [...], nextCursor: "<ISO>" | null }
 *
 * Cursor-based pagination is used instead of page offsets because:
 *  - New posts inserted between requests don't shift pages
 *  - Skipping N documents on large collections is O(N); cursor uses the index
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const cursor    = searchParams.get("cursor");   // ISO date string
    const limit     = Math.min(
      parseInt(searchParams.get("limit") || PAGE_SIZE, 10),
      50  // hard cap — prevents abuse
    );

    const filter = {
      deletedAt: null,
      ...(category && category !== "all" ? { category } : {}),
      // If a cursor is supplied, only return posts older than it
      ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
    };

    // Fetch one extra doc to determine whether another page exists
    const posts = await Post.find(filter)
      .populate("creator", "username image email")
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = posts.length > limit;
    const page    = hasMore ? posts.slice(0, limit) : posts;

    // The next cursor is the createdAt of the last post in this page
    const nextCursor = hasMore
      ? page[page.length - 1].createdAt.toISOString()
      : null;

    return NextResponse.json({ posts: page, nextCursor }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/post]", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}