export type Post = {
  id: string;
  title: string;
  thumbnail?: string | null;
  category: string;
  text?: string;
  updated_at: string;
  author: {
    avatar?: string;
  };
  likes?: unknown[];
  comments?: unknown[];
  shares?: unknown[];
};

export type CommentProps = {
  node: CommentType;
  depth?: number;
  maxDepth?: number;
  isLast?: boolean;
};

export type CommentType = {
  id: string;
  user_id: string | null;
  guest: string | null;
  post_id: string;
  parent_id: string | null;
  files: string[];
  comment: string;
  created_at: string;
  updated_at: string;
  author?: UserType | null;
  dislikes?: LikeType[];
  likes?: LikeType[];
  replies: CommentType[];
  node: CommentType[];
};

export type LikeType = {
  id: string;
  user_id: string | null;
  guest: string | null;
  post_id: string | null;
  comment_id: string | null;
  type: string;
  created_at: string;
  updated_at: string;
};

export type UserType = {
  id: string;
  fname: string;
  oname: string;
  lname: string;
  avatar: string;
};
// export type CommentProps = {
//   node: CommentType;
//   depth?: number;
//   maxDepth?: number;
//   isLast?: boolean;
// };

export type Field = {
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "relation"
    | "select"
    | "group";

  name: string;
  label: string;
  endpoint?: string;
  optionLabel?: string;
  optionValue?: string;
  options?: Option[];
  required?: boolean;
  relationMode?: "flat" | "tree";
  parentField?: string;
  fields?: Field[];
  defaultValue?: string | number;
  table?: boolean;
};

type Option = {
  label: string;
  value: string | number;
};

export type PostType = {
  id: string;
  title: string;
  thumbnail?: string | null;
  category: string;
  text?: string;
  updated_at: string;
  author: {
    avatar?: string;
  };
  dislikes?: ReactionType[];
  likes?: ReactionType[];
  comments?: unknown[];
  shares?: unknown[];
};

export type ReactionType = {
  id: string;
  user_id: string | null;
  guest: string | null;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
  updated_at: string;
  type: string;
};

export type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
