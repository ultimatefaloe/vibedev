"use client";

import { useEffect, useState } from "react";
import PromptCardList from "./PromptCardList";

const Feed = () => {
  const [searchText, setsearchText] = useState("");
  const [posts, setposts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setposts(data);
    };

    fetchPosts();
  }, []);

  const handleSearchChange = () => {};
  return (
    <section className="feed">
      <form action="" className="relative w-full flex-center">
        <input
          className="search_input peer"
          type="text"
          placeholder="Search for a tag, username or prompt"
          value={searchText}
          onChange={handleSearchChange}
          required
        />
      </form>

      <PromptCardList data={posts} habdleTagClick={() => {}} />
    </section>
  );
};

export default Feed;
