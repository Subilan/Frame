import type { Langs } from "~/types/client";

export default function (lang: Langs, en?: string, zh?: string) {
  if (lang === 'en') if (en) if (en.length) if (en.length > 0) return en;

  return zh || '';
}