"use client";

import { columns, DataTable } from "@/components/DataTable";
import { EntityForm } from "@/components/forms/EntityForm";
import PayslipTable from "@/components/PaySlip";
import { entityConfig } from "@/config/entities";
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

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Home() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

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
                  <button className="text-sm text-red-600 hover:underline">
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
