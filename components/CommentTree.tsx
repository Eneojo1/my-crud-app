import { CommentProps } from "@/type";

const commentTree = (
  node: CommentProps[],
  parent_id: string | null = null,
): CommentProps[] => {
  return node
    .filter((n) => n.parent_id === parent_id)
    .map((n) => ({
      ...n,
      replies: commentTree(node, n.id),
    }));
};

export default commentTree;
