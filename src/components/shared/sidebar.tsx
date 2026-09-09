"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarClock,
  ClipboardList,
  CloudUpload,
  Construction,
  Flag,
  FolderTree,
  Heart,
  Home,
  KeyRound,
  Keyboard,
  Paintbrush,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { PermissionGate } from "./permission-gate";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { DASHBOARD_ACCESS_PERMISSIONS } from "@/lib/dashboard-access";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import type { TranslationKeys } from "@/lib/i18n";

type NavKey = keyof TranslationKeys["nav"];

interface NavItemConfig {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  permissions?: string[];
  key: NavKey;
  fallbackVi: string;
  fallbackEn: string;
}

const navItems: NavItemConfig[] = [
  { href: "/dashboard", icon: Home, permissions: DASHBOARD_ACCESS_PERMISSIONS, key: "dashboard", fallbackVi: "Tổng quan", fallbackEn: "Dashboard" },
  { href: "/keyboards/liked", icon: Heart, permission: PERMISSIONS.KEYBOARD_LIKE_READ, key: "likedKeyboards", fallbackVi: "Theme đã thích", fallbackEn: "Liked Themes" },
  { href: "/keyboards/manage", icon: Keyboard, permission: PERMISSIONS.KEYBOARD_READ, key: "keyboardsManage", fallbackVi: "Quản trị theme", fallbackEn: "Theme Management" },
  { href: "/imports", icon: CloudUpload, permission: PERMISSIONS.IMPORT_READ, key: "imports", fallbackVi: "Discord Imports", fallbackEn: "Discord Imports" },
  { href: "/categories/manage", icon: FolderTree, permission: PERMISSIONS.CATEGORY_READ, key: "categoriesManage", fallbackVi: "Quản trị danh mục", fallbackEn: "Category Management" },
  { href: "/colors/manage", icon: Palette, permission: PERMISSIONS.COLOR_READ, key: "colorsManage", fallbackVi: "Quản trị màu sắc", fallbackEn: "Color Management" },
  { href: "/styles/manage", icon: Sparkles, permission: PERMISSIONS.STYLE_READ, key: "stylesManage", fallbackVi: "Quản trị phong cách", fallbackEn: "Style Management" },
  { href: "/users", icon: Users, permission: PERMISSIONS.USER_READ, key: "users", fallbackVi: "Người dùng", fallbackEn: "Users" },
  { href: "/roles", icon: ShieldCheck, permission: PERMISSIONS.ROLE_READ, key: "roles", fallbackVi: "Vai trò và quyền", fallbackEn: "Roles & Permissions" },
  { href: "/audit-logs", icon: ClipboardList, permission: PERMISSIONS.AUDIT_LOG_READ, key: "auditLogs", fallbackVi: "Nhật ký kiểm toán", fallbackEn: "Audit Logs" },
  { href: "/notifications", icon: Bell, permission: PERMISSIONS.NOTIFICATION_READ, key: "notifications", fallbackVi: "Thông báo", fallbackEn: "Notifications" },
  { href: "/studio", icon: Paintbrush, permission: PERMISSIONS.STUDIO_ACCESS, key: "studio", fallbackVi: "Creator Studio", fallbackEn: "Creator Studio" },
  { href: "/settings/integrations", icon: KeyRound, permissions: [PERMISSIONS.API_KEY_READ, PERMISSIONS.WEBHOOK_READ], key: "integrations", fallbackVi: "API và Webhook", fallbackEn: "API & Webhooks" },
  { href: "/settings/system", icon: Flag, permission: PERMISSIONS.SYSTEM_CONFIG_READ, key: "systemConfig", fallbackVi: "Cấu hình hệ thống", fallbackEn: "System Configuration" },
  { href: "/settings/maintenance", icon: Construction, permissions: [PERMISSIONS.MAINTENANCE_READ, PERMISSIONS.MAINTENANCE_MANAGE], key: "maintenance", fallbackVi: "Bảo trì", fallbackEn: "Maintenance" },
  { href: "/settings/cron", icon: CalendarClock, permission: PERMISSIONS.CRON_JOB_READ, key: "cronJobs", fallbackVi: "Tác vụ định kỳ", fallbackEn: "Scheduled Jobs" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useUiStore();
  const { t, isMounted, language } = useTranslation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-screen w-72 shrink-0 flex-col border-r-2 border-kawaii-sky/30 bg-card/90 backdrop-blur-md transition-[transform,width,border-color] duration-300 md:sticky md:top-0 md:translate-x-0",
        isSidebarOpen
          ? "translate-x-0 md:w-72"
          : "pointer-events-none -translate-x-full overflow-hidden md:w-0 md:translate-x-0 md:border-r-0",
      )}
    >

      <div className="flex h-20 items-center gap-3 border-b-2 border-kawaii-sky/30 px-6">
        <BrandLogo priority alt="" />
        <div>
          <Link href="/dashboard" className="text-base font-extrabold tracking-tight text-kawaii-mocha">
            Loichoi Console
          </Link>
          <p className="text-[11px] font-medium text-kawaii-mocha/60">
            {isMounted ? t.common.brandSubtitle : "Cinnamoroll Edition"}
          </p>
        </div>
      </div>

      <nav
        className="no-scrollbar flex-1 space-y-1.5 overflow-y-auto p-4"
        aria-label={isMounted ? t.nav.menuTitle : "Danh mục menu"}
      >

        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-kawaii-mocha/50">
          {isMounted ? t.nav.menuTitle : "Danh mục menu"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`) &&
              !navItems.some(
                (other) =>
                  other.href !== item.href &&
                  other.href.startsWith(item.href) &&
                  (pathname === other.href || pathname.startsWith(`${other.href}/`)),
              ));

          const label = isMounted
            ? t.nav[item.key]
            : language === "en"
              ? item.fallbackEn
              : item.fallbackVi;

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 bouncy-hover",
                active
                  ? "border-2 border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-cloud"
                  : "text-kawaii-mocha/80 hover:bg-kawaii-cloud hover:text-kawaii-mocha",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl",
                  active ? "bg-card/70 shadow-sm" : "bg-kawaii-sky/20",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{label}</span>
              {active && <Sparkles className="h-4 w-4 animate-pulse text-kawaii-warmbrown" />}
            </Link>
          );

          return item.permission || item.permissions ? (
            <PermissionGate key={item.href} permission={item.permission} permissions={item.permissions}>
              {link}
            </PermissionGate>
          ) : (
            link
          );
        })}
      </nav>

      <div className="border-t-2 border-kawaii-sky/30 p-4">
        <div className="rounded-2xl border border-kawaii-blush/80 bg-kawaii-blush/30 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-kawaii-mocha">
            <Heart className="h-3.5 w-3.5 fill-kawaii-pink text-kawaii-pink" />
            <span>{isMounted ? t.nav.greetingFooter : "Chúc bạn ngày vui vẻ!"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
