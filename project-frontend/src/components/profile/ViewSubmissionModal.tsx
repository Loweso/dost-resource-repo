import Image from "next/image";

type ViewSubmissionModalProps = {
  isOpen: boolean;
  filePath: string | undefined;
  onDelete: () => void;
  onClose: () => void;
};

export default function ViewSubmissionModal({
  isOpen,
  filePath,
  onDelete,
  onClose,
}: ViewSubmissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-8">
      <div className="flex flex-col w-full sm:w-3/4 h-full p-4 bg-gray-100 rounded-lg">
        <h3 className="font-vogue text-xl mb-4">View Submitted File</h3>

        {filePath && (
          <div className="mb-4 overflow-auto">
            {String(filePath).startsWith("http") &&
            (String(filePath).endsWith(".png") ||
              String(filePath).endsWith(".jpg") ||
              String(filePath).endsWith(".jpeg")) ? (
              <Image
                src={String(filePath)}
                alt="Submission"
                className="max-w-full h-auto"
                width={880}
                height={0}
              />
            ) : (
              <embed
                src={String(filePath)}
                width="100%"
                height="540"
                type="application/pdf"
              />
            )}
          </div>
        )}

        <div className="flex w-full gap-2 justify-end">
          <button
            className="flex bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base p-2 sm:p-4 rounded items-center justify-center cursor-pointer"
            onClick={onDelete}
          >
            Delete submission
          </button>
          <button
            className="flex bg-slate-300 hover:bg-slate-400 text-sm sm:text-base p-2 sm:p-4 rounded items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
