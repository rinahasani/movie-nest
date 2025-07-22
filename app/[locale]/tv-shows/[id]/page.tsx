import React, { use } from "react";
import TvShowDetails from "@/components/tvShow/TvShowDetails";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  return <TvShowDetails id={id} locale={locale} />;
}
