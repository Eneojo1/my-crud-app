"use client";

import { Share2, ThumbsDown, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { author, capitalize, timeAgo } from "@/shared/utils";
import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Post } from "@/type";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const wordLimit = 20;
  let readMore = false;

  const getExcerpt = (text = "") => {
    const words = text.split(/\s+/);
    readMore = words.length <= wordLimit;
    return readMore ? text : words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <div className="flex flex-col md:flex-row rounded-lg shadow hover:shadow-lg transition overflow-hidden border">
      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="w-full md:w-2/5 h-48 md:h-55 shrink-0">
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={400}
            height={400}
            loading="eager"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex gap-2 border-b pb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} />
            </Avatar>

            <div className="text-xs text-gray-500">
              <strong className="block text-sm">{author(post.author)}</strong>

              <span className="inline-block my-0.5 bg-pr2 mr-1 text-white px-2 py-0.5 rounded">
                {capitalize(post.category)}
              </span>

              <span className="block">{timeAgo(post.updated_at)}</span>
            </div>
          </div>

          <h2 className="text-lg! font-semibold text-pr1! mb-2">
            {post.title}
          </h2>

          <p className="text-gray-700 italic">
            {getExcerpt(post?.text)}{" "}
            {!readMore && (
              <Link
                href={`/dashboard/posts/${post.id}`}
                className="text-sm font-semibold hover:underline text-pr1"
              >
                Read More →
              </Link>
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-1 md:gap-2 mt-3 items-center text-xs">
          <Stat icon={Heart} count={post.likes?.length ?? 0} label="likes" />

          <div className="w-px h-4 bg-gray-400" />

          <Stat
            icon={MessageCircle}
            count={post.comments?.length ?? 0}
            label="comments"
            href={`/dashboard/posts/${post.id}`}
          />

          <div className="w-px h-4 bg-gray-400" />

          <Stat icon={Share2} count={post.shares?.length ?? 0} label="shares" />
        </div>
      </div>
    </div>
  );
}

type StatProps = {
  icon: LucideIcon;
  count: number;
  label: string;
  href?: string; // optional link
  onClick?: () => void; // optional click handler
};

export const Stat = ({
  icon: Icon,
  count,
  label,
  href,
  onClick,
}: StatProps) => {
  const content = (
    <span className="flex items-center gap-1">
      <Icon className="cursor-pointer w-4 h-4" onClick={onClick} />
      <span className="flex items-center ">
        {count} {label}
      </span>
    </span>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} className="flex items-center gap-1 hover:underline">
        {content}
      </Link>
    );
  }

  return content;
};
