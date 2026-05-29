"use client";

import { Post } from "@/type";
import { createContext, useContext } from "react";

type BlogContextType = {
  posts: Post[];
  loading: boolean;
};

export const BlogContext = createContext<BlogContextType | null>(null);

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used within BlogProvider");
  return context;
};
