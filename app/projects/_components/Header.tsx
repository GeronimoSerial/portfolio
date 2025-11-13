"use client";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("projectsPage");

  return (
    <div className="mb-16">
      <div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h1>
        <p className="mt-6 mb-4 text-center text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
}
