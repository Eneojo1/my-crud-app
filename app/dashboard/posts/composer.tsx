import { CommentType, InputChangeEvent } from "@/type";
import { useRef, useState } from "react";
import { Camera, Send, Smile } from "lucide-react";
import { dataset } from "./dataset";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  placeholder?: string;
  replyTo?: string;
  onSubmit?: (text: string) => Promise<void> | void;
  node?: CommentType;
  onClose: () => void;
};

interface FormDataType {
  guest: string;
  files: File[];
  comment: string;
}

const Composer = ({ node, replyTo, onClose }: Props) => {
  const mediaRef = useRef<HTMLInputElement | null>(null);
  const [comment, setComment] = useState("");
  const [guest, setGuest] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    guest: "",
    files: [],
    comment: "",
  });

  const user = dataset?.users[1] ?? null;

  // -> AUTO RESIZE TEXTAREA
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    // const { name, value, selectionStart } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFormData((prev) => ({
      ...prev,
      files: [e.target.files![0]],
    }));
  };

  const guestName = guest.trim();

  const payload = {
    id: "6",
    user_id: user?.id ?? null,
    guest: user?.id ? null : guestName || "Anonymous",
    post_id: node?.post_id,
    parent_id: node?.parent_id,
    file: file,
    comment: comment.trim(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const validate = () => comment.trim().length < 1 && formData.files.length < 1;

  return (
    <form className="flex gap-2 text-sm mt-3">
      <Avatar className="h-6! w-6! z-50">
        <AvatarImage src={user?.avatar || "/user.jpg"} />
      </Avatar>

      <div>
        <input
          ref={mediaRef}
          type="file"
          accept="video/*, image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {!user && (
          <input
            placeholder="Enter your name (optional)"
            name="guest"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            className="bg-muted py-2 px-4 rounded-md mb-3"
          />
        )}

        <div className="bg-muted rounded-2xl py-2 px-4 flex-col gap-3">
          <textarea
            placeholder={replyTo ? `Reply to ${replyTo}…` : "Write a comment…"}
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onInput={handleInput}
            className="flex-1 outline-0 resize-none"
          />

          <div className="flex justify-between">
            <div className="action-btns">
              <button type="button" className="tooltip">
                <Smile />
                <span className="tooltip-bubble">Smiley</span>
              </button>

              <button
                type="button"
                className="tooltip"
                onClick={() => mediaRef.current?.click()}
              >
                <Camera />
                <span className="tooltip-bubble">Attach file</span>
              </button>
            </div>

            <div className="action-btns">
              <span className="tooltip">
                <button
                  type="button"
                  disabled={validate()}
                  className={`not-hover ${
                    validate() ? "text-se7 cursor-not-allowed!" : "text-pr1"
                  }`}
                  onClick={() => {
                    onClose();
                    console.log(payload);
                  }}
                >
                  <Send />
                </button>
                <span className="tooltip-bubble">Post comment</span>
              </span>
            </div>
          </div>
        </div>

        {formData.files.length > 0 && (
          <div className="mt-2 text-sm flex items-center gap-2">
            <div className="w-31 h-31 relative bg-se6">
              <span
                onClick={() => setFormData({ ...formData, files: [] })}
                className="absolute top-0 -right-6 text-xl cursor-pointer bg-muted text-pr1 flex justify-center items-center w-6 h-6 rounded-full"
              >
                &#215;
              </span>
              {formData.files[0].type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(formData.files[0])}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={URL.createObjectURL(formData.files[0])}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default Composer;
