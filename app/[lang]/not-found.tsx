import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { locale, t } = await getI18n();
  return (
    <main id="main" className="wrap section">
      <div className="glass article" style={{ textAlign: "center" }}>
        <p className="eyebrow">404</p>
        <h1 className="h2">
          {t.notFound.title} <span className="serif grad-text">{t.notFound.accent}</span>
        </h1>
        <p className="lede" style={{ margin: "1rem auto 2rem" }}>
          {t.notFound.text}
        </p>
        <Link href={localePath(locale, "/")} className="btn btn-primary">
          {t.notFound.back}
        </Link>
      </div>
    </main>
  );
}
