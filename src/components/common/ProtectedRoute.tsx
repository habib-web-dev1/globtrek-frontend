"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN";
}) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (requiredRole && user?.role !== requiredRole) {
      router.push("/"); // Redirect if they don't have the right role
    }
  }, [token, user, requiredRole, router]);

  if (!token) return null; // Or a loading spinner

  return <>{children}</>;
}
