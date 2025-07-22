import React, { use } from "react";
import TvShowsList from "@/components/tvShow/TvShowsList";

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return <TvShowsList locale={locale} />;
}
