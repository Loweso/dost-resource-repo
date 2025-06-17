import React, { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import api from "@/lib/api";

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddContentModal({
  isOpen,
  onClose,
}: AddContentModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please input all the fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);
      if (imageFile) formData.append("Image", imageFile);

      await api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Article successfully posted.");
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding article", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 max-w-screen bg-black/50 overflow-hidden">
      <div className="relative flex flex-col md:flex-row rounded-lg shadow-md max-h-[80%] min-w-3/4 min-h-2/3 max-w-3xl overflow-auto md:overflow-hidden ocean-bg">
        <div className="flex flex-col p-4 sm:p-12 w-full">
          {imagePreview ? (
            <Image
              src={imagePreview as string}
              alt="Preview"
              width={400}
              height={250}
              className="rounded-md w-full h-64 object-cover"
            />
          ) : (
            <div className="rounded-md w-full h-60 flex items-center justify-center bg-gray-200">
              <span>No Image</span>
            </div>
          )}

          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="image"
            className="mt-4 block p-2 bg-blue-500 hover:bg-blue-700 text-gray-100 text-center rounded-md cursor-pointer"
          >
            Add Image
          </label>
          <p className="text-white/60 text-sm mt-2">
            Only one image can be uploaded
          </p>
        </div>
        <div className="flex flex-col bg-gray-50 h-full w-full p-4">
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 w-full mb-4 border rounded-md"
          />
          <textarea
            placeholder="Article Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="p-2 w-full mb-4 border rounded-md"
          ></textarea>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleAdd}
              disabled={!title || !content || isSubmitting}
              className="p-2 bg-green-500 hover:bg-green-600 text-gray-100 rounded-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Adding…" : "Add"}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded-md cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
