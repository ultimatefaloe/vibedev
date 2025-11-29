"use client";

import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreatePrompt = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [submitting, setsubmitting] = useState(false);
  const [post, setpost] = useState({
    prompt: "",
    tag: "",
  });

  const createPost = async (e) => {
    e.preventDefault();
    setsubmitting(true)

    try {
      const response = await fetch('/api/prompt/new', {
        method:'POST',
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
          userId: session?.user?.id
        })
      })

      if(response.ok){
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally{
      setsubmitting(false)
    }
  };
  return (
    <Form
      type="Create"
      post={post}
      setPost={setpost}
      submitting={submitting}
      handleSubmit={createPost}
    />
  );
};

export default CreatePrompt;
