import toast, { Toaster } from "react-hot-toast";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { LoadingModal } from "../loadingModal";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!firstName.trim()) {
      toast.error("First name is required.");
      setIsLoading(false);
      return;
    }

    if (!lastName.trim()) {
      toast.error("Last name is required.");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      toast.error("E-mail address is required.");
      setIsLoading(false);
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Password is required.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    const userData = {
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    try {
      await api.post("/auth/register", userData, {
        withCredentials: true,
      });

      toast.success("Registration successful! Please log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      window.location.href = "/login";
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
      <div className="flex flex-col items-center justify-center relative z-10 w-full bg-white p-8 shadow-lg">
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
        <form onSubmit={handleSubmit} className="text-xs md:text-base">
          <div className="flex flex-col md:flex-row space-y-4">
            <div className="flex flex-col w-[250px] md:w-80 space-y-4 md:pr-4 md:border-r-2 md:border-gray-400">
              <input
                type="text"
                placeholder="First Name..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Middle Name (not required)..."
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col w-full md:w-96 space-y-4 md:pl-4">
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
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
          >
            Sign Up!
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-700 md:text-lg font-medium hover:opacity-[0.80] hover:underline
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
