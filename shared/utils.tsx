export const author = (item: any) =>
  [item?.fname, item?.oname, item?.lname].filter(Boolean).join(" ");

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

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

export const fullName = (item: any) =>
  [item?.fname, item?.oname, item?.lname].filter(Boolean).join(" ");

type Media = {
  id: string;
  url: string;
  type: string;
  entity_type: string;
  entity_id: string;
  is_thumbnail: boolean;
};

type MediaQuery = {
  entity_type: "user" | "post" | "comment";
  entity_id: string;
  is_thumbnail?: boolean;
  type?: "image" | "video";
};

export const getMedia = (table: Media[], query: MediaQuery) => {
  return (
    table.find(
      (m) =>
        m.entity_type === query.entity_type &&
        m.entity_id === query.entity_id &&
        (query.type ? m.type === query.type : true) &&
        (query.is_thumbnail !== undefined
          ? m.is_thumbnail === query.is_thumbnail
          : true),
    ) || null
  );
};

export const textarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const el = e.currentTarget;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};

export const timeAgo = (dateStr: string) => {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diff = (Date.now() - d.getTime()) / 1000;
  const diffDays = Math.floor(diff / 86400);

  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Yesterday case
  if (diffDays === 1) {
    return `Yesterday at ${time}`;
  }

  // Within the past week → n days ago
  if (diffDays < 7) {
    const day = d.toLocaleDateString("en-GB", { weekday: "short" });
    return `${day} at ${time}`;
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  // Add year if not current year
  if (d.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }

  return `${d.toLocaleString("en-US", options)} at ${time}`;
};
