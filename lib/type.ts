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
  dislikes?: Reaction[];
  likes?: Reaction[];
  comments?: CommentType[];
  shares?: unknown[];
  is_liked?: boolean;
};

export type CommentProps = {
  node: CommentType;
  depth?: number;
  maxDepth?: number;
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
  author?: User | null;
  dislikes?: Reaction[];
  likes?: Reaction[];
  replies: CommentType[];
  node: CommentType[];
};

export type Sex = "Male" | "Female";

export type User = {
  id: number;
  fname: string;
  oname?: string | null;
  lname: string;
  sex: Sex;
  phone: string;
  email: string;
  password: string;

  country_id?: number | null;
  state_id?: number | null;
  lga_id?: number | null;

  address: string;
  role_id: number;
  status_id: number;
  socials?: [] | null;
  avatar?: string;
};

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

export type Reaction = {
  id: string | number;
  user_id: number | null;
  guest: string | null;
  post_id: number | null;
  comment_id: number | null;
  type: "like" | "dislike";
  created_at: string;
  updated_at: string;
};

export type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
