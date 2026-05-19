// components/forms/SelectField.tsx

"use client";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  value: any;
  options: Option[];
  onChange: (value: string) => void;
}

export default function SelectField({
  label,
  value,
  options,
  onChange,
}: Props) {
  return (
    <div>
      {/* <label className="block mb-1 text-sm font-medium">{label}</label> */}

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
