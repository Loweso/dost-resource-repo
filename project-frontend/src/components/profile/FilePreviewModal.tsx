import Image from "next/image";
import { useState } from "react";

type FilePreviewModalProps = {
  isOpen: boolean;
  filePreview: string | ArrayBuffer | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function FilePreviewModal({
  isOpen,
  filePreview,
  onConfirm,
  onCancel,
}: FilePreviewModalProps) {
  const [loading, setLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-8">
      <div className="flex flex-col w-full sm:w-3/4 h-full p-4 bg-gray-100 rounded-lg">
        <h3 className="font-vogue text-xl mb-4">Preview File</h3>

        <div className="mb-4 overflow-auto">
          {loading && <div> Loading preview...</div>}
          {filePreview &&
            (String(filePreview).startsWith("data:image/") ? (
              <Image
                src={String(filePreview)}
                alt="Preview"
                className="max-w-full h-auto"
                width={880}
                height={0}
                onLoad={() => setLoading(false)}
              />
            ) : (
              <embed
                src={String(filePreview)}
                width="100%"
                height="540"
                onLoad={() => setLoading(false)}
              />
            ))}
        </div>

        <div className="h-8 sm:h-12 flex w-full gap-2 justify-end">
          <button
            className="flex bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base p-2 sm:p-4 rounded items-center justify-center cursor-pointer"
            onClick={onConfirm}
          >
            Submit
          </button>
          <button
            className="flex bg-slate-300 hover:bg-slate-400 text-sm sm:text-base p-2 sm:p-4 rounded items-center justify-center cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
