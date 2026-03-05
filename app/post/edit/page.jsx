import EditPostClient from "@components/EditPostClient";
import { Suspense } from "react";

export const metadata = {
  title: "Edit Prompt | VibeDev",
};

// Skeleton shown while the client component hydrates and reads search params
function EditSkeleton() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <div className="h-4 w-16 rounded bg-white/[0.04] animate-pulse mb-6" />
        <div className="h-7 w-40 rounded bg-white/[0.04] animate-pulse mb-2" />
        <div className="h-4 w-64 rounded bg-white/[0.04] animate-pulse" />
      </div>
      <div className="flex flex-col gap-5">
        <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-40 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
      </div>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={<EditSkeleton />}>
      <EditPostClient />
    </Suspense>
  );
}