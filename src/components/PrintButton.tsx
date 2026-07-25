"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="no-print"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print report
    </Button>
  );
}
