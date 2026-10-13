import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { sr, type Dictionary } from "./sr";

/** Interface text per language. Adding a language: add its file here and to `locales` in lib/i18n. */
export const dictionaries: Record<Locale, Dictionary> = { sr, en };

export type { Dictionary };
