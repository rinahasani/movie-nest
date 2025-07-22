import React, { use } from "react";
import FavoritesPage from "@/components/favorites/FavoritesPage";

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);
  return <FavoritesPage />;
}
