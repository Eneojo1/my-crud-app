"use client";

import { useBlog } from "@/shared/context/BlogContext";
import PostCard from "./postCard";

const Posts = () => {
  const { posts } = useBlog();

  return (
    <div className="overflow-y-auto h-[calc(100vh-120px)] p-3 space-y-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
