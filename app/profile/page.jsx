"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import PostCard from "@components/PostCard";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/user/${session.user.id}/posts`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleDeleted = useCallback((deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-20">
        <div className="w-5 h-5 rounded-full border-2 border-[#7c6af7] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-[#666] mb-4 text-sm">Sign in to view your profile.</p>
        <button
          onClick={() => signIn("google")}
          className="px-5 py-2 bg-[#7c6af7] hover:bg-[#6a59e0] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-10">
        {session.user.image ? (
          <Image src={session.user.image} alt="avatar" width={52} height={52} className="rounded-full" />
        ) : (
          <div className="w-13 h-13 rounded-full bg-[#7c6af7] flex items-center justify-center text-xl font-bold text-white">
            {session.user.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-white font-semibold">{session.user.name}</p>
          <p className="text-[#555] text-sm">{session.user.email}</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-[#888] uppercase tracking-widest mb-4">
        Your prompts {!loading && `(${posts.length})`}
      </h2>

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#555] text-sm mb-3">You haven&apos;t posted anything yet.</p>
          <a href="/post/create" className="text-xs text-[#7c6af7] hover:underline">
            Create your first prompt →
          </a>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}