"use client";

import { MessageSquare, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { author, formatNumber, timeAgo } from "@/shared/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Composer from "../composer";
import Comment from "../comment";
import Image from "next/image";
import { useBlog } from "@/shared/context/BlogContext";
import Loading from "@/components/Loading";
import { useReaction } from "@/hooks/useReaction";
import { dataset } from "../dataset";

const PostPage = () => {
  const [showComposer, setShowComposer] = useState(false);
  const params = useParams();
  const { posts } = useBlog();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    if (showComposer) scrollToBottom();
  }, [showComposer]);

  const post = posts.find((post) => String(post.id) === params.id);

  const user = dataset.users.find((u) => u.id === 7);
  const userId = user?.id;

  const { likes, dislikes, isLiked, isDisliked, loading, toggleReaction } =
    useReaction({
      commentId: null,
      postId: Number(post?.id),
      initialLikes: post?.likes,
      initialDislikes: post?.dislikes,
      userId: user?.id ? Number(user.id) : null,
    });

  if (!posts.length) return <Loading />;
  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-9 h-[calc(100vh-120px)] overflow-auto bg-se4">
      {/* Thumbnail */}
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={100}
          height={100}
          className="rounded-lg object-cover w-full mb-6"
        />
      )}

      {/* Title */}
      <h2 className="text-3xl font-bold text-pr1 mb-1 pb-1 border-b">
        {post.title}
      </h2>

      <div className="flex gap-2 items-center border-b py-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.author.avatar} />
        </Avatar>
        <p className="text-sm text-gray-500">
          <strong>{author(post.author)}</strong>
          <span className="block text-xs">{timeAgo(post.updated_at)}</span>
        </p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statsRow}>
          <button
            className={`flex gap-0.5 items-center ${isLiked ? "text-pr2" : ""}`}
            onClick={() => toggleReaction("like")}
          >
            <ThumbsUp size={16} />
            <span className="text-sm text-gray-500">
              {formatNumber(likes.length)}
            </span>
          </button>

          <button
            onClick={() => toggleReaction("dislike")}
            className={`flex gap-0.5 items-center ${
              isDisliked ? "text-pr2" : ""
            }`}
          >
            <ThumbsDown size={16} />

            <span className="text-sm">{formatNumber(dislikes.length)}</span>
          </button>
          <span
            className={styles.statItem}
            onClick={() => {
              scrollToBottom();
              setShowComposer(true);
            }}
          >
            <MessageSquare size={16} /> {post.comments?.length}
          </span>
          <span className={styles.statItem}>
            <Share2 size={16} /> {post.shares?.length}
          </span>
        </div>
      </div>

      <p className="text-gray-700 py-2 border-b">{post.text}</p>

      <p className="text-gray-500 py-2 border-b">
        Comments ({formatNumber(post.comments?.length || 0)})
      </p>

      {post.comments?.map((node) => (
        <Comment key={node.id} node={node} />
      ))}

      {showComposer && (
        <div ref={bottomRef}>
          <Composer onClose={() => setShowComposer(false)} />
        </div>
      )}
    </div>
  );
};

export default PostPage;

const styles = {
  card: "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden",

  button: "bg-pr1 rounded text-white text-sm px-2 py-1 my-2 whitespace-nowrap",

  stats:
    "flex items-center justify-between text-gray-500 text-sm py-2 border-b",

  statsRow: "flex items-center space-x-4 [&_span]:cursor-pointer",

  statItem: "flex items-center gap-1",
};
