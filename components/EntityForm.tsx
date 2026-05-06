import { useState, FormEvent, useEffect } from "react";

type Props = {
  title: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
};

export function EntityForm({ title, onSubmit, onClose, initialData }: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });

      // reset form
      setName("");
      setDescription("");

      // close modal AFTER success
      onClose();
    } catch (err) {
      console.error("Error creating entity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2 className="text-xl! ">
        {initialData ? "Edit" : "Create"} {title}
      </h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : initialData ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
