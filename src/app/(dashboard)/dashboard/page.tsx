"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  Heart,
  Keyboard,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionGate } from "@/components/shared/permission-gate";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/utils";
import { DASHBOARD_ACCESS_PERMISSIONS, canAccessDashboard } from "@/lib/dashboard-access";
import { categoryService } from "@/services/category.service";
import { keyboardService } from "@/services/keyboard.service";
import { rbacService } from "@/services/rbac.service";
import { systemService } from "@/services/system.service";
import { userService } from "@/services/user.service";

function formatUptime(seconds?: number): string {
  if (!seconds || seconds <= 0) return "Uptime > 99.9%";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${Math.floor(seconds % 60)}s`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, isMounted } = useTranslation();

  const hasAccess = canAccessDashboard(user?.permissions);

  // 1. Keyboards stats query
  const keyboardsQuery = useQuery({
    queryKey: ["dashboard", "keyboards"],
    queryFn: () => keyboardService.getManagementList({ limit: 100 }),
    staleTime: 30000,
    enabled: hasAccess,
  });

  // 2. Users stats query
  const usersQuery = useQuery({
    queryKey: ["dashboard", "users"],
    queryFn: () => userService.getUsers({ limit: 100 }),
    staleTime: 30000,
    enabled: hasAccess,
  });

  // 3. Roles query
  const rolesQuery = useQuery({
    queryKey: ["dashboard", "roles"],
    queryFn: () => rbacService.getRoles(),
    staleTime: 60000,
    enabled: hasAccess,
  });

  // 4. System health & readiness query
  const healthQuery = useQuery({
    queryKey: ["dashboard", "health"],
    queryFn: () => systemService.getHealthReadiness(),
    refetchInterval: 30000,
    retry: 1,
    enabled: hasAccess,
  });

  // 5. Maintenance status query
  const maintenanceQuery = useQuery({
    queryKey: ["dashboard", "maintenance"],
    queryFn: () => systemService.getMaintenance(),
    staleTime: 30000,
    retry: 1,
    enabled: hasAccess,
  });

  // 6. Recent audit logs query
  const auditLogsQuery = useQuery({
    queryKey: ["dashboard", "audit-logs"],
    queryFn: () => systemService.getAuditLogs({ limit: 5 }),
    staleTime: 15000,
    enabled: hasAccess,
  });

  // 7. Categories summary query
  const categoriesQuery = useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: () => categoryService.getPublicList(),
    staleTime: 60000,
    enabled: hasAccess,
  });

  // Calculated Real Values
  const keyboardsList = keyboardsQuery.data?.data ?? [];
  const totalKeyboards = keyboardsQuery.data?.meta?.total ?? keyboardsList.length;
  const publishedKeyboards = keyboardsList.filter((k) => k.status === "PUBLISHED").length;
  const totalDownloads = keyboardsList.reduce((sum, item) => sum + (item.downloadCount || 0), 0);

  const usersList = usersQuery.data?.data ?? [];
  const totalUsers = usersQuery.data?.meta?.total ?? usersList.length;
  const activeUsers = usersList.filter((u) => u.isActive).length;

  const rolesList = rolesQuery.data ?? [];
  const totalRoles = rolesList.length;
  const totalPermissionsAssigned = rolesList.reduce((sum, r) => sum + (r.permissions?.length || 0), 0);

  const isDbHealthy = healthQuery.data?.checks?.database?.status === "healthy";
  const dbLatency = healthQuery.data?.checks?.database?.latencyMs;
  const uptimeSeconds = healthQuery.data?.metrics?.uptimeSeconds;
  const isMaintenanceOn = maintenanceQuery.data?.enabled ?? false;

  const recentLogs = auditLogsQuery.data?.data ?? [];
  const recentKeyboards = keyboardsList.slice(0, 4);

  return (
    <PermissionGate
      permissions={DASHBOARD_ACCESS_PERMISSIONS}
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-kawaii-sky/50 bg-card/80 p-8 text-center shadow-cloud">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-inner">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-kawaii-mocha">
            {isMounted ? t.common.errorOccurred : "Không có quyền truy cập"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-kawaii-mocha/70">
            {isMounted
              ? t.common.errorDescription
              : "Bạn không có quyền truy cập trang tổng quan quản trị."}
          </p>
        </div>
      }
    >
      <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] border-2 border-kawaii-sky/80 bg-gradient-to-r from-kawaii-cloud via-card to-kawaii-blush/40 p-6 md:p-8 shadow-cloud flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 text-xs font-bold text-kawaii-mocha border border-kawaii-sky/50 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-kawaii-warmbrown" />
            <span>{isMounted ? t.dashboard.consoleTitle : "Cinnamoroll Dashboard Console"}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-kawaii-mocha">
            {isMounted ? t.dashboard.welcome : "Xin chào"}, {user?.name || user?.email?.split("@")[0]}!
          </h1>
          <p className="text-sm md:text-base text-kawaii-mocha/75 font-medium">
            {isMounted ? t.dashboard.welcomeQuestion : "Hôm nay bạn muốn thiết kế và tùy biến bàn phím cơ nào?"}
          </p>
        </div>
        <div className="text-kawaii-babyblue animate-float">
          <Cloud className="h-16 w-16 md:h-20 md:w-20" />
        </div>
      </div>

      {/* Metric Cards / Biscuit Style */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* 1. Keyboards Managed Card */}
        <Link href="/keyboards/manage">
          <Card className="rounded-[2rem] border-2 border-kawaii-sky/60 bg-card p-6 shadow-cloud bouncy-hover cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
                  {isMounted ? t.dashboard.keyboardsManaged : "Bàn phím quản lý"}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha">
                  <Keyboard className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-kawaii-mocha">
                {keyboardsQuery.isLoading ? "..." : totalKeyboards}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-kawaii-sky/20 pt-2 text-xs font-bold text-kawaii-warmbrown">
              <span>{publishedKeyboards} {isMounted ? t.dashboard.publishedCount : "Đã xuất bản"}</span>
              <span className="text-kawaii-mocha/60">{totalDownloads} {isMounted ? t.adminKeyboards.downloads : "lượt tải"}</span>
            </div>
          </Card>
        </Link>

        {/* 2. Community Members Card */}
        <Link href="/users">
          <Card className="rounded-[2rem] border-2 border-kawaii-blush/80 bg-card p-6 shadow-blush bouncy-hover cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
                  {isMounted ? t.dashboard.communityMembers : "Thành viên hệ thống"}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-blush/60 text-kawaii-mocha">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-kawaii-mocha">
                {usersQuery.isLoading ? "..." : totalUsers}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-kawaii-blush/30 pt-2 text-xs font-bold text-kawaii-warmbrown">
              <span>{activeUsers} {isMounted ? t.dashboard.activeUsers : "Đang hoạt động"}</span>
              <span className="text-kawaii-mocha/60">{totalUsers - activeUsers} {isMounted ? t.dashboard.lockedUsers : "Đã khóa"}</span>
            </div>
          </Card>
        </Link>

        {/* 3. Roles & RBAC Card */}
        <Link href="/roles">
          <Card className="rounded-[2rem] border-2 border-kawaii-sky/60 bg-card p-6 shadow-cloud bouncy-hover cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
                  {isMounted ? t.dashboard.rolesConfigured : "Vai trò & Phân quyền"}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-kawaii-mocha">
                {rolesQuery.isLoading ? "..." : `${totalRoles} Roles`}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-kawaii-sky/20 pt-2 text-xs font-bold text-kawaii-warmbrown">
              <span>{totalPermissionsAssigned} {isMounted ? t.dashboard.totalPermissions : "Quyền hạn"}</span>
              <span className="text-emerald-600 font-bold">{isMounted ? t.dashboard.rolesActive : "Dynamic RBAC"}</span>
            </div>
          </Card>
        </Link>

        {/* 4. System Health Card */}
        <Link href="/settings/system">
          <Card className="rounded-[2rem] border-2 border-kawaii-blush/80 bg-card p-6 shadow-blush bouncy-hover cursor-pointer h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
                  {isMounted ? t.dashboard.systemHealth : "Trạng thái hệ thống"}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-blush/60 text-kawaii-mocha">
                  <Heart className={`h-5 w-5 ${isMaintenanceOn ? "text-amber-500 fill-amber-500" : "fill-kawaii-pink text-kawaii-pink"}`} />
                </div>
              </div>
              <div className="text-2xl font-black text-kawaii-mocha truncate">
                {isMaintenanceOn
                  ? (isMounted ? t.dashboard.systemStatusMaintenance : "Đang bảo trì")
                  : (isMounted ? t.dashboard.systemStatusOnline : "Trực tuyến êm ái")}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-kawaii-blush/30 pt-2 text-xs font-bold">
              <span className={isDbHealthy ? "text-emerald-600" : "text-destructive"}>
                {isDbHealthy ? `DB: ${dbLatency ? `${dbLatency}ms` : "OK"}` : "DB Offline"}
              </span>
              <span className="text-kawaii-mocha/60 font-medium">
                {formatUptime(uptimeSeconds)}
              </span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main Content Grid: Live Audit Feed + Latest Keyboard Themes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Card: Real Recent Activity (Audit Logs) */}
        <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/60 shadow-cloud">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
                  <Activity className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg font-black text-kawaii-mocha">
                  {isMounted ? t.dashboard.recentActivity : "Hoạt động gần đây"}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                {isMounted ? t.dashboard.recentActivityDesc : "Nhật ký kiểm toán và thay đổi dữ liệu thời gian thực"}
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-kawaii-mocha hover:bg-kawaii-sky/30">
              <Link href="/audit-logs">
                {isMounted ? t.dashboard.viewAllAuditLogs : "Xem tất cả"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-sm">
            {auditLogsQuery.isLoading ? (
              <div className="py-8 text-center text-xs text-kawaii-mocha/60">
                {isMounted ? t.adminUi.loadingData : "Đang tải dữ liệu..."}
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-kawaii-mocha/60">
                {isMounted ? t.dashboard.noRecentActivity : "Chưa có sự kiện kiểm toán nào gần đây"}
              </div>
            ) : (
              recentLogs.map((log) => {
                const targetText = log.targetLabel || log.targetEmail || log.targetUser?.fullName || log.targetId || log.targetType;
                const actorText = log.actor?.fullName || log.actor?.username || log.actor?.email || log.actorEmail || "Hệ thống";
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl border border-kawaii-sky/30 bg-kawaii-cloud/30 p-3 transition-colors hover:bg-kawaii-cloud/60"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">
                          {log.action}
                        </Badge>
                        <span className="font-bold text-kawaii-mocha text-xs truncate">
                          {targetText}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-kawaii-mocha/60 truncate">
                        {actorText} · {log.targetType}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-kawaii-mocha/50 shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Right Card: Latest Keyboard Themes */}
        <Card className="rounded-[2.25rem] border-2 border-kawaii-blush/60 shadow-blush">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-blush/40 text-kawaii-mocha">
                  <Keyboard className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg font-black text-kawaii-mocha">
                  {isMounted ? t.dashboard.recentKeyboards : "Theme bàn phím mới cập nhật"}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                {isMounted ? t.dashboard.recentKeyboardsDesc : "Danh sách theme được cập nhật gần nhất"}
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-kawaii-mocha hover:bg-kawaii-blush/40">
              <Link href="/keyboards/manage">
                {isMounted ? t.dashboard.viewAllKeyboards : "Xem tất cả"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-sm">
            {keyboardsQuery.isLoading ? (
              <div className="py-8 text-center text-xs text-kawaii-mocha/60">
                {isMounted ? t.adminUi.loadingData : "Đang tải dữ liệu..."}
              </div>
            ) : recentKeyboards.length === 0 ? (
              <div className="py-8 text-center text-xs text-kawaii-mocha/60">
                {isMounted ? t.dashboard.noRecentKeyboards : "Chưa có theme nào được tạo"}
              </div>
            ) : (
              recentKeyboards.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between rounded-2xl border border-kawaii-blush/30 bg-kawaii-cloud/30 p-3 transition-colors hover:bg-kawaii-cloud/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-kawaii-sky/30 border border-kawaii-sky/50 flex items-center justify-center text-kawaii-mocha font-bold text-xs shrink-0 overflow-hidden">
                      {theme.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={theme.coverUrl} alt={theme.name} className="h-full w-full object-cover" />
                      ) : (
                        <Keyboard className="h-5 w-5 text-kawaii-mocha/70" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-kawaii-mocha text-xs truncate">{theme.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-kawaii-mocha/60">
                        <span className="font-mono text-[10px] text-kawaii-mocha/50 truncate">/{theme.slug}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold">
                          {theme.platform}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={theme.status === "PUBLISHED" ? "default" : "secondary"} className="text-[10px]">
                      {theme.status === "PUBLISHED"
                        ? (isMounted ? t.adminKeyboards.statusPublished : "Đã xuất bản")
                        : (isMounted ? t.adminKeyboards.statusDraft : "Bản nháp")}
                    </Badge>
                    <p className="mt-1 text-[10px] font-bold text-kawaii-warmbrown">
                      {theme.downloadCount || 0} {isMounted ? t.adminKeyboards.downloads : "lượt tải"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Infrastructure Overview & Discord Gateway */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Infrastructure & Catalog Counters */}
        <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/50 shadow-cloud">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
                <Database className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-black text-kawaii-mocha">
                {isMounted ? t.dashboard.infrastructureOverview : "Tổng quan hạ tầng"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {isMounted ? t.adminSettings.systemDesc : "Điều khiển và giám sát các module hệ thống"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link href="/categories/manage">
              <div className="rounded-2xl border border-kawaii-sky/40 bg-kawaii-cloud/40 p-3 text-center transition-all hover:scale-105 hover:bg-kawaii-cloud">
                <Layers className="mx-auto h-5 w-5 text-kawaii-mocha/70" />
                <div className="mt-1 text-lg font-black text-kawaii-mocha">
                  {categoriesQuery.data?.length ?? "—"}
                </div>
                <p className="text-[11px] font-bold text-kawaii-mocha/60">
                  {isMounted ? t.dashboard.categoriesCount : "Danh mục"}
                </p>
              </div>
            </Link>


            <Link href="/audit-logs">
              <div className="rounded-2xl border border-kawaii-sky/40 bg-kawaii-cloud/40 p-3 text-center transition-all hover:scale-105 hover:bg-kawaii-cloud">
                <Activity className="mx-auto h-5 w-5 text-kawaii-mocha/70" />
                <div className="mt-1 text-lg font-black text-kawaii-mocha">
                  {auditLogsQuery.data?.meta?.total ?? "—"}
                </div>
                <p className="text-[11px] font-bold text-kawaii-mocha/60">
                  {isMounted ? t.dashboard.totalAuditLogs : "Tổng nhật ký"}
                </p>
              </div>
            </Link>

            <Link href="/keyboards/manage">
              <div className="rounded-2xl border border-kawaii-blush/40 bg-kawaii-cloud/40 p-3 text-center transition-all hover:scale-105 hover:bg-kawaii-cloud">
                <Keyboard className="mx-auto h-5 w-5 text-kawaii-warmbrown" />
                <div className="mt-1 text-lg font-black text-kawaii-mocha">
                  {totalKeyboards}
                </div>
                <p className="text-[11px] font-bold text-kawaii-mocha/60">
                  {isMounted ? t.dashboard.totalKeyboards : "Tổng theme"}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Right: Discord Integration & OAuth Gateway */}
        <Card className="rounded-[2.25rem] border-2 border-kawaii-sky/50 shadow-cloud">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#5865F2]">
                <MessageSquare className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-black text-kawaii-mocha">
                {isMounted ? t.dashboard.discordGateway : "Cổng kết nối Discord"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {isMounted ? t.dashboard.discordGatewayDesc : "Trạng thái liên kết tài khoản và đồng bộ vai trò"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-3xl border-2 border-kawaii-sky/60 bg-kawaii-cloud/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${user?.discordId ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                  <span className="font-bold text-xs text-kawaii-mocha">
                    {user?.discordId
                      ? (isMounted ? t.dashboard.discordConnected : "Tài khoản đã liên kết Discord")
                      : (isMounted ? t.dashboard.discordNotConnected : "Chưa liên kết tài khoản Discord")}
                  </span>
                </div>
                {user?.discordId && (
                  <Badge variant="default" className="text-[10px]">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Synced
                  </Badge>
                )}
              </div>
              <p className="text-xs text-kawaii-mocha/70 leading-relaxed font-medium">
                {isMounted ? t.dashboard.discordDesc : "Tự động đồng bộ quyền hạn người dùng theo cấp bậc thành viên máy chủ Discord để truy cập các tính năng bàn phím đặc quyền."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </PermissionGate>
  );
}

