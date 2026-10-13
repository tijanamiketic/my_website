import { notFound } from "next/navigation";

/** Any unknown URL inside a language shows that language's 404 page (app/[lang]/not-found.tsx). */
export default function CatchAll() {
  notFound();
}
