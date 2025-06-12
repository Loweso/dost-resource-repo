"use client";

import api from "@/lib/api";
import { useEffect } from "react";
import { UserStore } from "@/store/user";

export default function UserInitializer() {
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get("/auth/session", {
          withCredentials: true,
        });
        const session = await res.data;

        if (session?.user) {
          UserStore.setState({
            userId: session.user.id,
            email: session.user.email,
            role: session.user.role,
            isLoggedIn: true,
          });
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    };

    fetchSession();
  }, []);

  return null;
}
