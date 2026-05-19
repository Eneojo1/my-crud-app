"use client";

import { useState } from "react";
// import { EntityForm } from "./EntityForm";
import { entityConfig } from "@/config/entities";

import RelationField from "./RelationField";
import GroupField from "./GroupField";
import SelectField from "./SelectField";
import TextField from "./TextField";
import { Field } from "@/type";

export default function UsersForm({ initialData, onSubmit, onClose }: any) {
  const [formData, setFormData] = useState(initialData || {});

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

      <button type="submit" className="btn">
        {initialData ? "Update User" : "Create User"}
      </button>
    </form>
  );
}

/* =========================
   TYPES
   ========================= */

export interface Config {
  fields: Field[];
}

interface EntityFormProps {
  config: Config;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

/* =========================
   MAIN FORM
========================= */

export function EntityForm({ config, formData, setFormData }: EntityFormProps) {
  // reusable updater
  const updateField = (name: string, value: any) => {
    const newData = { ...formData, [name]: value };

    // RESET DEPENDENCIES
    config.fields.forEach((f: any) => {
      if (f.parentField === name) {
        newData[f.name] = "";
      }
    });

    setFormData(newData);
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-auto">
      {config.fields.map((field) => {
        /* =========================
           TEXT / EMAIL INPUT
        ========================= */

        if (
          field.type === "text" ||
          field.type === "email" ||
          field.type === "password"
        ) {
          return (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              value={formData[field.name]}
              required={field.required}
              onChange={(value) => updateField(field.name, value)}
            />
          );
        }

        /* =========================
           TEXTAREA
        ========================= */

        if (field.type === "textarea") {
          return (
            <div key={field.name}>
              <label className="block mb-1 text-sm font-medium">
                {field.label}
              </label>

              <textarea
                placeholder={field.label}
                value={formData[field.name] || ""}
                required={field.required}
                onChange={(e) => updateField(field.name, e.target.value)}
                className="border p-2 w-full rounded min-h-30"
              />
            </div>
          );
        }

        /* =========================
           SELECT DROPDOWN
          ========================= */

        if (field.type === "select") {
          return (
            <SelectField
              key={field.name}
              label={field.label}
              value={formData[field.name]}
              options={field.options || []}
              onChange={(value) => updateField(field.name, value)}
            />
          );
        }

        /* =========================
           RELATION DROPDOWN
          ========================= */

        if (field.type === "relation") {
          return (
            <RelationField
              key={field.name}
              field={field}
              formData={formData}
              value={formData[field.name]}
              onChange={(value) =>
                updateField(field.name, value ? Number(value) : null)
              }
            />
          );
        }

        if (field.type === "group") {
          return (
            <GroupField
              key={field.name}
              field={field}
              formData={formData}
              setFormData={setFormData}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
