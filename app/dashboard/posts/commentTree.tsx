import { CommentType } from "@/type";

const commentTree = (
  node: CommentType[],
  parent_id: string | null = null,
): CommentType[] => {
  return node
    .filter((n) => n.parent_id === parent_id)
    .map((n) => ({
      ...n,
      replies: commentTree(node, n.id),
    }));
};

export default commentTree;
