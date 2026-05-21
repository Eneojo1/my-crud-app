import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { capitalize } from "@/shared/utils";
import { Props } from "../UserForm";

const Detail = ({ label, value }: { label: string; value: any }) => {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium break-all max-w-50">{value || "—"}</p>
    </div>
  );
};

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
    // <div className="grid md:grid-cols-2 lg:grid-cols-3 space-y-4 h-[60vh] overflow-auto">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[60vh] overflow-auto">
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
