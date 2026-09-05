"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.37 0 .72.07 1.04.2v-3.5a6.38 6.38 0 0 0-1.04-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.58a8.28 8.28 0 0 0 4.76 1.57V6.69z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Discord",
    href: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/DVu3TTv3",
    icon: DiscordIcon,
    iconColor: "text-[#5865F2]",
    subtext: "discord.gg/DVu3TTv3",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@roianroi",
    icon: TikTokIcon,
    iconColor: "text-foreground",
    subtext: "@roianroi",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/huynhcaogiahan",
    icon: FacebookIcon,
    iconColor: "text-[#1877F2]",
    subtext: "Huỳnh Cao Gia Hân",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/cl1rtl1jzl1",
    icon: FacebookIcon,
    iconColor: "text-[#1877F2]",
    subtext: "cl1rtl1jzl1",
  },
];

export function PublicFooter() {
  const { language } = useTranslation();
  const text = getPublicCopy(language);

  return (
    <footer className="mt-16 border-t-2 border-kawaii-sky/40 bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-12 md:grid-cols-[1.3fr_0.9fr_1.8fr] md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3 text-xl font-black text-kawaii-mocha">
            <BrandLogo alt="" />
            Loichoi
          </Link>
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-kawaii-mocha/65">
            {text.footer.description}
          </p>
        </div>
        <div className="col-span-1">
          <h2 className="font-extrabold text-kawaii-mocha">{text.footer.discover}</h2>
          <nav className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold text-kawaii-mocha/65">
            <Link className="hover:text-kawaii-warmbrown" href="/keyboards">{text.nav.explore}</Link>
            <Link className="hover:text-kawaii-warmbrown" href="/trending">{text.nav.trending}</Link>
            <Link className="hover:text-kawaii-warmbrown" href="/guide">{text.nav.guide}</Link>
          </nav>
        </div>
        <div className="col-span-1">
          <h2 className="font-extrabold text-kawaii-mocha">{text.footer.community}</h2>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 md:grid-cols-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-2xl border border-kawaii-sky/50 bg-kawaii-cloud/40 p-2 sm:gap-3 sm:px-3.5 sm:py-2.5 transition-all duration-200 hover:border-kawaii-sky hover:bg-kawaii-babyblue/45 hover:shadow-cloud"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card shadow-xs transition-transform group-hover:scale-105">
                    <Icon className={`h-4 w-4 ${social.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-kawaii-mocha group-hover:text-kawaii-warmbrown">{social.name}</p>
                    <p className="truncate text-[10px] sm:text-[11px] font-medium text-kawaii-mocha/55">{social.subtext}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-kawaii-sky/40 px-6 py-5 text-center text-xs font-semibold text-kawaii-mocha/55">
        Copyright {new Date().getFullYear()} {text.footer.rights}
      </div>
    </footer>
  );
}
