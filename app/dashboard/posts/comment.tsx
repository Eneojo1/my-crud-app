"use client";
import { author, formatNumber, timeAgo } from "@/shared/utils";
import { Reply, Share, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import Composer from "./composer";
import { dataset } from "./dataset";
import { CommentProps } from "@/lib/type";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useReaction } from "@/hooks/useReaction";

const Comment = ({ node, depth = 0 }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  const replyRef = useRef<HTMLDivElement | null>(null);

  const user = dataset.users.find((u) => u.id === 7);
  const userId = user?.id;
  const guestId =
    typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;

  const canDelete =
    user && (String(userId) === node.user_id || user.role_id === 1);

  const nodeCount = node.replies.length;
  const label = `View ${nodeCount > 1 ? "all " : ""}${nodeCount} repl${nodeCount > 1 ? "ies" : "y"}`;

  const hasReplies = nodeCount > 0;

  const { likes, dislikes, isLiked, isDisliked, toggleReaction } = useReaction({
    commentId: Number(node.id),
    postId: Number(node.post_id),
    initialLikes: node.likes,
    initialDislikes: node.dislikes,
    userId: user?.id ? Number(user.id) : null,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setIsDeleting(true);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setIsReplying(!isReplying);
  };

  return (
    <div
      key={node.id}
      className="comment z-30"
      style={
        { "--avatar-size": depth > 0 ? "24px" : "32px" } as React.CSSProperties
      }
    >
      <Avatar className="avatar">
        <AvatarImage src={node.author?.avatar || "/user.jpg"} />
      </Avatar>

      <div className="details">
        <div className="bg-muted rounded-lg p-2 px-4">
          <span className="font-semibold text-sm text-pr1">
            {author(node.author) || node.guest || "Unknown"}
          </span>

          <p className="text">{node.comment}</p>
          <span className="text-[10px]">{timeAgo(node.updated_at)}</span>
        </div>

        <div className="action-btns">
          <button
            className={`flex gap-0.5 items-center ${isLiked ? "text-pr2" : ""}`}
            onClick={() => toggleReaction("like")}
          >
            <ThumbsUp />
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
            <ThumbsDown />

            <span className="text-sm">{formatNumber(dislikes.length)}</span>
          </button>
          <button
            onClick={() => setShowComposer((prev) => !prev)}
            className="tooltip"
          >
            <Reply />
            <span className="tooltip-bubble">
              Reply to {author(node.author) || node.guest || "Unknown"}
            </span>
          </button>
          <button className="tooltip">
            <Share />
            <span className="tooltip-bubble">Share</span>
          </button>

          {canDelete && (
            <button className="tooltip">
              <Trash2 />
              <span className="tooltip-bubble">Delete comment</span>
            </button>
          )}
        </div>

        {hasReplies && !expanded && (
          <div className="show-replies text-sm text-pr1 pt-1">
            <button onClick={() => setExpanded((prev) => !prev)}>
              {label}
            </button>
          </div>
        )}

        {hasReplies && expanded && (
          <div className="reply">
            {node.replies.map((reply) => (
              <Comment node={reply} depth={depth + 1} key={reply.id} />
            ))}
          </div>
        )}

        {showComposer && (
          <div>
            <Composer
              onClose={() => setShowComposer(false)}
              node={node}
              replyTo={author(node.author) || node.guest || "Anonymous"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
