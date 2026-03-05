"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";

const CATEGORY_COLORS = {
  education: "bg-blue-500/10 text-blue-400",
  coding:    "bg-green-500/10 text-green-400",
  engineering: "bg-orange-500/10 text-orange-400",
  graphic:   "bg-pink-500/10 text-pink-400",
  others:    "bg-[#7c6af7]/10 text-[#a89cf7]",
};

function truncate(text, maxLength = 50) {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength).trimEnd() + "…"
    : cleaned;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ── Icons ────────────────────────────────────────────────────────────────────

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M9.5 1.5a1.414 1.414 0 012 2L4 11H2v-2L9.5 1.5z"
        stroke="currentColor" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.6 7a1 1 0 01-1 .9H4.1a1 1 0 01-1-.9l-.6-7"
        stroke="currentColor" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="none"
      className="animate-spin" aria-hidden>
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor"
        strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M11.5 6.5a5 5 0 00-5-5" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 5.8l5-2.8M4 7.2l5 2.8" stroke="currentColor"
        strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M2.5 6.5l3 3 5-5" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Share button (self-contained) ────────────────────────────────────────────

function ShareButton({ postId, onClick }) {
  const [state, setState] = useState("idle"); // idle | copied | error

  const handleShare = useCallback(async (e) => {
    e.preventDefault();
    onClick?.(); // let parent stop propagation if needed

    const url = `${window.location.origin}/post/${postId}`;

    // Prefer Web Share API on mobile
    if (navigator.share) {
      try {
        await navigator.share({ url, title: "Check out this prompt on VibeDev" });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [postId, onClick]);

  return (
    <button
      onClick={handleShare}
      title="Share post"
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-all ${
        state === "copied"
          ? "bg-green-500/15 text-green-400"
          : state === "error"
          ? "bg-red-500/15 text-red-400"
          : "bg-white/[0.06] hover:bg-white/[0.12] text-[#888] hover:text-white"
      }`}
    >
      {state === "copied" ? <CheckIcon /> : <ShareIcon />}
      <span>{state === "copied" ? "Copied!" : state === "error" ? "Failed" : "Share"}</span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PostCard({ post, onDeleted }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [deleting, setDeleting]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const preview       = truncate(post.content, 50);
  const categoryClass = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.others;
  const authorName    = post.anonymous
    ? "Anonymous"
    : post.creator?.username || "Anonymous";

  const isOwner =
    session?.user?.id &&
    post.creator?._id &&
    session.user.id === post.creator._id.toString();

  const handleEdit = (e) => {
    e.preventDefault();
    router.push(`/post/edit?id=${post._id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setConfirmDelete(true);
  };

  const handleDeleteCancel = (e) => {
    e.preventDefault();
    setConfirmDelete(false);
  };

  const handleDeleteConfirm = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      const res = await fetch(`/api/post/${post._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onDeleted?.(post._id);
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="relative group rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-150">

      {/* ── Owner actions (hover-reveal) ── */}
      {isOwner && !confirmDelete && (
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button onClick={handleEdit} title="Edit"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-[#888] hover:text-white text-[11px] transition-all">
            <EditIcon /><span>Edit</span>
          </button>
          <button onClick={handleDeleteClick} title="Delete"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] hover:bg-red-500/20 text-[#888] hover:text-red-400 text-[11px] transition-all">
            <TrashIcon /><span>Delete</span>
          </button>
        </div>
      )}

      {/* ── Delete confirmation overlay ── */}
      {isOwner && confirmDelete && (
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3 bg-[#0e0e10]/92 backdrop-blur-sm z-10 p-4">
          <p className="text-sm text-white font-medium text-center">Delete this prompt?</p>
          <p className="text-xs text-[#555] text-center">This can&apos;t be undone.</p>
          <div className="flex gap-2 mt-1">
            <button onClick={handleDeleteCancel} disabled={deleting}
              className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-[#aaa] hover:text-white text-xs font-medium transition-all disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} disabled={deleting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 text-xs font-medium transition-all disabled:opacity-50">
              {deleting ? <SpinnerIcon /> : <TrashIcon />}
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </div>
      )}

      {/* ── Card body ── */}
      <Link
        href={`/post/get/${post._id}`}
        className="block p-4"
        tabIndex={confirmDelete ? -1 : 0}
        aria-hidden={confirmDelete}
      >
        {/* Top row: category badge + timestamp */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${categoryClass}`}>
            {post.category}
          </span>
          <span className="text-[11px] text-[#555]">{timeAgo(post.createdAt)}</span>
        </div>

        {/* Optional title */}
        {post.title && (
          <p className="text-sm font-semibold text-white mb-1 line-clamp-1 pr-16">
            {post.title}
          </p>
        )}

        {/* Content preview */}
        <p className="text-[13px] text-[#999] font-mono leading-relaxed">
          {preview}
        </p>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-[#555]">
            {post.anonymous ? "👤 Anonymous" : `@${authorName}`}
          </span>

          {/* Right side: share button + read more hint */}
          <div className="flex items-center gap-2">
            {/* Share — stops link propagation via e.preventDefault in handler */}
            <ShareButton postId={post._id} />

            <span className="text-[11px] text-[#7c6af7] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
              Read →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}