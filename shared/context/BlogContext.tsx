"use client";

import { PostProps } from "@/type";
import { createContext, useContext } from "react";

type BlogContextType = {
  posts: PostProps[];
};

export const BlogContext = createContext<BlogContextType | null>({ posts: [] });

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used within BlogProvider");
  return context;
};
