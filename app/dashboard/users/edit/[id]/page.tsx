"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import UsersForm from "@/components/forms/UserForm";

export default function EditUser({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const { id } = await params;
    try {
      setLoading(true);

      const res = await fetch(`/api/users/${id}`).then((r) => r.json());

      setUser(res);
    } catch (err) {
      console.error(err);
      setUser({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loading />
      </div>
    );
  }

  return <UsersForm initialData={user} />;
}
