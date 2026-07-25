import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        removed.
      </p>
      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        Back to dashboard
      </Link>
    </div>
  );
}
