import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KeyboardDetailContent } from "@/components/public/keyboard-detail-content";
import type { DownloadState } from "@/components/public/download-button";
import { getPublicKeyboardForServer } from "@/lib/server-public-api";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const keyboard = await getPublicKeyboardForServer(slug);
  const title = keyboard?.name || "Theme bàn phím điện thoại";
  const description = keyboard?.description?.slice(0, 160) || "Xem trước và tải bộ file theme bàn phím điện thoại trên Loichoi.";
  const canonical = `${baseUrl}/keyboards/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Loichoi`,
      description,
      url: canonical,
      type: "article",
      images: keyboard?.coverUrl ? [{ url: keyboard.coverUrl, alt: keyboard.name }] : undefined,
    },
  };
}

export default async function KeyboardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ download?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const keyboard = await getPublicKeyboardForServer(slug);
  if (keyboard === null) notFound();

  const rawDownloadState = Array.isArray(query.download) ? query.download[0] : query.download;
  const allowedStates = new Set<DownloadState>(["login", "forbidden", "discord", "quota", "missing", "rate", "error"]);
  const downloadState = rawDownloadState && allowedStates.has(rawDownloadState as DownloadState)
    ? rawDownloadState as DownloadState
    : undefined;

  return <KeyboardDetailContent slug={slug} initialData={keyboard} downloadState={downloadState} />;
}
