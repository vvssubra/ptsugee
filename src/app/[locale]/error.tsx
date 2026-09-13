"use client";

import { useTranslations } from "next-intl";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("system.error");

  return (
    <main className="status-page">
      <div className="container status-page__content" role="alert">
        <p className="eyebrow">PT SUGEE</p>
        <h1>{t("title")}</h1>
        <p>{t("body")}</p>
        <button className="button-link" type="button" onClick={retry}>{t("action")}</button>
      </div>
    </main>
  );
}
