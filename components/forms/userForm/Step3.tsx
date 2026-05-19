import { useRef } from "react";
import { Props } from "./UserForm";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

const Step3 = ({ formData, updateField }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    /* preview */
    updateField("avatar", preview);

    /* actual file */
    updateField("avatarFile", file);
  };

  const removeAvatar = () => {
    updateField("avatar", "");
    updateField("avatarFile", null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSocialChange = (index: number, value: string) => {
    const socials = [...formData.socials];
    socials[index] = value;
    updateField("socials", socials);
  };

  const addSocial = () => {
    const hasEmpty = formData.socials.some((s: string) => s.trim() === "");
    if (hasEmpty) return;

    updateField("socials", [...formData.socials, ""]);
  };

  const removeSocial = (index: number) => {
    updateField(
      "socials",
      formData.socials.filter((_: any, i: number) => i !== index),
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(180px,250px)_1fr] gap-10 items-start">
      {/* ===================       AVATAR =================== */}
      <div className=" flex flex-col items-center gap-4">
        <div className="relative">
          {formData.avatar ? (
            <Avatar className=" h-40 w-40 md:h-50 md:w-50">
              <AvatarImage src={formData.avatar} />
            </Avatar>
          ) : (
            <Avatar className=" h-40 w-40 md:h-50 md:w-50">
              <AvatarImage src="/user.jpg" />
            </Avatar>
          )}
          <span
            className=" absolute bottom-0 left-0 btn btn-gray rounded-full"
            onClick={() => inputRef.current?.click()}
          >
            Avatar
          </span>
          {formData.avatar && (
            <span
              onClick={removeAvatar}
              className=" absolute bottom-0 right-0 btn btn-red rounded-full"
            >
              <Trash2 size={14} />
            </span>
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

      {/* =================== SOCIALS =================== */}
      <div>
        <label className=" block font-medium mb-4">Social Profiles</label>
        {formData.socials.map((link: string, i: number) => (
          <div key={i} className=" flex gap-2 mb-3">
            <input
              type="text"
              value={link}
              placeholder={` Social Link ${i + 1} `}
              onChange={(e) => handleSocialChange(i, e.target.value)}
              className=" border rounded p-2 flex-1"
            />
            {formData.socials.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocial(i)}
                className=" text-red-600 bg-transparent"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSocial}
          className=" text-blue-600 bg-transparent hover:underline"
        >
          + Add Social Link
        </button>
      </div>
    </div>
  );
};

export default Step3;
