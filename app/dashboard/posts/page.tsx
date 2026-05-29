"use client";

import { useBlog } from "@/shared/context/BlogContext";
import PostCard from "./postCard";
import Loading from "@/components/Loading";

const Posts = () => {
  const { posts, loading } = useBlog();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loading />
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-40 text-center">
        <h2 className="text-lg font-semibold text-gray-700">
          No Posts Available
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          There are currently no posts to display.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100vh-120px)] p-3 space-y-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
