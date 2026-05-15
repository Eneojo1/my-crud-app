export default function renderCell(item: any, field: any) {
  const value = item[field.name];

  // RELATION FIX
  if (field.type === "relation") {
    if (typeof value === "object" && value) {
      return value.name || value.title;
    }

    // fallback for FK fields
    const relationMap: Record<string, string> = {
      country_id: "country",
      state_id: "state",
      lga_id: "lga",
      role_id: "role",
      status_id: "status",
    };

    const relationKey = relationMap[field.name];

    return item?.[relationKey]?.name || "-";
  }

  return value?.toString() || "-";
}
