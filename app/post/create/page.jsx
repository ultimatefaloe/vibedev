import PostForm from "@components/PostForm";

export const metadata = {
  title: "New Post | VibeDev",
};

export default function CreatePostPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Share a prompt</h1>
      <p className="text-[#666] text-sm mb-8">
        Post anonymously or as yourself. No account required.
      </p>
      <PostForm />
    </div>
  );
}