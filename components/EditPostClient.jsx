"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm from "@components/PostForm";
import Link from "next/link";
import { toast } from "react-toastify";

export default function EditPostClient() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [post, setPost] = useState({ title: "", content: "", category: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setFetchError("No post ID provided.");
      setLoading(false);
      return;
    }

    console.log("Fetching post data for ID:", postId);
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${postId}`);
        if (!res.ok) throw new Error("Post not found.");
        const data = await res.json();
        setPost({
          title: data.title || "",
          content: data.content || "",
          category: data.category || "",
        });
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!post.content?.trim()) { setError("Content is required."); return; }
    if (!post.category) { setError("Please select a category."); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/post/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update post.");
        throw new Error(data.error || "Failed to update post.");
      }

      toast.success("Post updated successfully!");
      router.push(`/post/${postId}`);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Auth guard
  if (status === "unauthenticated") {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-[#666] text-sm mb-4">
          You need to be signed in to edit a post.
        </p>
        <Link href="/" className="text-xs text-[#7c6af7] hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={postId ? `/post/${postId}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm text-[#666] hover:text-white mb-6 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">Edit prompt</h1>
        <p className="text-[#666] text-sm">Update your prompt content or category.</p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-5">
          <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
          <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
          <div className="h-40 rounded-lg bg-white/[0.04] animate-pulse" />
        </div>
      )}

      {/* Fetch error */}
      {!loading && fetchError && (
        <div className="text-center py-12">
          <p className="text-red-400 text-sm mb-4">{fetchError}</p>
          <Link href="/" className="text-xs text-[#7c6af7] hover:underline">
            ← Back to home
          </Link>
        </div>
      )}

      {/* Form */}
      {!loading && !fetchError && (
        <>
          {error && (
            <p className="mb-5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <PostForm
            mode="edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            onSubmit={handleEdit}
          />
        </>
      )}
    </div>
  );
}