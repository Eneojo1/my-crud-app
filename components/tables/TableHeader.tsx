"use client";

import pluralize from "pluralize";

interface Props {
  title: string;
  count: number;
  onAdd?: () => void;
}

export default function TableHeader({ title, count, onAdd }: Props) {
  return (
    <div className="page-header flex items-center justify-between mb-4">
      <div>
        <h1 className="font-bold text-lg">{pluralize(title)}</h1>

        <p>{count} items</p>
      </div>

      <button onClick={onAdd} className="bg-pr2 text-white px-3 py-1 rounded">
        + Add {title}
      </button>
    </div>
  );
}
