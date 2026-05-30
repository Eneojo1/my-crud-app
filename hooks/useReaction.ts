import { useState, useCallback, useEffect } from "react";
import axios from "axios";

type ReactionType = "like" | "dislike";

type Reaction = {
  id: string | number;
  user_id?: number | null;
  guest?: string | null;
  post_id?: number | null;
  comment_id?: number | null;
  type: ReactionType;
};

type Params = {
  postId?: number;
  commentId?: number | null;
  initialLikes?: Reaction[];
  initialDislikes?: Reaction[];
  userId?: number | null;
};

export const useReaction = ({
  postId,
  commentId,
  initialLikes = [],
  initialDislikes = [],
  userId,
}: Params) => {
  const [likes, setLikes] = useState<Reaction[]>(initialLikes);
  const [dislikes, setDislikes] = useState<Reaction[]>(initialDislikes);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // guest support
  // -----------------------------
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let id = localStorage.getItem("guest_id");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guest_id", id);
    }

    setGuestId(id);
  }, []);

  const isLiked = likes.some(
    (r) => (userId && r.user_id === userId) || (guestId && r.guest === guestId),
  );

  const isDisliked = dislikes.some(
    (r) => (userId && r.user_id === userId) || (guestId && r.guest === guestId),
  );

  // -----------------------------
  // core toggle logic
  // -----------------------------
  const toggleReaction = useCallback(
    async (type: ReactionType) => {
      if (loading) return;
      if (!userId && !guestId) return;

      setLoading(true);

      const isActive = type === "like" ? isLiked : isDisliked;
      const add = type === "like" ? setLikes : setDislikes;
      const remove = type === "like" ? setDislikes : setLikes;

      const identity = userId
        ? { user_id: userId, guest: null }
        : { user_id: null, guest: guestId };

      try {
        // -----------------------------
        // optimistic UI
        // -----------------------------
        if (isActive) {
          add((prev) =>
            prev.filter((r) => !(r.user_id === userId || r.guest === guestId)),
          );
        } else {
          add((prev) => [
            ...prev,
            {
              id: Date.now(),
              ...identity,
              post_id: postId ?? null,
              comment_id: commentId ?? null,
              type,
            },
          ]);

          // remove opposite
          remove((prev) =>
            prev.filter((r) => !(r.user_id === userId || r.guest === guestId)),
          );
        }

        // -----------------------------
        // API call
        // -----------------------------
        await axios.post("/api/reactions", {
          ...identity,
          post_id: postId,
          comment_id: commentId,
          type,
        });
      } catch (err) {
        console.error("Reaction failed:", err);

        // rollback
        setLikes(initialLikes);
        setDislikes(initialDislikes);
      } finally {
        setLoading(false);
      }
    },
    [
      userId,
      guestId,
      postId,
      commentId,
      isLiked,
      isDisliked,
      loading,
      initialLikes,
      initialDislikes,
    ],
  );

  return {
    likes,
    dislikes,
    isLiked,
    isDisliked,
    loading,
    toggleReaction,
  };
};
