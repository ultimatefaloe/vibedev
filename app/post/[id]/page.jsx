import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@components/CopyButton";

export const dynamic = "force-dynamic";

const CATEGORY_COLORS = {
  education:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  coding:      "bg-green-500/10 text-green-400 border-green-500/20",
  engineering: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  graphic:     "bg-pink-500/10 text-pink-400 border-pink-500/20",
  others:      "bg-[#7c6af7]/10 text-[#a89cf7] border-[#7c6af7]/20",
};

/**
 * Fetch via the internal API route instead of querying MongoDB directly.
 *
 * Why: On Vercel, server components run in isolated serverless functions.
 * Calling connectDB() + Mongoose directly inside a page means a fresh cold
 * connection every invocation with no guarantee the connection pool is ready
 * before the function times out. Fetching from the API route lets the route
 * handler manage the connection through the global cache in database.js,
 * and returns a clean, already-serialized JSON payload — no Date/ObjectId
 * serialization issues.
 *
 * NEXT_PUBLIC_BASE_URL must be set in Vercel env vars, e.g.:
 *   https://your-app.vercel.app   (no trailing slash)
 */
async function getPost(id) {
  try {
    // Validate ObjectId format — 24 hex chars — before hitting the network
    if (!/^[a-f\d]{24}$/i.test(id)) return null;

    const base_url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res  = await fetch(`${base_url}/api/post/${id}`, {
      cache: "no-store", // always fresh — consistent with force-dynamic
    });
``
    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("[PostPage] getPost error:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Post not found | VibeDev",
      description: "This prompt does not exist or has been removed.",
    };
  }

  return {
    title: post.title
      ? `${post.title} | VibeDev`
      : `${post.category} prompt | VibeDev`,
    description: post.content?.slice(0, 120) ?? "",
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;

  console.log("[PostPage] rendering id:", id);

  const post = await getPost(id);

  if (!post) {
    console.log("[PostPage] post not found for id:", id);
    notFound();
  }

  const categoryClass =
    CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.others;

  const authorName = post.anonymous
    ? "Anonymous"
    : post.creator?.username ?? "Anonymous";

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year:  "numeric",
        month: "short",
        day:   "numeric",
      })
    : "";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#666] hover:text-white mb-8 transition-colors"
      >
        ← Back
      </Link>

      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border w-fit ${categoryClass}`}
            >
              {post.category}
            </span>
            {post.title && (
              <h1 className="text-xl font-bold text-white leading-snug">
                {post.title}
              </h1>
            )}
          </div>
          <CopyButton text={post.content} />
        </div>

        {/* Content */}
        <div className="rounded-xl bg-[#161618] border border-white/[0.06] p-4 sm:p-5">
          <pre className="text-[13px] text-[#ccc] font-mono whitespace-pre-wrap leading-relaxed">
            {post.content}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#555]">
          <span>
            {post.anonymous ? "👤 Anonymous" : `@${authorName}`}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}