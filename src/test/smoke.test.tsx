import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import Home from "@/app/[locale]/page";

it("renders the localized PT SUGEE home page", () => {
  render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <Home />
    </NextIntlClientProvider>,
  );

  expect(screen.getByRole("heading", { name: "Leading Engineering & Marine Solutions Across Indonesia and Singapore" })).toBeInTheDocument();
});
