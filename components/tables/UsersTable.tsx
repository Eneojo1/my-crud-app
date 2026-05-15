"use client";

import { useEffect, useState } from "react";

import TableActions from "./TableActions";
import TableHeader from "./TableHeader";
import TableLoading from "./TableLoading";
import renderCell from "./renderCell";

type Props = {
  title: string;
  endpoint: string;
  fields: any[];
  onEdit?: (item: any) => void;
  onAdd?: () => void;
};

export default function UserTable({
  title,
  endpoint,
  fields,
  onEdit,
  onAdd,
}: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await fetch(endpoint);

      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleDelete = async (id: number | string) => {
    await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  if (loading) return <TableLoading />;

  const tableFields = fields.filter((field) => field.table === true);

  return (
    <div className="h-[50vh]">
      <TableHeader title={title} count={data.length} onAdd={onAdd} />

      <div className="h-[80%] overflow-auto">
        <table className="text-sm border m-auto">
          <thead className="bg-pr1 text-white sticky top-0 z-10">
            <tr>
              <th className="py-3">SN</th>

              {tableFields.map((field) => (
                <th key={field.name} className="px-3 py-3 text-left">
                  {field.label}
                </th>
              ))}

              <th>Created</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="text-xs">
            {data.map((item, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-100 border-b">
                <td className="px-3 py-2">{idx + 1}</td>

                {tableFields.map((field) => (
                  <td key={field.name} className="px-3 py-2">
                    {renderCell(item, field)}
                  </td>
                ))}

                <td className="px-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

                <td className="px-3">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>

                <TableActions
                  item={item}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
