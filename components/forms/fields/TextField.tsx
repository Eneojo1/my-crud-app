// components/forms/TextField.tsx

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  label: string;
  type?: string;
  value: any;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function TextField({
  label,
  type = "text",
  value,
  required,
  placeholder,
  onChange,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      {/* <label className="block mb-1 text-sm font-medium">{label}</label> */}

      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value || ""}
          required={required}
          placeholder={placeholder || label}
          onChange={(e) => onChange(e.target.value)}
          className="border p-2 w-full rounded pr-10"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
