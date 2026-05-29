"use client";

import { BlogContext } from "@/shared/context/BlogContext";
import { ChevronLeft, Search } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import commentTree from "./commentTree";

const categoryBg = [
  "bg-se1",
  "bg-pr2",
  "bg-pr1",
  "bg-se2",
  "bg-se2",
  "bg-se6",
  "bg-se7",
];

export default function BlogLayout({ children }: { children: ReactNode }) {
  const [rawPosts, setRawPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setRawPosts(data);
        setLoading(false);
      });
  }, []);

  const buildPost = rawPosts.map((post) => ({
    ...post,
    comments: commentTree(
      post.comments
        .filter((c: any) => c.post_id === post.id)
        .map((c: any) => ({ ...c, replies: [] })),
    ),
  }));

  const posts = buildPost.filter((post) =>
    `${post.title} ${post.text}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <BlogContext.Provider value={{ posts, loading }}>
      <section className="mb-6 max-w-7xl mx-auto py-2">
        {/* Header */}
        <div className="fixed w-full top-nh flex flex-col sm:flex-row bg-se5 gap-3 py-2 justify-between z-40 border border-b-pr1">
          <div className="flex gap-4 items-center">
            <button className="flex text-pr1" onClick={() => router.back()}>
              <span className="text-sm">
                <ChevronLeft />
              </span>
              <span>Back</span>
            </button>
            <h1 className="mb-0! text-xl! tracking-wide sm:text-3xl! ml-9">
              Our Blog
            </h1>
          </div>

          <div className="relative sm:w-[30%] mx-5">
            <input
              type="search"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <span className="absolute bg-pr1 h-full right-0 w-11 rounded-r-full" />

            <Search className="absolute inset-y-0 right-3 h-full text-white" />
          </div>
        </div>

        <div className="flex mt-nh">
          {/* Mobile Sidebar */}
          {/* <div className="space-y-8 md:hidden">
            <details className="bg-white rounded-lg shadow p-5">
              <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
                Popular Posts
              </summary>
              <ul className="mt-3 space-y-2">
                {popularPosts.map((post) => (
                  <li
                    key={post}
                    className="text-gray-600 hover:underline text-sm"
                  >
                    {post}
                  </li>
                ))}
              </ul>
            </details>

            <details className="bg-white rounded-lg shadow p-5">
              <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
                Categories
              </summary>
              <ul className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className="text-gray-600 hover:underline text-sm"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </details>
          </div> */}

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto">{children}</main>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8 px-4 sticky h-fit">
            {/* Popular Posts */}
            <div className="bg-white rounded-lg shadow p-5 border">
              <h3 className="text-lg font-semibold text-pr1 pb-2 border-b">
                Popular Posts
              </h3>
              <ul className="space-y-2">
                {popularPosts.map((post, idx) => (
                  <li
                    key={idx}
                    className="text-pr2 hover:underline text-sm cursor-pointer py-2 border-b"
                  >
                    {post}
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg p-5 shadow border">
              <h3 className="text-lg font-semibold text-pr1 pb-2 border-b">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category, idx) => (
                  <li key={idx} className="rounded-l-md overflow-hidden">
                    <p
                      className={`text-white ${categoryBg[idx]} rounded-r-full hover:underline text-sm cursor-pointer px-9 py-2`}
                    >
                      {category}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </BlogContext.Provider>
  );
}

const styles = {
  searchInput: `w-full border bg-[#fefefe] rounded-full border-[#ddd] px-4 py-2 
  text-sm placeholder:text-slate-400 shadow-lg focus:border-se2 
  outline-none transition`,

  searchGlass: `pointer-events-none absolute h-full w-10 border-br-rounded inset-y-0 right-0 
  flex items-center text-pr1 bg-red-500`,
};

const popularPosts = [
  "Ten Ways to Boost Your Productivity with AI",
  "Future of Remote Work in 2024: Trends to Watch",
  "How AI is Changing the Healthcare Landscape",
];

const categories = ["Technology", "Business", "Lifestyle", "Travel"];

const PopularP = () => <li></li>;
