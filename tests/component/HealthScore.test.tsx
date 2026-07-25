import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthScore } from "@/components/HealthScore";

describe("HealthScore", () => {
  it("renders the numeric score with an accessible label", () => {
    render(<HealthScore score={82} />);
    expect(
      screen.getByLabelText("Health score 82 out of 100"),
    ).toHaveTextContent("82");
  });

  it("renders a low score without throwing", () => {
    render(<HealthScore score={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
