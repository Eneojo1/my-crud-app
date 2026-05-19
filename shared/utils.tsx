export const capitalize = (str: string): string =>
  str
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const fullName = (item: any) =>
  [item?.fname, item?.oname, item?.lname].filter(Boolean).join(" ");

export const textarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const el = e.currentTarget;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};
