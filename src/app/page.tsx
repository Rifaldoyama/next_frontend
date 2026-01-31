import Link from "next/link";
import { Button } from "@/components/atoms/Buttons";

export default function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="bg-white p-10 rounded dark:bg-black">
        <Link href="/login">
          <Button >Login</Button>
        </Link>
      </main>
    </div>
  );
}
