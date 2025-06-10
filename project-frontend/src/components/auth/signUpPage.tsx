import toast, { Toaster } from "react-hot-toast";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { LoadingModal } from "../loadingModal";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    const userData = {
      email,
      password,
      confirmPassword,
    };

    try {
      await axios.post("http://localhost:5090/api/auth/register", userData);

      toast.success("Registration successful! Please log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error("Registration error:", axiosError.response.data);
        toast.error(
          `Registration failed: ${
            axiosError.message || "Please check your input."
          }`
        );
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
        toast.error(
          "Registration failed: No response from server. Are you connected to the Internet?"
        );
      } else {
        console.error("Axios setup error:", axiosError.message);
        toast.error(`Registration failed: ${axiosError.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
      <Toaster />
      {isLoading && <LoadingModal />}
      <div className="absolute inset-0 ocean-bg"></div>
      <div className="flex flex-col items-center justify-center relative z-10 w-3/4 md:w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <Image
          src="/images/logo.png"
          alt="Website Logo"
          width={40}
          height={40}
          className="object-contain cursor-pointer"
        />
        <h1 className="text-lg md:text-2xl font-semibold mt-3 mb-5 text-center font-vogue">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs md:text-base"
        >
          <input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm Password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Sign Up!
          </button>
        </form>

        <p className="mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-700 text-lg font-medium hover:opacity-[0.80] hover:underline
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
