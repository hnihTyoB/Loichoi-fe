"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { PublicFooter } from "@/components/public/public-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const { t, isMounted } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = pathname === "/keyboards" ||
    (pathname.startsWith("/keyboards/") &&
      !pathname.startsWith("/keyboards/manage") &&
      !pathname.startsWith("/keyboards/liked")) ||
    pathname === "/trending" ||
    pathname === "/guide";

  useEffect(() => {
    if (!isPublicRoute && !isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  if (!isPublicRoute && (isLoading || !isAuthenticated)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-kawaii-cream gap-4">
        <div className="animate-bounce-subtle">
          <BrandLogo priority size="lg" />
        </div>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-kawaii-babyblue border-t-transparent" />
        <p className="text-sm font-bold text-kawaii-mocha">
          {isMounted ? t.common.loadingWorld : "Đang tải thế giới Kawaii..."}
        </p>
      </div>
    );
  }

  if (isPublicRoute) {
    return (
      <div className="flex min-h-screen flex-col bg-kawaii-cream/60 text-kawaii-mocha">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-kawaii-cream/60 text-kawaii-mocha">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );

}
