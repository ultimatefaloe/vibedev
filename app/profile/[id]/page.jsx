"use client";

import Profile from "@components/Profile";
import { useParams } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const MyProfile = () => {
  // const { data: session } = useSession();
  // const router = useRouter();
  const params = useParams();
  const userId = params.id
  const [posts, setPosts] = useState([]);

  console.log(userId)

  useEffect(() => {
    const fetchUserPosts = async () => {
      const response = await fetch(`/api/user/${userId}/posts`);

      const data = await response.json();
      setPosts(data);
    };

    if (userId) {
      fetchUserPosts();
    }
  }, []);

  // const handleEdit = (post) => {
  //   router.push(`/update-prompt?id=${post._id}`);
  // };

  // const handleDelete = async (post) => {
  //   const promptId = post._id
  //   const consent = confirm("Are you sure you want to delete");

  //   if (consent) {
  //     await fetch(`/api/prompt/${promptId}`, {
  //       method: "DELETE",
  //     });

  //     const filterPosts = posts.filter((p)=> p !== post._id);

  //     setPosts(filterPosts)
  //   }
  // };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      // handleEdit={handleEdit}
      // handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
