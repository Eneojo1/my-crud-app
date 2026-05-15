// declare module "pluralize";

type Option = {
  label: string;
  value: string | number;
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
