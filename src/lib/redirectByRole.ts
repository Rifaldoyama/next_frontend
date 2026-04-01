import { Role } from "@/store/authStore";

export function redirectByRole(
  role: Role,
  router: { replace: (path: string) => void }
) {
  switch (role) {
    case "ADMIN":
      router.replace("/admin");
      break;
    case "PETUGAS":
      router.replace("/petugas");
      break;
    case "USER":
      router.replace("/dashboard");
      break;
  }
}
