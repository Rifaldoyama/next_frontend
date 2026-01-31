"use client";

import { ReactNode } from "react";
import { useInitAuth } from "@/hooks/useInitAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  useInitAuth(); 
  return <>{children}</>;
}
