"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Flame, Keyboard, LogIn, LogOut, PanelLeftClose, PanelLeftOpen, User as UserIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore } from "@/stores/ui-store";
import { useTranslation } from "@/hooks/use-translation";
import { authService } from "@/services/auth.service";
import { getPublicCopy } from "@/lib/public-copy";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const { t, language, isMounted } = useTranslation();
  const pathname = usePathname();
  const publicText = getPublicCopy(language);
  const isPublicRoute = pathname === "/" ||
    pathname === "/keyboards" ||
    (pathname.startsWith("/keyboards/") && !pathname.startsWith("/keyboards/manage")) ||
    pathname === "/trending" ||
    pathname === "/guide";
  const showSidebarToggle = isAuthenticated && !isPublicRoute;

  const publicLinks = [
    { href: "/keyboards", label: isMounted ? t.nav.explore : publicText.nav.explore, icon: Keyboard },
    { href: "/trending", label: isMounted ? t.nav.trending : publicText.nav.trending, icon: Flame },
    { href: "/guide", label: isMounted ? t.nav.guide : publicText.nav.guide, icon: BookOpen },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-20 w-full flex-wrap items-center justify-between gap-y-2 border-b-2 border-kawaii-sky/30 bg-background/90 px-4 py-3 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={isMounted ? t.nav.toggleSidebar : "Toggle Sidebar"}
            aria-expanded={isSidebarOpen}
            className="rounded-full"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5 text-kawaii-mocha" />
            ) : (
              <PanelLeftOpen className="h-5 w-5 text-kawaii-mocha" />
            )}
            <span className="sr-only">{isMounted ? t.nav.toggleSidebar : "Toggle Sidebar"}</span>
          </Button>
        )}
        <Link href="/" className="group flex items-center gap-2.5 font-bold text-xl tracking-tight text-kawaii-mocha">
          <BrandLogo priority alt="" className="transition-transform duration-200 group-hover:scale-105" />
          <span className="hidden md:inline font-extrabold bg-gradient-to-r from-kawaii-mocha to-kawaii-warmbrown bg-clip-text text-transparent">
            Loichoi
          </span>
        </Link>
      </div>

      <nav
        className="order-3 flex w-full items-center justify-center gap-1 lg:order-none lg:w-auto"
        aria-label={isMounted ? t.nav.menuTitle : "Public navigation"}
      >
        {publicLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (pathname.startsWith(`${href}/`) && !pathname.startsWith(`${href}/manage`));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors sm:gap-2 sm:px-4 sm:text-sm bouncy-hover",
                active
                  ? "bg-kawaii-sky/55 text-kawaii-mocha"
                  : "text-kawaii-mocha/65 hover:bg-kawaii-cloud hover:text-kawaii-mocha",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <LanguageToggle />
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <NotificationDropdown />
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-kawaii-sky/60 bg-kawaii-cloud/50 hover:bg-kawaii-blush/40 text-kawaii-mocha transition-all duration-200 bouncy-hover"
              >
                <UserIcon className="h-4 w-4 text-kawaii-mocha" />
                <span className="hidden sm:inline-block font-semibold text-kawaii-mocha">{user?.name || user?.email}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label={isMounted ? t.nav.logout : "Đăng xuất"}
              title={isMounted ? t.nav.logout : "Đăng xuất"}
              className="rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full font-bold gap-1.5 hover:bg-kawaii-cloud text-kawaii-mocha">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline-block">{isMounted ? t.nav.login : "Đăng nhập"}</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full font-bold shadow-cloud gap-1.5 bouncy-hover">
                <UserPlus className="h-4 w-4" />
                <span>{isMounted ? t.nav.register : "Đăng ký"}</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
