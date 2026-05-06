import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import pluralize from "pluralize";
import Loading from "./Loading";

type Props = {
  title: string;
  endpoint: string;
  onEdit?: (item: any) => void;
  onAdd?: () => void;
};

const EntityTable = ({ title, endpoint, onEdit, onAdd }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(endpoint);

      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleDelete = async (id: number | string) => {
    const item = data.find((d) => d.id === id).name;
    if (!confirm(`Are you sure you want to delete ${item || "this item"}?`))
      return;

    await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
    });

    fetchData(); // refresh table
  };

  const handleEdit = (item: any) => {
    onEdit?.(item); // parent decides what to do (open modal, etc.)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p>No {pluralize(title.toLowerCase())} found.</p>
      </div>
    );
  }

  return (
    <div className="h-[50vh]">
      <div className="page-header flex items-center justify-between mb-4">
        <div>
          <h1 className="font-bold text-lg">{pluralize(title)}</h1>
          <p> {data.length} items</p>
        </div>

        <button onClick={onAdd} className="bg-pr2 text-white px-3 py-1 rounded">
          + Add {title}
        </button>
      </div>

      <div className="h-[80%] overflow-auto">
        <table className="text-sm border m-auto">
          <thead className="bg-pr1 text-white sticky top-0 z-10">
            <tr>
              <th className="py-3">SN</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {data.map((item, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-100 border-b">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3">{item.name}</td>
                <td className="px-3">{item.description}</td>
                <td className="px-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-3">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>
                <td className="px-3 space-x-3 whitespace-nowrap">
                  <button
                    className="text-pr2  tooltip"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit size={20} />
                    <span className="tooltip-bubble">Edit</span>
                  </button>

                  <button
                    className="text-red-600 tooltip"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={20} />
                    <span className="tooltip-bubble">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntityTable;
