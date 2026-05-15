import { Field } from "@/type";
import { useEffect, useState } from "react";

/* =========================
   TYPES
   ========================= */

export interface Config {
  fields: Field[];
}

/* =========================
   RELATION FIELD
  ========================= */

const RelationField = ({
  field,
  value,
  formData,
  onChange,
}: {
  field: Field;
  value: any;
  formData: Record<string, any>;
  onChange: (value: string) => void;
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!field.endpoint) return;

    let url = field.endpoint;

    // TREE LOGIC (country → state → lga)
    if (field.relationMode === "tree") {
      const parentValue = field.parentField && formData[field.parentField];

      if (field.parentField && !parentValue) {
        setOptions([]);
        return;
      }

      const locationTypeMap: Record<string, string> = {
        country_id: "country",
        state_id: "state",
        lga_id: "lga",
      };

      const locationType = locationTypeMap[field.name] || field.name;

      url += parentValue
        ? `?parent_id=${parentValue}`
        : `?type=${locationType}`;
    }

    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
        setLoading(false);

        /**
         * AUTO DEFAULT SELECTION
         */
        if (!value && data.length > 0) {
          // explicit configured default
          if (field.defaultValue) {
            const found = data.find(
              (item: any) =>
                item.name?.toString().toLowerCase() ===
                field.defaultValue?.toString().toLowerCase(),
            );

            if (found) {
              onChange(found.id);
              return;
            }
          }

          // fallback to first option
          if (field.required) {
            onChange(data[0].id);
          }
        }
      })
      .catch(() => setLoading(false));
  }, [field.endpoint, formData]);

  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{field.label}</label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="">Select {field.label}</option>

        {options.map((item) => (
          <option
            key={item[field.optionValue || "id"]}
            value={item[field.optionValue || "id"]}
          >
            {item[field.optionLabel || "name"]}
          </option>
        ))}
      </select>

      {loading && <p className="text-xs text-gray-500 mt-1">Loading...</p>}
    </div>
  );
};

export default RelationField;
