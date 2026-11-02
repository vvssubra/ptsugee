import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero";

vi.mock("motion/react", () => ({
  motion: { div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div> },
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: 0 }),
  useTransform: () => 1.2,
}));

describe("Hero", () => {
  it("renders the home image inside a scroll-reveal scene", () => {
    render(<Hero image={{ src: "/images/hero/home-offshore-rig.webp", width: 1600, height: 896, alt: "Offshore platform" }} body="Body" eyebrow="Eyebrow" heading="Heading" primaryCta="Contact" secondaryCta="Services" serviceHref="/service" />);

    expect(screen.getByTestId("home-hero-scene")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Offshore platform" })).toHaveAttribute("src", expect.stringContaining("home-offshore-rig"));
  });
});
