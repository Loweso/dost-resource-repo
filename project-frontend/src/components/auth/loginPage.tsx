import toast, { Toaster } from "react-hot-toast";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { LoadingModal } from "../loadingModal";
import { UserStore } from "@/store/user";

export default function LoginPage() {
  const setUser = UserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const userData = {
      email,
      password,
    };

    try {
      const response = await api.post("/auth/login", userData, {
        withCredentials: true,
      });

      const userId = response.data?.userId;
      const userRole = response.data?.role;
      const userEmail = email;

      if (userId) {
        toast.success("Login successful! Redirecting to your user profile...");
        setEmail("");
        setPassword("");
        setUser({ userId, email: userEmail, role: userRole });
      } else {
        toast.error("User not found. Please try again.", response.data?.token);
      }

      window.location.href = `/users/${userId}`;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error("Log in error:", axiosError.response.data);
        toast.error(
          `Log in failed: ${axiosError.message || "Please check your input."}`
        );
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
        toast.error(
          "Log in failed: No response from server. Are you connected to the Internet?"
        );
      } else {
        console.error("Axios setup error:", axiosError.message);
        toast.error(`Log in failed: ${axiosError.message}`);
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
          Log In
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs md:text-base"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer"
          >
            Log In
          </button>
        </form>
        <p className="mt-4">
          No account yet?{" "}
          <Link
            href="/signup"
            className="text-gray-700 text-lg font-medium hover:opacity-[0.80] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
