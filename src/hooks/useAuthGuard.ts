// hooks/useRoleGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/store/authStore";


export function useRoleGuard(allowedRoles: Role[]) {
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/403");
    }
  }, [initialized, user, allowedRoles, router]);

  const ready =
    initialized &&
    !!user &&
    allowedRoles.includes(user.role);

  return { ready, user };
}
