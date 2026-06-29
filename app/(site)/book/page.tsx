import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

type BookRedirectPageProps = {
  searchParams: Promise<{ path?: string }>;
};

export default async function BookRedirectPage({ searchParams }: BookRedirectPageProps) {
  const { path } = await searchParams;
  if (path === "quote" || path === "call") {
    redirect(`/services?path=${path}#book`);
  }
  redirect("/services#book");
}
