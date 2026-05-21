"use client";

import { columns, DataTable, User } from "@/components/DataTable";
import { fullName } from "@/shared/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Loading from "@/components/Loading";

export type TableUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await fetch("/api/users");

      const json = await res.json();

      setUsers(json);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.meta?.cause || "Delete failed");
        console.log(data);
        return;
      }

      toast.success(`${fullName(selectedUser)} deleted successfully`);
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }

    router.refresh();

    setOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 relative">
      <Link
        href="/dashboard/users/create"
        className="btn absolute font-semibold text-sm px-2 py-1 left-5 top-2"
      >
        Add New User
      </Link>

      <DataTable
        columns={columns({
          onView: (user) => {
            router.push(`/dashboard/users/${user.id}`);
          },

          onEdit: (user) => {
            router.push(`/dashboard/users/edit/${user.id}`);
          },

          onDelete: async (user) => {
            setSelectedUser(user);
            setOpen(true);
          },
        })}
        data={users}
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>

            <AlertDialogDescription>
              Delete {fullName(selectedUser)}?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
