import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";

type LogOutModalProps = {
  onCancel: () => void;
};

export default function LogOutModal({ onCancel }: LogOutModalProps) {
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out!");
      window.location.href = "/";
    } catch (err) {
      toast.error("Logout failed.");
      console.error(err);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.50] px-4">
      <Toaster />
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <FiLogOut className="text-red-500 text-xl" />
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 font-vogue">
            Log Out
          </h2>
        </div>
        <p className="text-sm md:text-lg text-gray-600">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
