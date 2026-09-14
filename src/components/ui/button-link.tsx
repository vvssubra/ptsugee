import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  className = "",
  rel,
  target,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const safeRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel;

  return (
    <Link
      className={`button-link button-link--${variant} ${className}`.trim()}
      rel={safeRel}
      target={target}
      {...props}
    />
  );
}
