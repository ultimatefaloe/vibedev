"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const CATEGORIES = ["education", "coding", "engineering", "graphic", "others"];

/**
 * PostForm — dual-mode form for creating and editing posts.
 *
 * CREATE mode (default): manages its own internal state.
 *   <PostForm />
 *
 * EDIT mode: controlled externally — parent owns state and submit handler.
 *   <PostForm
 *     mode="edit"
 *     post={post}
 *     setPost={setPost}
 *     submitting={submitting}
 *     onSubmit={handleEdit}
 *   />
 */

export default function PostForm({
  mode = "create",
  post: externalPost,
  setPost,
  submitting: externalSubmitting,
  onSubmit,
}) {
  const isEditMode = mode === "edit";
  const router = useRouter();
  const { data: session } = useSession();

  // Internal state — only used in create mode
  const [internalForm, setInternalForm] = useState({
    title: "",
    content: "",
    category: "",
    anonymous: false,
  });
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Resolve which state to use based on mode
  const form = isEditMode ? externalPost : internalForm;
  const submitting = isEditMode ? externalSubmitting : internalSubmitting;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = { ...form, [name]: type === "checkbox" ? checked : value };
    if (isEditMode) {
      setPost(updated);
    } else {
      setInternalForm(updated);
    }
  };

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!internalForm.content?.trim()) {
      setError("Content is required.");
      return;
    }
    if (!internalForm.category) {
      setError("Please select a category.");
      return;
    }

    setInternalSubmitting(true);
    try {
      const res = await fetch("/api/post/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(internalForm),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create post");
        throw new Error(data.error || "Failed to create post");
      }
      toast.success("Post created successfully!");
      const created = await res.json();
      router.push(`/post/${created._id}`);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setInternalSubmitting(false);
    }
  };

  const handleSubmit = isEditMode ? onSubmit : handleInternalSubmit;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-[#888] mb-1.5">
          Title <span className="text-[#555]">(optional)</span>
        </label>
        <input
          name="title"
          value={form?.title || ""}
          onChange={handleChange}
          placeholder="Give your prompt a short title…"
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#7c6af7]/60 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-[#888] mb-1.5">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={form?.category || ""}
          onChange={handleChange}
          className="w-full bg-[#161618] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c6af7]/60 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Select a category…
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-medium text-[#888] mb-1.5">
          Prompt <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={form?.content || ""}
          onChange={handleChange}
          rows={8}
          placeholder="Paste or write your AI prompt here…"
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-3 text-sm text-white placeholder-[#444] font-mono focus:outline-none focus:border-[#7c6af7]/60 focus:bg-white/[0.06] transition-all resize-y min-h-[140px]"
        />
      </div>

      {/* Anonymous toggle — hidden in edit mode, ownership is already set */}
      {!isEditMode && (
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              name="anonymous"
              checked={form?.anonymous || !session}
              onChange={handleChange}
              disabled={!session}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/[0.08] rounded-full peer-checked:bg-[#7c6af7] transition-colors peer-disabled:opacity-50" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
          </div>
          <div>
            <span className="text-sm text-[#ccc]">Post anonymously</span>
            {!session && (
              <p className="text-[11px] text-[#555] mt-0.5">
                Sign in to post under your name
              </p>
            )}
          </div>
        </label>
      )}

      {/* Error — only in create mode; edit page manages its own */}
      {!isEditMode && error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full py-2.5 rounded-lg bg-[#7c6af7] hover:bg-[#6a59e0] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {submitting
          ? isEditMode ? "Saving…" : "Publishing…"
          : isEditMode ? "Save changes" : "Publish prompt"}
      </button>
    </form>
  );
}