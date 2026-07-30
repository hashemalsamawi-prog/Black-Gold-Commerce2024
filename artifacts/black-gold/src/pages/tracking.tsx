import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Truck, CheckCircle2, Clock, Phone, Search, ChevronRight } from "lucide-react";
import { Link } from "wouter";

/* ── Simulated order data generator ── */
function generateOrder(phone: string) {
  const seed = phone.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const statuses = ["confirmed", "verified", "dispatched", "delivered"] as const;
  const statusIdx = seed % 4;
  const status = statuses[statusIdx];

  const names = [
    { ar: "محمد علي الحداد", en: "Mohammed Ali Al-Haddad" },
    { ar: "أحمد سالم الزبيدي", en: "Ahmed Salem Al-Zubaidi" },
    { ar: "خالد عبدالله المحمدي", en: "Khaled Abdullah Al-Mohammadi" },
    { ar: "عمر فيصل القحطاني", en: "Omar Faisal Al-Qahtani" },
  ];
  const cities = [
    { ar: "صنعاء — حي السبعين", en: "Sana'a — Al-Sabaeen District" },
    { ar: "عدن — كريتر", en: "Aden — Crater" },
    { ar: "تعز — المدينة", en: "Taiz — City Center" },
    { ar: "الحديدة — المنطقة الحرة", en: "Hodeidah — Free Zone" },
  ];
  const delegates = [
    { ar: "يوسف الأحمدي", en: "Youssef Al-Ahmadi", phone: "+967 77 123 4567" },
    { ar: "نادر الشامي", en: "Nader Al-Shami", phone: "+967 71 987 6543" },
    { ar: "وليد المريسي", en: "Walid Al-Muraisi", phone: "+967 73 456 7890" },
  ];

  const name = names[seed % names.length];
  const city = cities[seed % cities.length];
  const delegate = delegates[seed % delegates.length];
  const orderId = `BG-${2025 + (seed % 2)}-${String(10000 + (seed % 89999)).padStart(5, "0")}`;
  const orderDate = new Date(2025, (seed % 12), 1 + (seed % 28));
  const products = [
    { ar: "فحم الذهب الأسود — 250غ × 3", en: "Black Gold Charcoal — 250g × 3" },
    { ar: "فحم الذهب الأسود — 400غ × 2", en: "Black Gold Charcoal — 400g × 2" },
    { ar: "مجموعة فاخرة — طقم شيشة", en: "Luxury Set — Shisha Kit" },
  ];
  const product = products[seed % products.length];
  const total = 450 + (seed % 800);

  return { status, statusIdx, name, city, delegate, orderId, orderDate, product, total };
}

const STEPS = [
  {
    key: "confirmed",
    icon: Package,
    ar: "تم استلام الطلب",
    en: "Order Confirmed",
    descAr: "تم تسجيل طلبك بنجاح وجاري المراجعة",
    descEn: "Your order has been registered and is under review",
  },
  {
    key: "verified",
    icon: CheckCircle2,
    ar: "تحقق الدفع",
    en: "Payment Verified",
    descAr: "تم التحقق من الدفع وإدراج الطلب في قائمة التوصيل",
    descEn: "Payment confirmed and order queued for dispatch",
  },
  {
    key: "dispatched",
    icon: Truck,
    ar: "في عهدة المندوب",
    en: "With Field Delegate",
    descAr: "الطلب في طريقه إليك مع المندوب الميداني",
    descEn: "Your order is on its way with our field delegate",
  },
  {
    key: "delivered",
    icon: MapPin,
    ar: "تم التسليم",
    en: "Delivered",
    descAr: "تم تسليم الطلب بنجاح",
    descEn: "Order successfully delivered",
  },
];

export default function Tracking() {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [order, setOrder] = useState<ReturnType<typeof generateOrder> | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) { setError(true); return; }
    setError(false);
    setSearching(true);
    setTimeout(() => {
      setOrder(generateOrder(digits));
      setSearching(false);
    }, 1400);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ar-YE", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 max-w-screen-lg py-12 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-3">
            {t("الذهب الأسود", "Black Gold")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-4">
            {t("تتبع طلبك", "Track Your Order")}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t(
              "أدخل رقم هاتفك المسجل لاستعراض حالة طلبك الأخير",
              "Enter your registered phone number to view your latest order status"
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-lg py-16">
        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto mb-16"
        >
          <div
            className="bg-card border border-border p-8"
            style={{ boxShadow: "0 0 40px hsl(43 90% 50% / 0.08)" }}
          >
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-5">
              {t("رقم الهاتف", "Phone Number")}
            </p>

            <div className="flex gap-0">
              {/* Country prefix */}
              <div className="flex items-center px-4 bg-accent/40 border border-border border-l-0 text-sm text-muted-foreground select-none shrink-0"
                style={{ borderRight: "none" }}>
                <Phone className="h-3.5 w-3.5 mr-2 text-primary" />
                +967
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("7X XXX XXXX", "7X XXX XXXX")}
                className="flex-1 h-14 px-4 bg-background border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors text-lg tracking-wider"
                dir="ltr"
              />
            </div>

            {error && (
              <p className="text-destructive text-xs tracking-widest mt-2">
                {t("⚠ الرجاء إدخال رقم هاتف صحيح", "⚠ Please enter a valid phone number")}
              </p>
            )}

            <Button
              onClick={handleSearch}
              disabled={searching}
              className="w-full h-13 mt-5 bg-primary text-primary-foreground tracking-widest uppercase text-sm gap-3"
              style={{ boxShadow: "0 0 20px hsl(43 90% 50% / 0.3)" }}
            >
              {searching ? (
                <span className="flex items-center gap-3">
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  {t("جاري البحث...", "Searching...")}
                </span>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  {t("ابحث عن طلبي", "Find My Order")}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Order Result */}
        <AnimatePresence>
          {order && (
            <motion.div
              key="order-result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4 }}
            >
              {/* Order Header */}
              <div className="bg-card border border-border p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-1">
                    {t("رقم الطلب", "Order ID")}
                  </p>
                  <p className="text-xl font-bold tracking-widest" dir="ltr">{order.orderId}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("تاريخ الطلب: ", "Order date: ")}{formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                    {t("الإجمالي", "Total")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {order.total.toLocaleString()}
                    <span className="text-sm font-normal text-primary/70 ml-1">{t("ر.ي", "YER")}</span>
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card border border-border p-8 mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-8">
                  {t("مسار الطلب", "Order Timeline")}
                </p>

                {/* Progress bar */}
                <div className="relative mb-10">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-1000"
                    style={{ width: `${(order.statusIdx / (STEPS.length - 1)) * 100}%` }}
                  />
                  <div className="relative grid grid-cols-4 gap-2">
                    {STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const done = i <= order.statusIdx;
                      const active = i === order.statusIdx;
                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center mb-3 transition-all duration-500 ${
                              done
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground"
                            } ${active ? "ring-4 ring-primary/20" : ""}`}
                            style={done ? { boxShadow: "0 0 16px hsl(43 90% 50% / 0.4)" } : {}}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className={`text-[10px] tracking-widest uppercase font-bold leading-tight ${done ? "text-foreground" : "text-muted-foreground"}`}>
                            {t(step.ar, step.en)}
                          </p>
                          {active && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="mt-1.5"
                            >
                              <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/30 text-primary text-[9px] tracking-widest uppercase px-2 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {t("الحالة الحالية", "Current")}
                              </span>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Current status description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="border border-primary/20 bg-primary/5 px-6 py-4 flex items-start gap-4"
                >
                  <div className="w-8 h-8 shrink-0 bg-primary/20 flex items-center justify-center mt-0.5">
                    {(() => { const Icon = STEPS[order.statusIdx].icon; return <Icon className="h-4 w-4 text-primary" />; })()}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-wide mb-1">
                      {t(STEPS[order.statusIdx].ar, STEPS[order.statusIdx].en)}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(STEPS[order.statusIdx].descAr, STEPS[order.statusIdx].descEn)}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Product */}
                <div className="bg-card border border-border p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">
                    {t("تفاصيل الطلب", "Order Details")}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-accent border border-border flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-primary/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-snug">
                        {t(order.product.ar, order.product.en)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("التوصيل إلى: ", "Delivery to: ")}
                        <span className="text-foreground">{t(order.city.ar, order.city.en)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delegate — only shown when dispatched */}
                {order.statusIdx >= 2 ? (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-primary/30 p-6"
                    style={{ boxShadow: "inset 0 0 0 1px hsl(43 90% 50% / 0.15)" }}
                  >
                    <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">
                      {t("المندوب الميداني", "Field Delegate")}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-lg">
                          {t(order.delegate.ar, order.delegate.en).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{t(order.delegate.ar, order.delegate.en)}</p>
                        <a
                          href={`tel:${order.delegate.phone}`}
                          className="flex items-center gap-1.5 text-primary text-xs mt-1.5 hover:text-primary/80 transition-colors"
                          dir="ltr"
                        >
                          <Phone className="h-3 w-3" />
                          {order.delegate.phone}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-card border border-border p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-accent/40 border border-border flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("سيتم تعيين مندوب قريباً", "Delegate will be assigned soon")}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {t("ستصلك رسالة عند التوزيع", "You'll be notified upon dispatch")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground mb-4">
                  {t("هل لديك استفسار؟", "Have a question?")}
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/">
                    <Button variant="outline" className="h-11 px-6 text-xs tracking-widest uppercase border-border gap-2">
                      {t("العودة للرئيسية", "Back to Home")}
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/967500000000?text=${encodeURIComponent(t("مرحباً، أريد الاستفسار عن طلبي", "Hello, I'd like to inquire about my order"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="h-11 px-6 bg-primary text-primary-foreground text-xs tracking-widest uppercase gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      {t("تواصل معنا", "Contact Us")}
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state before search */}
        {!order && !searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-8"
          >
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-16 h-16 border border-border bg-card flex items-center justify-center opacity-40">
                <Truck className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                {t("أدخل رقم هاتفك للبدء", "Enter your phone number to begin")}
              </p>
              <Link href="/products" className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors tracking-widest uppercase mt-2">
                {t("تصفح المنتجات", "Browse Products")}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
