"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table as Tableau,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fullName } from "@/shared/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  onView?: (item: TData) => void;
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {},
  });

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="shrink-0 bg-white pb-3">
        <DataTableToolbar table={table} />
      </div>

      <Table className="min-w-max rounded-md border border-se3">
        <TableHeader className="rounded-md ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="sticky top-0 z-10">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="bg-se3 font-semibold whitespace-nowrap text-white"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="odd:bg-white even:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </div>
  );
}

interface DataTableToolbarProps<TData> {
  table: Tableau<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-end">
      <Input
        placeholder="Search..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("name")?.setFilterValue(e.target.value)
        }
        className="w-64
       '#"
      />
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: Tableau<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
}

export type RawUser = {
  id: number;
  fname: string;
  oname: string;
  lname: string;
  sex: string;
  phone: string;
  email: string;
  password: string;
  country_id: number;
  state_id: number;
  lga_id: number;
  address: string;
  role_id: number;
  status_id: number;
  socials: any;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  fname: string;
  oname?: string;
  lname: string;
  email: string;
  phone?: string;
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  created_at: string;
};

interface ColumnProps {
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

interface ColumnProps {
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onDeactivate?: (user: User) => void;
}

export const columns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<User>[] => [
  {
    id: "sn",
    header: "SN",
    cell: ({ row }) => row.index + 1,
  },

  {
    id: "name",

    accessorFn: (row) => `${row.fname} ${row.oname ?? ""} ${row.lname}`.trim(),

    header: "Name",

    cell: ({ row }) => {
      const u = row.original;

      return fullName(u).trim();
    },

    filterFn: "includesString",
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original.role?.name,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status?.name,
  },

  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      return formatDate(row.original.created_at);
    },
  },

  {
    id: "actions",
    header: "",

    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded hover:bg-gray-100">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(user)}>
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit?.(user)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete?.(user)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
