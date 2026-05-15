import { Config } from "@/components/forms/EntityForm";
import { BadgeCheck, LucideIcon, ShieldCheck, Users } from "lucide-react";

export const entityConfig: Record<
  string,
  Config & {
    title: string;
    endpoint: string;
    icon?: LucideIcon;
  }
> = {
  users: {
    title: "User",
    endpoint: "/api/users",
    icon: Users,

    fields: [
      {
        name: "fname",
        label: "First Name",
        type: "text",
        required: true,
        table: true,
      },
      {
        name: "oname",
        label: "Other Name",
        type: "text",
        required: false,
        table: true,
      },
      {
        name: "lname",
        label: "Last Name",
        type: "text",
        required: true,
        table: true,
      },

      {
        name: "sex",
        label: "Gender",
        type: "select",
        table: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ],
      },

      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        table: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        table: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        required: true,
        table: true,
      },

      {
        name: "country_id",
        label: "Country",
        type: "relation",
        endpoint: "/api/locations",
        optionLabel: "name",
        optionValue: "id",
        relationMode: "tree",
        defaultValue: "Nigeria",
        table: true,
      },

      {
        name: "state_id",
        label: "State",
        type: "relation",
        endpoint: "/api/locations",
        optionLabel: "name",
        optionValue: "id",
        relationMode: "tree",
        parentField: "country_id",
        table: true,
      },

      {
        name: "lga_id",
        label: "LGA",
        type: "relation",
        endpoint: "/api/locations",
        optionLabel: "name",
        optionValue: "id",
        relationMode: "tree",
        parentField: "state_id",
        table: true,
      },

      {
        name: "address",
        label: "Address",
        type: "textarea",
        table: true,
      },

      {
        name: "role_id",
        label: "Role",
        type: "relation",
        endpoint: "/api/roles",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: "User",
        table: true,
      },

      {
        name: "status_id",
        label: "Status",
        type: "relation",
        endpoint: "/api/statuses",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: "Active",
        table: true,
      },

      {
        name: "socials",
        label: "Social Links",
        type: "group",
        table: false,
        fields: [
          { name: "facebook", label: "Facebook", type: "text" },
          { name: "twitter", label: "Twitter", type: "text" },
          { name: "instagram", label: "Instagram", type: "text" },
          { name: "linkedin", label: "LinkedIn", type: "text" },
        ],
      },
    ],
  },

  roles: {
    title: "Role",
    endpoint: "/api/roles",
    icon: ShieldCheck,
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        table: true,
      },

      {
        name: "description",
        label: "Description",
        type: "textarea",
        table: true,
      },
    ],
  },

  statuses: {
    title: "Status",
    endpoint: "/api/statuses",
    icon: BadgeCheck,

    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        table: true,
      },

      {
        name: "description",
        label: "Description",
        type: "textarea",
        table: true,
      },
    ],
  },
};
