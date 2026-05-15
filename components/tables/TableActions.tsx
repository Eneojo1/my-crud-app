"use client";

import Link from "next/link";

import { Edit, Eye, Trash2 } from "lucide-react";

interface Props {
  item: any;
  endpoint?: string;
  onEdit?: (item: any) => void;
  onDelete?: (id: number | string) => void;
}

export default function TableActions({
  item,
  endpoint,
  onEdit,
  onDelete,
}: Props) {
  return (
    <td className="px-3 whitespace-nowrap">
      <div className="flex items-center gap-3">
        {/* VIEW */}
        <Link href={`${endpoint}/${item.id}`} className="text-blue-600 tooltip">
          <Eye size={20} />
          <span className="tooltip-bubble">View</span>
        </Link>

        {/* EDIT */}
        <button className="text-pr2 tooltip" onClick={() => onEdit?.(item)}>
          <Edit size={20} />
          <span className="tooltip-bubble">Edit</span>
        </button>

        {/* DELETE */}
        <button
          className="text-red-600 tooltip"
          onClick={() => onDelete?.(item.id)}
        >
          <Trash2 size={20} />
          <span className="tooltip-bubble">Delete</span>
        </button>
      </div>
    </td>
  );
}
