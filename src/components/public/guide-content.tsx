"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Apple,
  Smartphone,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  WandSparkles,
  Heart,
  MessageCircle,
  AlertCircle,
  KeyRound,
  LogIn,
  Layers,
  Search,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  Lightbulb,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

type GuideTab = "main" | "extra" | "fastpass" | "faq";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/DVu3TTv3";
const discordReqChannelUrl = "https://discord.com/channels/1258948257606930546/1262966680082976828";
const discordFaqChannelUrl = "https://discord.com/channels/1258948257606930546/1391254364693332070";
const tiktokUrl = "https://www.tiktok.com/@roianroi";
const baiduRegisterUrl = "https://passport.baidu.com/v2/?reg&u=https%3A%2F%2Flogin.baidu.com%2F&tpl=bceplat&overseas=1";
const baiduCheckLoginUrl = "https://passport.baidu.com/";
const baiduKeyboardAndroid = "https://play.google.com/store/apps/details?id=com.baidu.input&pcampaignid=web_share";
const baiduKeyboardIos = "https://apps.apple.com/app/%E7%99%BE%E5%BA%A6%E8%BE%93%E5%85%A5%E6%B3%95-%E8%AF%AD%E9%9F%B3%E8%A1%A8%E6%83%85%E6%96%97%E5%9B%BE%E8%BE%93%E5%85%A5%E6%B3%95/id916139408";
const baiduPanAndroid = "https://pan.baidu.com/disk/cert/download?from=certhome";
const baiduPanIos = "https://apps.apple.com/app/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98/id547166701";
const rednoteAndroid = "https://play.google.com/store/apps/details?id=com.xingin.xhs&pcampaignid=web_share";
const rednoteIos = "https://apps.apple.com/app/rednote/id741292507";
const wechatAndroid = "https://play.google.com/store/apps/details?id=com.tencent.mm&pcampaignid=web_share";
const wechatIos = "https://apps.apple.com/app/wechat/id414478124";

export function GuideContent() {
  const { t, language, isMounted } = useTranslation();
  const publicText = getPublicCopy(language);
  const [activeTab, setActiveTab] = useState<GuideTab>("main");
  const [copiedKeyword, setCopiedKeyword] = useState(false);

  const tabs: Array<{ id: GuideTab; label: string; icon: React.ElementType }> = [
    { id: "main", label: isMounted ? t.guide.tabMainSteps : "4 Bước Cài Đặt", icon: Layers },
    { id: "extra", label: isMounted ? t.guide.tabExtraTools : "Nguồn Tìm Theme Phụ", icon: Search },
    { id: "fastpass", label: isMounted ? t.guide.tabFastPass : "Yêu Cầu Theme Nhanh", icon: Zap },
    { id: "faq", label: isMounted ? t.guide.tabFaq : "Câu Hỏi Thường Gặp", icon: HelpCircle },
  ];

  const handleCopyKeyword = () => {
    navigator.clipboard.writeText("面肥");
    setCopiedKeyword(true);
    setTimeout(() => setCopiedKeyword(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-kawaii-sky/50 bg-gradient-to-br from-card via-kawaii-cloud/50 to-kawaii-sky/20 p-8 md:p-12 shadow-cloud text-center">
        <div className="pointer-events-none absolute -left-6 -top-6 h-36 w-36 rounded-full bg-kawaii-babyblue/20 blur-2xl" />
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-kawaii-pink/20 blur-2xl" />

        <div className="relative mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-kawaii-sky/60 bg-card/90 px-4 py-1.5 text-xs font-black text-kawaii-babyblue shadow-xs">
            <WandSparkles className="h-3.5 w-3.5 text-kawaii-babyblue" />
            <span>{isMounted ? t.guide.badge : publicText.guide.eyebrow}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha sm:text-4xl md:text-5xl font-display">
            {isMounted ? t.guide.title : publicText.guide.title}
          </h1>

          <p className="text-sm font-medium leading-relaxed text-kawaii-mocha/70 sm:text-base">
            {isMounted ? t.guide.description : publicText.guide.description}
          </p>
        </div>
      </section>

      {/* ─── Greeting from Roi Card ─── */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-kawaii-blush/60 bg-gradient-to-r from-kawaii-pink/15 via-kawaii-cloud/40 to-kawaii-sky/20 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card border-2 border-kawaii-blush/60 text-kawaii-pink shadow-xs">
            <Heart className="h-6 w-6 fill-kawaii-pink/20 text-kawaii-pink" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-kawaii-pink/20 text-kawaii-mocha border border-kawaii-pink/30">
                {isMounted ? t.guide.authorGreeting : "Lời chào từ Roi"}
              </span>
              <span className="text-xs font-bold text-kawaii-mocha/50">@roianroi · Admin</span>
            </div>
            <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/80">
              {isMounted ? t.guide.authorIntro : "Hi hi~ là Roi đây! Cùng làm bàn phím của bạn siêu đáng yêu nhé!..."}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Tabs Navigation ─── */}
      <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all bouncy-hover ${
                isActive
                  ? "bg-kawaii-babyblue text-white shadow-md shadow-kawaii-babyblue/30 scale-105"
                  : "border-2 border-kawaii-sky/30 bg-card/80 text-kawaii-mocha/70 hover:border-kawaii-sky/60 hover:text-kawaii-mocha hover:bg-card"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* ═══════════════════════════════════════════
              TAB 1: 4 CORE STEPS
             ═══════════════════════════════════════════ */}
          {activeTab === "main" && (
            <div className="space-y-6">
              {/* Important Device Notice */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">
                    {isMounted ? t.guide.stepNoticeLabel : "Lưu ý quan trọng"}
                  </p>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    {isMounted ? t.guide.stepDeviceWarning : "Điện thoại Huawei, Xiaomi, Oppo, Vivo hay các thiết bị có engine theme bàn phím riêng của hãng thì không dùng được Baidu nhé."}
                  </p>
                </div>
              </div>

              {/* Step 1: Install Baidu Keyboard */}
              <div className="rounded-3xl border-2 border-kawaii-sky/40 bg-card/90 p-6 md:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-babyblue text-white text-xs font-black shadow-xs">
                      1
                    </span>
                    <h3 className="text-base md:text-lg font-black text-kawaii-mocha">
                      {isMounted ? t.guide.step1Title : "Cài đặt 百度输入法 (Baidu Keyboard)"}
                    </h3>
                  </div>
                  <Smartphone className="h-5 w-5 text-kawaii-babyblue shrink-0" />
                </div>

                <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.step1Desc : "Đây là app 'phép màu' giúp bạn sử dụng mấy bàn phím siêu cute luôn. Nếu không có app này thì mấy theme sẽ không hiện đâu á!"}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button asChild size="sm" className="rounded-full gap-1.5 shadow-xs bouncy-hover">
                    <a href={baiduKeyboardAndroid} target="_blank" rel="noreferrer">
                      <Smartphone className="h-4 w-4" />
                      <span>{isMounted ? t.guide.step1GooglePlay : "Tải trên Google Play"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 border-kawaii-sky/60 hover:bg-kawaii-cloud bouncy-hover text-kawaii-mocha">
                    <a href={baiduKeyboardIos} target="_blank" rel="noreferrer">
                      <Apple className="h-4 w-4" />
                      <span>{isMounted ? t.guide.step1AppStore : "Tải trên App Store"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Step 2: Register Baidu Account */}
              <div className="rounded-3xl border-2 border-kawaii-sky/40 bg-card/90 p-6 md:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-babyblue text-white text-xs font-black shadow-xs">
                      2
                    </span>
                    <h3 className="text-base md:text-lg font-black text-kawaii-mocha">
                      {isMounted ? t.guide.step2Title : "Tạo tài khoản 百度 (Baidu Account)"}
                    </h3>
                  </div>
                  <KeyRound className="h-5 w-5 text-kawaii-babyblue shrink-0" />
                </div>

                <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.step2Desc : "Vì đây là app Trung Quốc 百度 nên bạn cần đăng ký qua link đặc biệt này để dùng số điện thoại nước ngoài. Đừng lo, rất dễ nha!"}
                </p>

                <div className="p-4 rounded-2xl bg-kawaii-cloud/50 border border-kawaii-sky/30 space-y-2.5">
                  <p className="text-xs font-bold text-kawaii-mocha">
                    {language === "vi" ? "Các bước đăng ký nhanh:" : "Quick registration steps:"}
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-kawaii-mocha/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isMounted ? t.guide.step2Substep1 : "Số điện thoại: Đổi mã vùng sang +84 và bỏ số 0 ở đầu"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isMounted ? t.guide.step2Substep2 : "Tên đăng nhập: Chọn tên tài khoản của bạn"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isMounted ? t.guide.step2Substep3 : "Mật khẩu: Thiết lập mật khẩu bảo mật"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isMounted ? t.guide.step2Substep4 : "Mã xác nhận: Nhấn nút 'Nhận mã xác nhận' trước, sau đó nhập mã gửi về SMS"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isMounted ? t.guide.step2Substep5 : "Đăng ký: Tick vào ô 'Đồng ý điều khoản' trước rồi nhấn 'Đăng ký'"}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button asChild size="sm" className="rounded-full gap-1.5 shadow-xs bouncy-hover">
                    <a href={baiduRegisterUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span>{isMounted ? t.guide.step2SpecialLink : "Mở link đăng ký quốc tế"}</span>
                    </a>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 border-kawaii-sky/60 hover:bg-kawaii-cloud bouncy-hover text-kawaii-mocha">
                    <a href={baiduCheckLoginUrl} target="_blank" rel="noreferrer">
                      <span>{isMounted ? t.guide.step2CheckLoginLink : "Link kiểm tra đăng nhập"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>

                <p className="text-[11px] font-medium text-kawaii-mocha/60 italic">
                  {isMounted ? t.guide.step2ErrorNote : "Đôi khi sau khi đăng ký xong nó sẽ hiện trang lỗi, đừng hoang mang nha! Đó là bình thường á."}
                </p>
              </div>

              {/* Step 3: Login to Baidu Keyboard App */}
              <div className="rounded-3xl border-2 border-kawaii-sky/40 bg-card/90 p-6 md:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-babyblue text-white text-xs font-black shadow-xs">
                      3
                    </span>
                    <h3 className="text-base md:text-lg font-black text-kawaii-mocha">
                      {isMounted ? t.guide.step3Title : "Đăng nhập vào 百度输入法"}
                    </h3>
                  </div>
                  <LogIn className="h-5 w-5 text-kawaii-babyblue shrink-0" />
                </div>

                <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.step3Desc : "Đăng nhập tài khoản bạn vừa tạo vào ứng dụng Baidu Keyboard trên điện thoại."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">1.</span>
                    {isMounted ? t.guide.step3Substep1 : "Ở trang chủ, nhấn vào biểu tượng hồ sơ nhỏ ở góc dưới bên phải"}
                  </div>
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">2.</span>
                    {isMounted ? t.guide.step3Substep2 : "Nhấn nút màu xanh lá để chuyển sang trang đăng nhập"}
                  </div>
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">3.</span>
                    {isMounted ? t.guide.step3Substep3 : "Nhấn vào dấu ba chấm (...) để chuyển sang đăng nhập bằng tên người dùng"}
                  </div>
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">4.</span>
                    {isMounted ? t.guide.step3Substep4 : "Nhập tên người dùng của bạn vào"}
                  </div>
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">5.</span>
                    {isMounted ? t.guide.step3Substep5 : "Nhớ tick vào ô tròn nhỏ phía dưới trước nhé"}
                  </div>
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">6.</span>
                    {isMounted ? t.guide.step3Substep6 : "Nhấn nút màu xanh dương để tiếp tục"}
                  </div>
                  <div className="p-3 rounded-2xl bg-kawaii-cloud/40 border border-kawaii-sky/30 text-xs font-medium text-kawaii-mocha/80 sm:col-span-2">
                    <span className="font-bold text-kawaii-babyblue mr-1.5">7.</span>
                    {isMounted ? t.guide.step3Substep7 : "Nhập mật khẩu và nhấn đăng nhập là xong"}
                  </div>
                </div>
              </div>

              {/* Step 4: Install and Apply Theme */}
              <div className="rounded-3xl border-2 border-kawaii-sky/40 bg-card/90 p-6 md:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-babyblue text-white text-xs font-black shadow-xs">
                      4
                    </span>
                    <h3 className="text-base md:text-lg font-black text-kawaii-mocha">
                      {isMounted ? t.guide.step4Title : "Cài bàn phím vào 百度输入法"}
                    </h3>
                  </div>
                  <Sparkles className="h-5 w-5 text-kawaii-babyblue shrink-0" />
                </div>

                <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.step4Desc : "Sau khi bạn đã tải bàn phím mà mình thích (dù là từ file Roi chuẩn bị sẵn hay bạn tự tải), chỉ cần mở file đó bằng 百度输入法 là được."}
                </p>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 text-xs font-semibold flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isMounted ? t.guide.step4ThemeChangeTip : "Bạn cũng có thể đổi giao diện bất cứ lúc nào bằng cách nhấn vào biểu tượng hồ sơ -> biểu tượng áo thun. Vậy là bàn phím của bạn đã siêu dễ thương rồi!"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 2: EXTRA TOOLS & CHINESE SOURCES
             ═══════════════════════════════════════════ */}
          {activeTab === "extra" && (
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-kawaii-sky/40 bg-card/85 p-6 shadow-sm">
                <h2 className="text-xl font-black tracking-tight text-kawaii-mocha md:text-2xl">
                  {isMounted ? t.guide.extraToolsTitle : "Các Ứng Dụng Hỗ Trợ Tìm Theme Phụ"}
                </h2>
                <p className="mt-1 text-sm font-medium text-kawaii-mocha/65">
                  {isMounted ? t.guide.extraToolsDesc : "Không bắt buộc nhưng nên có nếu bạn muốn tự mình khám phá thêm nhiều kho theme cute hơn nữa."}
                </p>
              </div>

              {/* Baidu Netdisk */}
              <div className="rounded-3xl border-2 border-kawaii-sky/30 bg-card/80 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-kawaii-mocha flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-kawaii-babyblue" />
                    {isMounted ? t.guide.baiduPanTitle : "百度网盘 (Baidu Netdisk)"}
                  </h3>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1 border-kawaii-sky/50 text-kawaii-mocha">
                      <a href={baiduPanAndroid} target="_blank" rel="noreferrer">
                        Android <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1 border-kawaii-sky/50 text-kawaii-mocha">
                      <a href={baiduPanIos} target="_blank" rel="noreferrer">
                        iOS <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <p className="text-xs font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.baiduPanDesc : "Ứng dụng có chức năng giống như Google Drive. Vì nhiều người ở Trung Quốc dùng app này để chia sẻ file thay vì Google Drive, nên để tải bàn phím họ share thì cần có ứng dụng này."}
                </p>

                <div className="p-4 rounded-2xl bg-kawaii-cloud/50 border border-kawaii-sky/30 space-y-2">
                  <p className="text-xs font-bold text-kawaii-mocha">
                    {isMounted ? t.guide.baiduPanDownloadGuideTitle : "Cách tải file từ Baidu Netdisk:"}
                  </p>
                  <ol className="space-y-1.5 text-xs font-medium text-kawaii-mocha/80 list-decimal list-inside">
                    <li>{isMounted ? t.guide.baiduPanStep1 : "Sau khi có link, copy link rồi mở app 百度网盘"}</li>
                    <li>{isMounted ? t.guide.baiduPanStep2 : "Nhấn 'Cho phép dán' để app tự động nạp link"}</li>
                    <li>{isMounted ? t.guide.baiduPanStep3 : "Nhấn vào thư mục - chọn file đuôi .bds nếu dùng Android hoặc .bdi nếu dùng iOS"}</li>
                    <li>{isMounted ? t.guide.baiduPanStep4 : "Nhấn nút tải xuống ở góc dưới bên trái"}</li>
                    <li>{isMounted ? t.guide.baiduPanStep5 : "Quay lại trang chính của app, nhấn vào biểu tượng bên cạnh nút dấu cộng ở góc phải trên để kiểm tra file vừa tải"}</li>
                  </ol>
                </div>
              </div>

              {/* Rednote */}
              <div className="rounded-3xl border-2 border-kawaii-sky/30 bg-card/80 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-kawaii-mocha flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-kawaii-pink" />
                    {isMounted ? t.guide.rednoteTitle : "Rednote"}
                  </h3>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1 border-kawaii-sky/50 text-kawaii-mocha">
                      <a href={rednoteAndroid} target="_blank" rel="noreferrer">
                        Android <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1 border-kawaii-sky/50 text-kawaii-mocha">
                      <a href={rednoteIos} target="_blank" rel="noreferrer">
                        iOS <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <p className="text-xs font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.rednoteDesc : "Nhiều creator chia sẻ bàn phím miễn phí trên app này..."}
                </p>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-kawaii-cloud/50 border border-kawaii-sky/30">
                  <span className="text-xs font-bold text-kawaii-mocha">
                    {language === "vi" ? "Từ khóa tìm kiếm gợi ý:" : "Suggested search keyword:"}
                  </span>
                  <code className="px-3 py-1 rounded-xl bg-card border border-kawaii-sky/40 font-mono font-bold text-xs text-kawaii-babyblue">
                    面肥
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyKeyword}
                    className="h-8 rounded-xl text-xs gap-1 text-kawaii-mocha hover:bg-kawaii-sky/30 ml-auto"
                  >
                    {copiedKeyword ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKeyword ? (language === "vi" ? "Đã chép!" : "Copied!") : (language === "vi" ? "Chép từ khóa" : "Copy keyword")}</span>
                  </Button>
                </div>
              </div>

              {/* WeChat */}
              <div className="rounded-3xl border-2 border-kawaii-sky/30 bg-card/80 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-kawaii-mocha flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {isMounted ? t.guide.wechatTitle : "WeChat"}
                  </h3>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1 border-kawaii-sky/50 text-kawaii-mocha">
                      <a href={wechatAndroid} target="_blank" rel="noreferrer">
                        Android <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1 border-kawaii-sky/50 text-kawaii-mocha">
                      <a href={wechatIos} target="_blank" rel="noreferrer">
                        iOS <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <p className="text-xs font-medium leading-relaxed text-kawaii-mocha/70">
                  {isMounted ? t.guide.wechatDesc : "Dùng chức năng tìm kiếm với từ khóa '面肥' hoặc tên bàn phím. Nếu không hiểu tiếng Trung có thể bật dịch ở phía trên màn hình..."}
                </p>

                {/* <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#5865F2] shrink-0" />
                  <span>
                    {isMounted ? t.guide.wechatQrSupport : "Bạn nào cần quét mã QR WeChat thì tag Roi trong kênh #tiếng-việt trên Discord nha!"}
                  </span>
                </div> */}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 3: FAST PASS & COMMUNITY REQUESTS
             ═══════════════════════════════════════════ */}
          {activeTab === "fastpass" && (
            <div className="space-y-6">
              {/* Fast Pass Hero Card */}
              <div className="rounded-3xl border-2 border-kawaii-sky/50 bg-gradient-to-br from-card via-kawaii-sky/15 to-kawaii-cloud/60 p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-kawaii-babyblue text-white flex items-center justify-center shadow-xs">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-kawaii-mocha">
                      {isMounted ? t.guide.fastPassTitle : "Bỏ Qua Các Bước Dài Dòng"}
                    </h3>
                    <p className="text-xs font-medium text-kawaii-mocha/60">
                      {language === "vi" ? "Yêu cầu theme đóng gói sẵn" : "Request pre-packaged themes"}
                    </p>
                  </div>
                </div>

                <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/80">
                  {isMounted ? t.guide.fastPassDesc : "Nếu bạn muốn bỏ qua mấy bước dài dòng, có thể yêu cầu Roi lấy theme riêng cho bạn tại kênh #╰꒰req꒱🥖yêu・cầu trên Discord bằng cách tạo một bài viết mới nha."}
                </p>

                <Button asChild size="lg" className="rounded-full gap-2 shadow-cloud bouncy-hover">
                  <a href={discordReqChannelUrl} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4 text-[#5865F2]" />
                    <span>{isMounted ? t.guide.fastPassCtaBtn : "Gửi yêu cầu theme trên Discord"}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              {/* Support Roi on TikTok */}
              <div className="rounded-3xl border-2 border-kawaii-blush/60 bg-card p-6 md:p-7 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-kawaii-pink/20 text-kawaii-pink flex items-center justify-center shadow-xs">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-kawaii-mocha">
                        {isMounted ? t.guide.supportCreatorTitle : "Ủng hộ Roi trên TikTok"}
                      </h4>
                      <p className="text-xs text-kawaii-mocha/50 font-medium">@roianroi</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm font-medium text-kawaii-mocha/70 leading-relaxed">
                  {isMounted ? t.guide.supportCreatorDesc : "Đừng quên ghé ủng hộ Roi trên TikTok để xem thêm nhiều video hướng dẫn bàn phím cute lấp lánh nữa nhé!"}
                </p>

                <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 border-kawaii-blush hover:bg-kawaii-blush/20 text-kawaii-mocha bouncy-hover">
                  <a href={tiktokUrl} target="_blank" rel="noreferrer">
                    <span>{isMounted ? t.guide.supportCreatorBtn : "Ghé kênh TikTok @hananroi"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 4: FAQ (DISCORD CHANNEL LINK)
             ═══════════════════════════════════════════ */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-kawaii-sky/50 bg-gradient-to-br from-card via-kawaii-cloud/50 to-kawaii-sky/20 p-8 md:p-10 shadow-sm text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-card border-2 border-kawaii-sky/50 text-kawaii-babyblue shadow-cloud">
                  <HelpCircle className="h-8 w-8 text-kawaii-babyblue" />
                </div>

                <div className="mx-auto max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kawaii-sky/30 border border-kawaii-sky/40 text-xs font-black text-kawaii-babyblue">
                    <span>{isMounted ? t.guide.faqChannelHint : "Kênh Discord: [FAQ] Đọc Trước Khi Hỏi"}</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-kawaii-mocha md:text-3xl font-display">
                    {isMounted ? t.guide.faqTitle : "Câu Hỏi Thường Gặp (FAQ)"}
                  </h2>
                  <p className="text-xs md:text-sm font-medium leading-relaxed text-kawaii-mocha/75">
                    {isMounted ? t.guide.faqDesc : "Toàn bộ giải đáp thắc mắc và câu hỏi thường gặp được tổng hợp và cập nhật liên tục tại kênh [FAQ] Đọc Trước Khi Hỏi trên máy chủ Discord của chúng mình."}
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <Button asChild size="lg" className="rounded-full gap-2 shadow-cloud bouncy-hover">
                    <a href={discordFaqChannelUrl} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4 text-[#5865F2]" />
                      <span>{isMounted ? t.guide.faqDiscordCta : "Mở kênh FAQ trên Discord"}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Pro Tip Banner ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-kawaii-sky/30 via-kawaii-cloud/60 to-kawaii-pink/20 border-2 border-kawaii-sky/40 shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-kawaii-babyblue shadow-xs">
          <Lightbulb className="h-6 w-6 text-amber-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-kawaii-mocha">
            {isMounted ? t.guide.quickTipTitle : "Mẹo nhỏ bồng bềnh"}
          </h4>
          <p className="text-xs font-medium text-kawaii-mocha/70 mt-0.5 leading-relaxed">
            {isMounted ? t.guide.quickTipDesc : "Nghe thì có vẻ hơi nhiều bước, nhưng thật ra quen tay rồi thì siêu dễ luôn! Bạn sẽ muốn sưu tầm thêm cả đống theme mỗi ngày cho mà xem~"}
          </p>
        </div>
      </div>

      {/* ─── Quick Call to Action ─── */}
      <section className="rounded-[2.5rem] border-2 border-kawaii-sky/50 bg-card p-8 md:p-10 shadow-cloud text-center space-y-5">
        <div className="mx-auto max-w-xl space-y-2">
          <h2 className="text-2xl font-black text-kawaii-mocha md:text-3xl font-display">
            {isMounted ? t.guide.ctaTitle : "Sẵn sàng làm mới bàn phím của bạn?"}
          </h2>
          <p className="text-xs font-medium text-kawaii-mocha/70 md:text-sm">
            {isMounted ? t.guide.ctaDesc : "Khám phá hàng trăm bộ theme bàn phím cute kawaii được tổng hợp và đóng gói sẵn trên Loichoi."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full gap-2 shadow-cloud bouncy-hover">
            <Link href="/keyboards">
              <Compass className="h-4 w-4" />
              <span>{isMounted ? t.guide.ctaExploreBtn : "Khám phá ngay"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-full gap-2 border-2 border-kawaii-sky/50 hover:bg-kawaii-cloud bouncy-hover text-kawaii-mocha">
            <a href={discordUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4 text-[#5865F2]" />
              <span>{isMounted ? t.guide.ctaDiscordBtn : "Tham gia Discord"}</span>
              <ExternalLink className="h-3.5 w-3.5 text-kawaii-mocha/40" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
