import { notFound } from "next/navigation";
import connectDB from "@utils/database";
import Post from "@models/Post";
import Link from "next/link";
import CopyButton from "@components/CopyButton";

const CATEGORY_COLORS = {
  education: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  coding: "bg-green-500/10 text-green-400 border-green-500/20",
  engineering: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  graphic: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  others: "bg-[#7c6af7]/10 text-[#a89cf7] border-[#7c6af7]/20",
};

// Fetch on server side
async function getPost(id) {
  try {
    await connectDB();
    const post = await Post.findById(id)
      .populate("creator", "username image")
      .lean();
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title || `${post.category} prompt | VibeDev`,
    description: post.content.slice(0, 120),
  };
}

export default async function PostPage({ params }) {
  const id = (await params).id;
  const post = await getPost(id);

  if (!post) notFound();

  const categoryClass =
    CATEGORY_COLORS[post.category] || CATEGORY_COLORS.others;
  const authorName = post.anonymous
    ? "Anonymous"
    : post.creator?.username || "Anonymous";

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
          <span>{post.anonymous ? "👤 Anonymous" : `@${authorName}`}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
