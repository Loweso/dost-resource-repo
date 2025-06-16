import { FaEnvelope, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex justify-center items-center gap-4 p-4 bg-gray-50">
      <a
        aria-label="Email us"
        href="dostupcebu.sa@gmail.com"
        className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"
      >
        <FaEnvelope size={20} />
      </a>
      <a
        aria-label="Visit our Facebook page"
        href="https://www.facebook.com/dostsaupcebu"
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"
      >
        <FaFacebookF size={20} />
      </a>
    </footer>
  );
}
