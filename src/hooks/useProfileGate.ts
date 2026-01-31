import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";


export function useProfileGate() {
  const { user, isComplete, initialized } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    if (
      user?.role === 'USER' &&
      isComplete === false &&
      pathname.startsWith('/dashboard')
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [user, isComplete, pathname, initialized]);

  const goComplete = () => {
    setOpen(false);
    router.push('/lengkapi-data');
  };

  const goSkip = () => {
    setOpen(false);
    router.push('/dashboard/katalog');
  };

  return { open, goComplete, goSkip };
}
