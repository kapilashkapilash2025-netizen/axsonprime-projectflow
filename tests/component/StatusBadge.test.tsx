import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders a title-cased label for a known status", () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("falls back gracefully for an unrecognized status value", () => {
    render(<StatusBadge status="SOMETHING_NEW" />);
    expect(screen.getByText("Something New")).toBeInTheDocument();
  });
});
