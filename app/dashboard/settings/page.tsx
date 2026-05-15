"use client";

import { EntityForm } from "@/components/forms/EntityForm";
import Modal from "@/components/Modal";
import { entityConfig } from "@/config/entities";
import {
  Flag,
  FlagIcon,
  Folder,
  Image,
  LucideIcon,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EntityTable from "@/components/tables/EntityTable";
import { toast } from "sonner";

export default function Settings() {
  type EntityType = keyof typeof entityConfig;

  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);

  const router = useRouter();

  const handleSave = async (endpoint: string, data: any, id?: number) => {
    let payload = { ...data };

    // USERS ONLY
    if (endpoint.includes("/users")) {
      payload = {
        ...payload,

        role_id: payload.role_id ? Number(payload.role_id) : null,

        status_id: payload.status_id ? Number(payload.status_id) : null,

        country_id: payload.country_id ? Number(payload.country_id) : null,

        state_id: payload.state_id ? Number(payload.state_id) : null,

        lga_id: payload.lga_id ? Number(payload.lga_id) : null,
      };

      // REMOVE RELATION OBJECTS
      delete payload.role;
      delete payload.status;

      delete payload.country;
      delete payload.state;
      delete payload.lga;
    }

    const res = await fetch(id ? `${endpoint}/${id}` : endpoint, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let message = "Failed to save";

      try {
        const err = await res.json();
        message = err.error || message;
      } catch (e) {
        console.error(e);
      }

      throw new Error(message);
    }

    toast.success(id ? "Updated successfully" : "Created successfully");

    router.refresh();

    return res.json();
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 px-6">
      {Object.entries(entityConfig).map(([key, val]) => {
        if (key === "users") return null;
        const Icon = val.icon as LucideIcon;
        return (
          <button
            key={key}
            onClick={() => {
              setEntityType(key);
              setShowTable(true);
            }}
            className="capitalize border border-gray-100 p-3 rounded-lg shadow hover:shadow-md transition flex justify-center gap-3"
          >
            {Icon && <Icon size={24} className="text-pr2" />}

            {key}
          </button>
        );
      })}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {entityType && (
          <DynamicFormWrapper
            config={entityConfig[entityType]}
            initialData={editItem}
            onSubmit={(data: any) =>
              handleSave(entityConfig[entityType].endpoint, data, editItem?.id)
            }
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
            fields={entityConfig[entityType].fields}
            onAdd={() => {
              setEditItem(null);
              setShowTable(false);
              setShowModal(true);
            }}
            onEdit={(item) => {
              setEditItem(item);
              setShowTable(false);
              setShowModal(true);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export function DynamicFormWrapper({
  config,
  initialData,
  onSubmit,
  onClose,
}: any) {
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await onSubmit(formData);

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {initialData ? "Edit" : "Create"} {config.title}
      </h2>

      <EntityForm
        config={config}
        formData={formData}
        setFormData={setFormData}
      />

      <button type="submit" className="bg-pr2 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}
