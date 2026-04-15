// src/components/molecules/DepositFilter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Buttons";

interface DepositFilterProps {
  onStatusChange: (status: "all" | "pending" | "done") => void;
}

export function DepositFilter({ onStatusChange }: DepositFilterProps) {
  const [activeStatus, setActiveStatus] = useState<"all" | "pending" | "done">("pending");

  const handleStatusChange = (status: "all" | "pending" | "done") => {
    setActiveStatus(status);
    onStatusChange(status);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex gap-2">
        <Button
          variant={activeStatus === "pending" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleStatusChange("pending")}
        >
          Menunggu Pengembalian
        </Button>
        <Button
          variant={activeStatus === "done" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleStatusChange("done")}
        >
          Sudah Dikembalikan
        </Button>
        <Button
          variant={activeStatus === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleStatusChange("all")}
        >
          Semua
        </Button>
      </div>
    </div>
  );
}