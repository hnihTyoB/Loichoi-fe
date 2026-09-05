import Link from "next/link";
import { Cloud, Heart, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-kawaii-cream text-kawaii-mocha overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 opacity-25 animate-float pointer-events-none">
        <Cloud className="h-16 w-16 text-kawaii-babyblue" />
      </div>
      <div className="absolute bottom-12 right-12 opacity-25 animate-float-slow pointer-events-none">
        <Heart className="h-14 w-14 fill-kawaii-pink text-kawaii-pink" />
      </div>
      <div className="absolute top-1/3 right-10 opacity-20 animate-float pointer-events-none">
        <Sparkles className="h-10 w-10 text-kawaii-warmbrown" />
      </div>

      <header className="relative z-10 flex h-20 items-center justify-between px-6 md:px-12">
        <Link href="/" className="group flex items-center gap-2.5 font-bold text-xl text-kawaii-mocha">
          <BrandLogo priority alt="" className="transition-transform duration-200 group-hover:scale-105" />
          <span className="hidden md:inline font-extrabold">Loichoi Kawaii</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
