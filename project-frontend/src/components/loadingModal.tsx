export const LoadingModal = () => (
  <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-90">
    <div className="flex items-center justify-center bg-white shadow rounded-lg w-40 h-32">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  </div>
);
