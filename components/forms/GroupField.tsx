// components/forms/GroupField.tsx

"use client";

interface Props {
  field: any;
  formData: Record<string, any>;
  setFormData: any;
}

export default function GroupField({ field, formData, setFormData }: Props) {
  return (
    <div className="border rounded p-4 space-y-4">
      <h3 className="font-semibold text-lg">{field.label}</h3>

      {field.fields?.map((subField: any) => (
        <div key={subField.name}>
          <label className="block mb-1 text-sm font-medium">
            {subField.label}
          </label>

          <input
            type="text"
            value={formData[field.name]?.[subField.name] || ""}
            onChange={(e) =>
              setFormData((prev: Record<string, any>) => ({
                ...prev,

                [field.name]: {
                  ...prev[field.name],

                  [subField.name]: e.target.value,
                },
              }))
            }
            className="border p-2 w-full rounded"
          />
        </div>
      ))}
    </div>
  );
}
