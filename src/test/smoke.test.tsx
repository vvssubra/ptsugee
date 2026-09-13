import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

it("renders the PT SUGEE brand", () => {
  render(<Home />);
  expect(screen.getByText("PT SUGEE")).toBeInTheDocument();
});
