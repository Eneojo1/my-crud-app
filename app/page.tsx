"use client";
import PayslipTable from "@/components/PaySlip";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Status = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
};

export default function Home() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [status, setStatus] = useState<Status | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function fetchPosts() {
    const res = await fetch("/api/statuses");
    const data = await res.json();
    setStatuses(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/statuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    await fetchPosts();
    setLoading(false);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/statuses/${id}`, { method: "DELETE" });
    await fetchPosts();
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>

          <Link href="/dashboard" className="text-sm text-pr2 hover:underline">
            Go to Dashboard
          </Link>

          {/* <PayslipTable /> */}

          <form onSubmit={handleCreate} className="flex w-full flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                className="w-full rounded border px-3 py-2 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              className="w-full rounded bg-foreground px-3 py-2 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Status"}
            </button>
          </form>

          <ul className="space-y-3">
            {statuses.map((status) => (
              <li
                key={status.id}
                className="flex items-start justify-between rounded border bg-white p-4 shadow-sm"
              >
                <div>
                  <h2 className="font-semibold">{status.name}</h2>
                  <p className="mt-1 text-sm text-slate-700">
                    {status.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/statuses/${status.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(status.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
