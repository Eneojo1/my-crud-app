"use client";

import { EntityForm } from "@/components/EntityForm";
import EntityTable from "@/components/EntityTable";
import Modal from "@/components/Modal";
import {
  Flag,
  FlagIcon,
  Folder,
  Image,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Settings() {
  type EntityType = "user" | "role" | "status" | "category";

  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);

  const router = useRouter();

  const entityConfig: Record<string, { title: string; endpoint: string }> = {
    user: { title: "User", endpoint: "/api/users" },
    role: { title: "Role", endpoint: "/api/roles" },
    status: { title: "Status", endpoint: "/api/statuses" },
    category: { title: "Category", endpoint: "/api/categories" },
  };

  const handleSave = async (
    endpoint: string,
    data: { name: string; description: string },
    id?: number,
  ) => {
    const res = await fetch(id ? `${endpoint}/${id}` : endpoint, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let message = "Failed to save";
      try {
        const err = await res.json();
        message = err.error || message;
      } catch (e) {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    router.refresh();
    return res.json();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-6">
      <SettingCard
        icon={<Users className="w-6 h-6 text-pr2" />}
        title="Users"
        onView={() => setShowTable(true)}
      />

      <SettingCard
        icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
        title="Roles"
        onView={() => {
          setEntityType("role");
          setShowTable(true);
        }}
      />

      <SettingCard
        icon={<Flag className="w-6 h-6 text-green-600" />}
        title="Statuses"
        onView={() => {
          setEntityType("status");
          setShowTable(true);
        }}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {entityType && (
          <EntityForm
            title={entityConfig[entityType].title}
            onSubmit={(data) =>
              handleSave(entityConfig[entityType].endpoint, data, editItem?.id)
            }
            initialData={editItem}
            onClose={() => {
              setShowModal(false);
              setShowTable(true);
              setEditItem(null);
            }}
          />
        )}
      </Modal>

      <Modal isOpen={showTable} onClose={() => setShowTable(false)}>
        {entityType && (
          <EntityTable
            title={entityConfig[entityType].title}
            endpoint={entityConfig[entityType].endpoint}
            onEdit={(item) => {
              setEditItem(item);
              setShowTable(false);
              setShowModal(true);
            }}
            onAdd={() => {
              setEditItem(null);
              setShowTable(false);
              setShowModal(true);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

type SettingCardProps = {
  icon: React.ReactNode;
  title: string;
  onView?: () => void;
};

function SettingCard({ icon, title, onView }: SettingCardProps) {
  return (
    <div className="border border-gray-100 p-3 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h4 className="font-semibold text-lg">{title}</h4>
        </div>

        <button
          onClick={onView}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-se7 transition"
        >
          View
        </button>
      </div>
    </div>
  );
}

export function useFetchList<T>(url: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, refresh: fetchData };
}
