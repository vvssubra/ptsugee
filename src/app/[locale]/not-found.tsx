import { getLocale } from "next-intl/server";
import enMessages from "../../../messages/en.json";
import idMessages from "../../../messages/id.json";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const messages = { en: enMessages, id: idMessages } as const;

export default async function NotFound() {
  const requestedLocale = await getLocale();
  const locale: Locale = requestedLocale === "id" ? "id" : "en";
  const copy = messages[locale].system.notFound;

  return (
    <main className="status-page">
      <div className="container status-page__content">
        <p className="eyebrow">404</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <Link className="button-link" href="/" locale={locale}>{copy.action}</Link>
      </div>
    </main>
  );
}
