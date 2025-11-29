"use client";

import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditPrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setsubmitting] = useState(false);
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const [post, setpost] = useState({});

  useEffect(() => {
    const fetchUserPosts = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);

      const data = await response.json();
      setpost(data);
    };

    if (promptId) {
      fetchUserPosts();
    }
  }, [promptId]);

  const editPrompt = async (e) => {
    e.preventDefault();
    setsubmitting(true);

    console.log('This is my post', {post})

    if (!promptId) alert("PromptId requires");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setsubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setpost}
      submitting={submitting}
      handleSubmit={editPrompt}
    />
  );
};

export default EditPrompt;
