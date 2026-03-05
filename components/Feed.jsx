"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";

const CATEGORIES = ["all", "education", "coding", "engineering", "graphic", "others"];

const CATEGORY_LABELS = {
  all: "All",
  education: "Education",
  coding: "Coding",
  engineering: "Engineering",
  graphic: "Graphic",
  others: "Others",
};

// Reusable card-shape skeleton
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-16 rounded-full bg-white/[0.06] animate-pulse" />
        <div className="h-4 w-10 rounded bg-white/[0.04] animate-pulse" />
      </div>
      <div className="h-3 w-3/4 rounded bg-white/[0.06] animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-white/[0.04] animate-pulse" />
      <div className="flex justify-between pt-1">
        <div className="h-3 w-20 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-14 rounded bg-white/[0.04] animate-pulse" />
      </div>
    </div>
  );
}

export default function Feed() {
  const [posts, setPosts]               = useState([]);
  const [activeCategory, setCategory]   = useState("all");
  // null  = not yet determined
  // ""    = no more pages
  // "<ISO>" = cursor for next fetch
  const [nextCursor, setNextCursor]     = useState(null);
  const [initialLoading, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [error, setError]               = useState(null);

  // Sentinel div at the bottom of the list — IntersectionObserver watches it
  const sentinelRef = useRef(null);
  // Track in-flight requests to avoid double-fetching
  const fetchingRef = useRef(false);

  // ── Core fetch function ──────────────────────────────────────────────────
  const fetchPage = useCallback(async ({ category, cursor, replace }) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    replace ? setInitialLoad(true) : setLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (cursor) params.set("cursor", cursor);

      const res = await fetch(`/api/post?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load posts");

      const { posts: incoming, nextCursor: next } = await res.json();

      setPosts((prev) => (replace ? incoming : [...prev, ...incoming]));
      setNextCursor(next ?? ""); // "" signals "no more pages"
    } catch (err) {
      console.error(err);
      setError("Could not load posts. Please try again.");
    } finally {
      replace ? setInitialLoad(false) : setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, []);

  // ── Initial / category-change load ──────────────────────────────────────
  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    fetchPage({ category: activeCategory, cursor: null, replace: true });
  }, [activeCategory, fetchPage]);

  // ── IntersectionObserver: load next page when sentinel enters viewport ──
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          nextCursor &&         // "" means exhausted
          !fetchingRef.current
        ) {
          fetchPage({
            category: activeCategory,
            cursor: nextCursor,
            replace: false,
          });
        }
      },
      { rootMargin: "200px" } // start loading 200px before the sentinel appears
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, activeCategory, fetchPage]);

  // ── Optimistic delete ────────────────────────────────────────────────────
  const handleDeleted = useCallback((deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  }, []);

  // ── Category switch ──────────────────────────────────────────────────────
  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setCategory(cat);
  };

  return (
    <div>
      {/* ── Category filter tabs ── */}
      <div className="flex gap-1.5 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#7c6af7] text-white"
                : "bg-white/[0.06] text-[#888] hover:text-white hover:bg-white/[0.10]"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* ── Initial loading skeleton ── */}
      {initialLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Error state ── */}
      {!initialLoading && error && (
        <div className="text-center py-12">
          <p className="text-[#f87171] text-sm mb-3">{error}</p>
          <button
            onClick={() =>
              fetchPage({ category: activeCategory, cursor: null, replace: true })
            }
            className="text-xs text-[#7c6af7] hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!initialLoading && !error && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#555] text-sm">No posts yet in this category.</p>
          <a
            href="/post/create"
            className="mt-4 inline-block text-xs text-[#7c6af7] hover:underline"
          >
            Be the first to post →
          </a>
        </div>
      )}

      {/* ── Post grid ── */}
      {!initialLoading && !error && posts.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDeleted={handleDeleted} />
            ))}
          </div>

          {/* ── Load-more skeleton (appended below existing cards) ── */}
          {loadingMore && (
            <div className="grid gap-3 sm:grid-cols-2 mt-3">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── End-of-feed message ── */}
          {nextCursor === "" && !loadingMore && (
            <p className="text-center text-[#444] text-xs mt-10 pb-2">
              You&apos;ve reached the end ·{" "}
              <a href="/post/create" className="text-[#7c6af7] hover:underline">
                add a prompt
              </a>
            </p>
          )}

          {/* ── Invisible sentinel — triggers next page load ── */}
          <div ref={sentinelRef} className="h-1" aria-hidden />
        </>
      )}
    </div>
  );
}