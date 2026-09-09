"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  MessageCircle,
  Search,
  WandSparkles,
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { KeyboardGrid, KeyboardGridSkeleton } from "@/components/public/keyboard-grid";
import { PublicFooter } from "@/components/public/public-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboards } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/DVu3TTv3";

function SectionTitle({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-kawaii-mocha md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm font-medium text-kawaii-mocha/65">{description}</p>
      </div>
      <Button asChild variant="ghost" className="self-start sm:self-auto">
        <Link href={href}>{action}<ArrowRight /></Link>
      </Button>
    </div>
  );
}

export function HomeContent() {
  const router = useRouter();
  const { language } = useTranslation();
  const text = getPublicCopy(language);
  const [search, setSearch] = useState("");
  const explore = useKeyboards({ limit: 8, sort: "latest" });
  const trending = useKeyboards({ limit: 8, sort: "popular" });

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    router.push(query.size ? `/keyboards?${query}` : "/keyboards");
  }

  return (
    <div className="min-h-screen bg-kawaii-cream text-kawaii-mocha">
      <Header />
      <main>
        <section className="relative overflow-hidden px-4 py-20 md:py-28">
          <Image
            src="/images/logos/hinh-nen-cinnamoroll-1.jpg"
            alt="Cinnamoroll background"
            fill
            priority
            className="pointer-events-none object-cover object-[center_30%] opacity-45"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-kawaii-cream/50 via-kawaii-cream/20 to-kawaii-cream/75 backdrop-blur-[1px]" />
          <div className="relative mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-kawaii-sky/70 bg-card/85 px-5 py-2 text-sm font-extrabold text-kawaii-mocha shadow-cloud">
              <WandSparkles className="h-4 w-4 text-kawaii-warmbrown" />
              {text.home.badge}
            </div>
            <h1 className="mx-auto mt-7 max-w-6xl text-4xl font-black leading-[1.08] tracking-tight text-kawaii-mocha sm:text-6xl md:text-7xl">
              {text.home.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-kawaii-mocha/70 md:text-lg">
              {text.home.description}
            </p>
            <form onSubmit={submitSearch} className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-[2rem] border-2 border-kawaii-sky/70 bg-card p-3 shadow-cloud sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-kawaii-mocha/40" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={text.home.search}
                  className="h-12 border-transparent bg-kawaii-cloud/45 pl-12 shadow-none"
                  aria-label={text.home.search}
                />
              </div>
              <Button type="submit" size="lg"><Search />{text.home.searchAction}</Button>
            </form>
          </div>
        </section>

        <section className="border-y-2 border-kawaii-sky/30 bg-kawaii-cloud/30 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionTitle title={text.nav.explore} description={text.explore.description} href="/keyboards" action={text.common.viewAll} />
            {explore.isLoading ? <KeyboardGridSkeleton count={8} /> : null}
            {explore.data?.data.length ? <KeyboardGrid keyboards={explore.data.data} locale={language} priorityCount={8} /> : null}
            {explore.isError ? (
              <div className="rounded-3xl border-2 border-dashed border-kawaii-sky bg-card p-8 text-center text-sm font-bold text-kawaii-mocha/65">
                {text.explore.errorDesc}
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionTitle title={text.home.trending} description={text.home.trendingDesc} href="/trending" action={text.common.viewAll} />
            {trending.isLoading ? <KeyboardGridSkeleton count={8} /> : null}
            {trending.data?.data.length ? <KeyboardGrid keyboards={trending.data.data} locale={language} /> : null}
            {trending.isError ? (
              <div className="rounded-3xl border-2 border-dashed border-kawaii-sky bg-kawaii-cloud/30 p-8 text-center text-sm font-bold text-kawaii-mocha/65">
                {text.explore.errorDesc}
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-4 py-16 md:py-24">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] border-2 border-kawaii-babyblue bg-gradient-to-r from-kawaii-sky/65 via-kawaii-cloud to-kawaii-blush/55 px-6 py-12 text-center shadow-cloud md:px-12 md:py-16">
            <MessageCircle className="mx-auto h-11 w-11 text-kawaii-warmbrown" />
            <h2 className="mt-4 text-3xl font-black text-kawaii-mocha md:text-4xl">{text.home.discordTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-kawaii-mocha/70 md:text-base">{text.home.discordDesc}</p>
            <Button asChild size="lg" className="mt-7">
              <a href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle />{text.home.discordAction}</a>
            </Button>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
