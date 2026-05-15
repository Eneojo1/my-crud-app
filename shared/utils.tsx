export const capitalize = (str: string): string =>
  str
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const fullName = (item: any) =>
  [item?.fname, item?.oname, item?.lname].filter(Boolean).join(" ");
