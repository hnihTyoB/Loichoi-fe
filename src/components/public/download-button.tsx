"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, LoaderCircle, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";
import axios from "axios";
import { keyboardService } from "@/services/keyboard.service";

export type DownloadState = "login" | "forbidden" | "discord" | "quota" | "missing" | "rate" | "error";

const defaultDiscordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.com";

interface DownloadErrorData {
  inviteUrl?: string;
  tier?: string;
  nextTier?: string;
  currentDownloads?: number;
  maxLimit?: number;
  resetCycle?: string;
}

export function DownloadButton({ slug, errorState: initialErrorState }: { slug: string; errorState?: DownloadState }) {
  const { language } = useTranslation();
  const auth = useAuth();
  const router = useRouter();
  const text = getPublicCopy(language).download;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentErrorState, setCurrentErrorState] = useState<DownloadState | undefined>(initialErrorState);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [activeDiscordUrl, setActiveDiscordUrl] = useState<string>(defaultDiscordUrl);

  const errorState = currentErrorState || initialErrorState;

  const fallbackMessage =
    errorState === "login"
      ? text.login
      : errorState === "missing"
        ? text.missing
        : errorState === "rate"
          ? text.rate
          : errorState === "quota"
            ? text.quota
            : errorState === "discord" || errorState === "forbidden"
              ? text.forbidden
              : errorState === "error"
                ? text.error
                : undefined;

  const displayMessage = serverMessage || fallbackMessage;

  const requiresLogin = !auth.isLoading && !auth.isAuthenticated;

  if (requiresLogin || errorState === "login") {
    return (
      <div
        className="w-full rounded-2xl border border-kawaii-blush bg-kawaii-blush/25 p-4 text-center text-sm font-semibold text-kawaii-mocha"
        role="alert"
      >
        <p>{text.login}</p>
        <Button asChild className="mt-4 w-full">
          <Link href={`/login?next=${encodeURIComponent(`/keyboards/${slug}`)}`}>
            <LogIn />
            {text.loginAction}
          </Link>
        </Button>
      </div>
    );
  }

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.isLoading || isSubmitting) return;

    if (!auth.isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/keyboards/${slug}`)}`);
      return;
    }

    setIsSubmitting(true);
    setCurrentErrorState(undefined);
    setServerMessage(null);

    try {
      const data = await keyboardService.download(slug);
      if (data?.downloadUrl) {
        window.location.href = data.downloadUrl;
      }
    } catch (err: unknown) {
      if (axios.isAxiosError<{ code?: string; message?: string; data?: DownloadErrorData }>(err)) {
        const status = err.response?.status;
        const code = err.response?.data?.code;
        const respMessage = err.response?.data?.message;
        const respData = err.response?.data?.data;

        if (respMessage) {
          setServerMessage(respMessage);
        }

        if (respData?.inviteUrl) {
          setActiveDiscordUrl(respData.inviteUrl);
        }

        if (status === 401) {
          setCurrentErrorState("login");
        } else if (code === "DOWNLOAD_QUOTA_EXCEEDED") {
          setCurrentErrorState("quota");
        } else if (status === 403 && code?.startsWith("DISCORD_")) {
          setCurrentErrorState("discord");
        } else if (status === 403) {
          setCurrentErrorState("forbidden");
        } else if (status === 404) {
          setCurrentErrorState("missing");
        } else if (status === 429) {
          setCurrentErrorState("rate");
        } else {
          setCurrentErrorState("error");
        }
      } else {
        setCurrentErrorState("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDiscordButton =
    errorState === "discord" || (errorState === "quota" && Boolean(activeDiscordUrl));

  return (
    <div className="w-full space-y-3">
      <form className="w-full" onSubmit={handleDownload}>
        <Button type="submit" size="lg" className="w-full text-base" disabled={auth.isLoading || isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Download />}
          {isSubmitting ? text.checking : text.action}
        </Button>
      </form>

      {displayMessage ? (
        <div
          className="w-full rounded-2xl border border-kawaii-blush bg-kawaii-blush/25 p-4 text-center text-sm font-semibold text-kawaii-mocha"
          role="alert"
        >
          <p>{displayMessage}</p>
          {showDiscordButton ? (
            <Button asChild size="sm" variant="outline" className="mt-3 w-full bg-card">
              <a href={activeDiscordUrl} target="_blank" rel="noreferrer">
                <MessageCircle />
                {text.discordAction}
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
