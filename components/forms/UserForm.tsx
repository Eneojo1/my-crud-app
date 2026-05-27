"use client";

import { entityConfig } from "@/config/entities";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { useState } from "react";
import { toast } from "sonner";

export type Props = {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  onUpload?: (file: File | null) => void;
};

type UserFormProps = {
  initialData?: Record<string, any> & {
    id?: number;
  };
};

const initialState = Object.fromEntries(
  entityConfig.users.fields.map((f) => [f.name, ""]),
);

const stepComponents: { [key: number]: React.ComponentType<any> } = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
};

export default function UserForm({ initialData }: UserFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ...initialState,
    ...initialData,
    confirmPassword: "",
    socials: initialData?.socials || [],
    avatar: initialData?.avatar?.url || "",
    avatarFile: null as File | null,
    // ...initialState,
    // confirmPassword: "",
    // socials: [],
    //avatar: "", // preview URL
    //avatarFile: null as File | null, // actual file
    // ...initialData,
  });

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const updateField = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const id = initialData?.id;

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        // Ignore fields
        if (
          value === null ||
          value === undefined ||
          key === "confirmPassword" ||
          key === "avatar" // preview only
        ) {
          return;
        }

        // File upload
        if (key === "avatarFile") {
          if (value instanceof File) {
            payload.append("avatar", value);
          }

          return;
        }

        // Arrays (socials)
        if (Array.isArray(value)) {
          payload.append(key, JSON.stringify(value));
          return;
        }

        // Skip empty strings if desired
        if (value === "") return;

        payload.append(key, String(value));
      });

      const res = await fetch(id ? `/api/users/${id}` : "/api/users", {
        method: id ? "PUT" : "POST",
        body: payload,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        toast.error(data?.error || data?.message || "Something went wrong");
        console.error(data?.error || data?.message || "Something went wrong");

        return;
      }

      toast.success(
        id ? "User updated successfully" : "User created successfully",
      );
    } catch (err: any) {
      toast.error(err.message || "Network error");
    }
  };

  const CurrentStep = stepComponents[step];

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col h-[80vh] bg-se4 rounded-2xl">
      <h1>User Form</h1>
      <Progress step={step} setStep={setStep} />
      <CurrentStep formData={formData} updateField={updateField} />

      <div className="flex justify-between mt-auto pt-8">
        {step > 1 && (
          <button onClick={back} className="btn">
            Back
          </button>
        )}

        {step < 4 ? (
          <button onClick={next} className="btn">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn">
            {initialData?.id ? "Update" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

function Progress({
  step,
  setStep,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const steps = ["Personal", "Address", "Upload", "Preview"];

  return (
    <div className="mb-5">
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-pr2 transition-all duration-300"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((label, index) => {
          const current = index + 1;

          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(current)}
              className=" relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-5 h-5 md:w-9 md:h-9 text-sm md:text-md rounded-full flex items-center justify-center border-2 bg-se7 
                  ${step >= current ? "bg-pr2! border-pr2 text-se4" : "border-gray-300"}`}
              >
                {current}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
