import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import ErrorPage from "@/app/[locale]/error";

describe("localized runtime error", () => {
  it.each([
    ["en", enMessages, "Something went wrong", "Try again"],
    ["id", idMessages, "Terjadi kesalahan", "Coba kembali"],
  ] as const)("renders safe %s copy and retries accessibly", (locale, messages, title, action) => {
    const retry = vi.fn();
    const secret = "database password should never render";
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ErrorPage error={new Error(secret)} retry={retry} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(title);
    expect(screen.queryByText(secret)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: action }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
