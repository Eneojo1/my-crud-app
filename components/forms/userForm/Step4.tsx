import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Props } from "./UserForm";
import { useEffect, useRef, useState } from "react";
import { capitalize } from "@/shared/utils";

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

export default function Step4({ formData }: Props) {
  const [data, setData] = useState<any>({
    roles: [],
    statuses: [],
    locations: [],
  });

  useEffect(() => {
    const endpoints = ["roles", "statuses", "locations"];

    Promise.all(endpoints.map((e) => fetch(`/api/${e}`).then((r) => r.json())))
      .then(([roles, statuses, locations]) =>
        setData({ roles, statuses, locations }),
      )
      .catch(console.error);
  }, []);

  const getName = (arr: any[], id: string | number) =>
    arr.find((f) => Number(f.id) === Number(id))?.name ?? "";

  const { locations, roles, statuses } = data;

  const country = getName(locations, formData.country_id);
  const state = getName(locations, formData.state_id);
  const lga = getName(locations, formData.lga_id);
  const role = getName(roles, formData.role_id);
  const status = getName(statuses, formData.status_id);

  const getPlatform = (link: string) => {
    try {
      return new URL(link).hostname.split(".")[1];
    } catch (e) {
      alert(`Invalid link "${link}"`);
      return "Socials";
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 space-y-4 h-[60vh] overflow-auto">
      <Avatar className="m-auto h-25 w-25 md:m-0 md:row-span-3">
        <AvatarImage src={formData.avatar || "/user.jpg"} />
      </Avatar>
      <Detail label="First Name" value={formData.fname} />
      <Detail label="Other Name" value={formData.oname} />
      <Detail label="Last Name" value={formData.lname} />
      <Detail label="Gender" value={formData.sex} />
      <Detail label="Phone" value={formData.phone} />
      <Detail label="Email" value={formData.email} />
      <Detail label="Password" value={formData.password} />
      <Detail label="Country" value={country} />
      <Detail label="State" value={state} />
      <Detail label="LGA" value={lga} />
      <Detail label="Address" value={formData.address} />
      <Detail label="Role" value={role} />
      <Detail label="Status" value={status} />

      {formData.socials.map((s: string, idx: number) => {
        const label = capitalize(getPlatform(s)) || "Social";
        return <Detail key={idx} label={label} value={s} />;
      })}
    </div>
  );
}

export type Props1 = {
  entity: EntityState;

  updateField: (key: keyof EntityState, value: any) => void;
};

type EntityState = {
  id?: number;

  label: string;

  avatar: string; // preview url

  avatarFile: File | null;
};

const initialState1: EntityState = {
  label: "",
  avatar: "",
  avatarFile: null,
};

const steps = {
  1: Step1,
  2: Step2,
  3: Step3,
};

export const Entity = () => {
  const [step, setStep] = useState(1);
  const [entity, setEntity] = useState(initialState1);

  const updateField = (key: keyof EntityState, value: any) => {
    setEntity((prev) => ({ ...prev, [key]: value }));
  };

  const Current = steps[step as keyof typeof steps];
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  async function handleSubmit() {
    console.log(entity);
    /* ====================
       CREATE ENTITY FIRST
    ===================== */

    const entityRes = await fetch("/api/entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ label: entity.label }),
    });

    const created = await entityRes.json();

    /* ====================
       UPLOAD AVATAR
    ===================== */

    if (entity.avatarFile) {
      const form = new FormData();

      form.append("file", entity.avatarFile);

      form.append("entity_id", created.id);

      form.append("entity_type", "entity");

      await fetch("/api/upload", { method: "POST", body: form });
    }

    console.log("completed");
  }

  return (
    <div>
      <Current entity={entity} updateField={updateField} />

      <div className="flex gap-3">
        {step > 1 && <button onClick={back}>Back</button>}

        {step < 3 ? (
          <button onClick={next}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

function Step1({ entity, updateField }: Props1) {
  return (
    <input
      value={entity.label}
      onChange={(e) => updateField("label", e.target.value)}
      placeholder="name"
    />
  );
}

function Step2({ entity, updateField }: Props1) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    /* preview */

    updateField("avatar", preview);

    /* actual file */

    updateField("avatarFile", file);
  }
  return (
    <div>
      <div onClick={() => inputRef.current?.click()}>
        {entity.avatar ? (
          <Avatar>
            <AvatarImage src={entity.avatar} alt="avatar" />
          </Avatar>
        ) : (
          "Upload"
        )}
      </div>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
}

function Step3({ entity }: Props1) {
  return (
    <div>
      {entity.avatar && (
        <Avatar>
          <AvatarImage src={entity.avatar} alt="avatar" />
        </Avatar>
      )}

      <div>{entity.label}</div>
    </div>
  );
}
