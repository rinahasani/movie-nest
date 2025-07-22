import React, { use } from "react";
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);
  return <ResetPasswordPage />;
}
