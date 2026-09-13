import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home.hero");

  return (
    <main>
      <p>{t("eyebrow")}</p>
      <h1>{t("heading")}</h1>
      <p>{t("body")}</p>
    </main>
  );
}
