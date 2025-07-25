import React, { use } from "react";
import CollectionDetails from "@/components/collections/CollectionDetails";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  return <CollectionDetails id={id} locale={locale} />;
}
