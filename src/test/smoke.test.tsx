import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import { HomePage } from "@/app/[locale]/home-view";

it("renders the localized PT SUGEE home page", () => {
  render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <HomePage locale="en" gallery={{ status: "empty", projects: [] }} />
    </NextIntlClientProvider>,
  );

  expect(screen.getByRole("heading", { name: "Leading Engineering & Marine Solutions Across Indonesia and Singapore" })).toBeInTheDocument();
});
