"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const [copied, setcopied] = useState("");
  const { data: session } = useSession();
  const pathName = usePathname()
  const router = useRouter();

  const handleCopy = () => {
    setcopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setcopied(""), 3000);
  };

  const handleProfilePost = () => {
    router.push(`/profile/${post.creator._id}`)
  }

  return (
    <div className="prompt_card">
      <div className=" flex, gap-5 justify-between items-start">
        <div className="flex flex-1 justify-start items-center gap-3 cursor-pointer" onClick={handleProfilePost}>
          <Image
            src={post?.creator?.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-blue-700">
              {post?.creator?.username || "Anonymous"}
            </h3>
            <p className="text-blue-500">{post?.creator?.email || ''}</p>
          </div>

          <div className="copy_btn">
            <Image
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt="copy_clipboard"
              width={12}
              height={12}
              onClick={handleCopy}
            />
          </div>
        </div>
      </div>
      <p className="font-satoshi font-medium test-sm text-gray-700">
        {post.prompt}
      </p>
      <p
        className="text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      {session?.user?.id === post?.creator?._id && pathName === "/profile" && (
        <div className=" flex flex-end gap-4 mt-5 border-t-2 border-blue-600">
          <p
            className="cursor-pointer text-sm green_gradient"
            onClick={handleEdit}
          >
            Edit
          </p>
           <p
            className="cursor-pointer text-sm text-red-700"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
