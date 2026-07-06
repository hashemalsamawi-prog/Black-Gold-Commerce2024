import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Package, Truck, Home } from "lucide-react";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/data/config";

const CUR_AR = siteConfig.delivery.currencyAr;
const CUR_EN = siteConfig.delivery.currencyEn;

const STATUS_MAP: Record<string, { ar: string; en: string }> = {
  pending:   { ar: "قيد المعالجة", en: "Pending" },
  confirmed: { ar: "مؤكد",         en: "Confirmed" },
  shipped:   { ar: "في الطريق",    en: "In Transit" },
  delivered: { ar: "تم التوصيل",   en: "Delivered" },
  cancelled: { ar: "ملغي",         en: "Cancelled" },
};

const PROGRESS_STEPS = [
  { key: "pending",   icon: Package,       ar: "تم الاستلام",   en: "Received"   },
  { key: "confirmed", icon: CheckCircle2,  ar: "مؤكد",          en: "Confirmed"  },
  { key: "shipped",   icon: Truck,         ar: "في الطريق",     en: "In Transit" },
  { key: "delivered", icon: Home,          ar: "تم التوصيل",    en: "Delivered"  },
];

function OrderProgressBar({ status }: { status: string }) {
  const { t } = useLang();
  if (status === "cancelled") {
    return (
      <div className="p-4 border border-destructive/30 bg-destructive/5 text-center">
        <p className="text-sm text-destructive tracking-widest uppercase">{t("تم إلغاء الطلب", "Order Cancelled")}</p>
      </div>
    );
  }
  const currentIdx = PROGRESS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="relative py-2">
      {/* Connecting line */}
      <div className="absolute top-6 left-6 right-6 h-px bg-border" style={{ zIndex: 0 }} />
      <div
        className="absolute top-6 left-6 h-px bg-primary transition-all duration-700"
        style={{ zIndex: 1, width: currentIdx <= 0 ? "0%" : `${(currentIdx / (PROGRESS_STEPS.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between" style={{ zIndex: 2 }}>
        {PROGRESS_STEPS.map((step, i) => {
          const done = currentIdx >= i;
          const active = currentIdx === i;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                done
                  ? "bg-primary border-primary shadow-[0_0_12px_hsl(43_90%_50%/0.5)]"
                  : "bg-background border-border"
              } ${active ? "scale-110" : ""}`}>
                <Icon className={`h-4 w-4 ${done ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <p className={`text-[9px] tracking-widest uppercase text-center leading-tight ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {t(step.ar, step.en)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountOrderDetail() {
  const [, params] = useRoute("/account/orders/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const { t } = useLang();

  const { data: order, isLoading } = useGetOrder(id, {
    query: { enabled: !!id, queryKey: getGetOrderQueryKey(id) },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-screen-lg py-16">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-28 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) return (
    <div className="container mx-auto px-4 py-16 text-center">
      <p className="text-muted-foreground">{t("الطلب غير موجود", "Order not found")}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="border-b border-border py-12">
        <div className="container mx-auto px-4 max-w-screen-lg">
          <Link href="/account/orders" className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="h-3 w-3" />{t("العودة للطلبات", "Back to Orders")}
          </Link>
          <h1 className="text-2xl font-bold tracking-wider">{t(`طلب رقم #${order.id}`, `Order #${order.id}`)}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-lg py-12 space-y-6">
        {/* ── Order Tracking Progress Bar ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6">
          <h2 className="text-sm tracking-widest uppercase text-primary mb-6 pb-4 border-b border-border">{t("تتبع الطلب", "Order Tracking")}</h2>
          <OrderProgressBar status={order.status} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-card border border-border p-8">
            <h2 className="text-sm tracking-widest uppercase text-primary mb-6 pb-4 border-b border-border">{t("عناصر الطلب", "Order Items")}</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{t(item.productNameAr, item.productNameEn)}</p>
                    <p className="text-xs text-muted-foreground">{t(item.variantNameAr, item.variantNameEn)} × {item.quantity}</p>
                  </div>
                  <span className="text-primary font-bold">{Math.round(item.price * item.quantity).toLocaleString()} {t(CUR_AR, CUR_EN)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("المجموع الفرعي", "Subtotal")}</span>
                <span>{Math.round(order.subtotal).toLocaleString()} {t(CUR_AR, CUR_EN)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("التوصيل", "Delivery")}</span>
                <span>{order.deliveryFee === 0 ? t("مجاني", "Free") : `${Math.round(order.deliveryFee).toLocaleString()} ${t(CUR_AR, CUR_EN)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>{t("الإجمالي", "Total")}</span>
                <span className="text-primary">{Math.round(order.total).toLocaleString()} {t(CUR_AR, CUR_EN)}</span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs tracking-widest uppercase text-primary mb-4">{t("حالة الطلب", "Status")}</h3>
              <span className={`text-xs tracking-widest uppercase border px-3 py-1 ${
                order.status === "delivered" ? "border-green-500/40 text-green-400"
                : order.status === "cancelled" ? "border-destructive/40 text-destructive"
                : "border-primary/30 text-primary"
              }`}>
                {t(STATUS_MAP[order.status]?.ar ?? order.status, STATUS_MAP[order.status]?.en ?? order.status)}
              </span>
            </div>
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs tracking-widest uppercase text-primary mb-4">{t("بيانات العميل", "Customer")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </div>
            </div>
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs tracking-widest uppercase text-primary mb-4">{t("التوصيل", "Delivery")}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{order.city}</p>
                <p>{order.deliveryAddress}</p>
                {order.notes && <p className="text-xs mt-2 italic">{order.notes}</p>}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
