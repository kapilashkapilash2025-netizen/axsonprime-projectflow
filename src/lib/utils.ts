import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | null | undefined,
  format = "yyyy-MM-dd",
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const yyyy = d.getFullYear().toString().padStart(4, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  if (format === "MM/dd/yyyy") return `${mm}/${dd}/${yyyy}`;
  if (format === "dd/MM/yyyy") return `${dd}/${mm}/${yyyy}`;
  return `${yyyy}-${mm}-${dd}`;
}

export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime() < Date.now();
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
