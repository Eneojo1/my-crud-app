import { getMedia } from "@/shared/utils";
import { dataset } from "./dataset";
import commentTree from "./commentTree";

const posts = dataset.posts.map((post) => {
  // Attach profile
  const author = {
    ...dataset.users.find((u) => u.id === post.user_id),
    avatar:
      getMedia(dataset.media, {
        entity_type: "user",
        entity_id: post.user_id,
        type: "image",
      })?.url || "/user.jpg",
  };

  // Attach thumbnail from media table
  const thumbnail =
    getMedia(dataset.media, {
      entity_type: "post",
      entity_id: post.id,
      is_thumbnail: true,
    })?.url || null;

  // Attach dislikes for this post
  const dislike = dataset.reactions.filter(
    (l) =>
      l.post_id === post.id && l.comment_id === null && l.type === "dislike",
  );

  // Attach likes for this post
  const likes = dataset.reactions.filter(
    (l) => l.post_id === post.id && l.comment_id === null && l.type === "like",
  );

  // Attach shares
  const shares = dataset.shares.filter((s) => s.post_id === post.id);

  return {
    ...post,
    thumbnail,
    author,
    dislike,
    likes,
    shares,

    // Attach comments (tree)
    comments: commentTree(
      dataset.comments
        .filter((c) => c.post_id === post.id)
        .map((c) => ({
          ...c,
          author: dataset.users.find((p) => p.id === c.user_id) || null,
          likes: dataset.reactions.filter((l) => l.comment_id === c.id),
          replies: [],
          node: [],
        })),
    ),
  };
});

export default posts;
