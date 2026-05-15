"use client";

import { useState } from "react";
import { EntityForm } from "./EntityForm";
import { entityConfig } from "@/config/entities";

export default function UsersForm({
  config,
  initialData,
  onSubmit,
  onClose,
}: any) {
  const [formData, setFormData] = useState(initialData || {});
  type EntityType = keyof typeof entityConfig;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await onSubmit(formData);

    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {initialData ? "Edit" : "Create"} User
      </h2>
      <EntityForm
        config={entityConfig.users}
        formData={formData}
        setFormData={setFormData}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update User" : "Create User"}
      </button>
    </form>
  );
}
