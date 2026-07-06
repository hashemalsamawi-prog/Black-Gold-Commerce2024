import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Package, LogOut, Star, MapPin, Plus, Trash2, ShoppingBag, RotateCcw } from "lucide-react";
import {
  useGetCustomerOrders,
  getGetCustomerOrdersQueryKey,
  useAddToCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useCartSession } from "@/hooks/use-cart-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { siteConfig, type SavedAddress } from "@/data/config";
import { nanoid } from "nanoid";

const CUR_AR = siteConfig.delivery.currencyAr;
const CUR_EN = siteConfig.delivery.currencyEn;

const STATUS_MAP: Record<string, { ar: string; en: string }> = {
  pending:   { ar: "قيد المعالجة", en: "Pending" },
  confirmed: { ar: "مؤكد",         en: "Confirmed" },
  shipped:   { ar: "تم الشحن",     en: "Shipped" },
  delivered: { ar: "تم التوصيل",   en: "Delivered" },
  cancelled: { ar: "ملغي",         en: "Cancelled" },
};

type DashTab = "orders" | "addresses" | "loyalty";

export default function AccountOrders() {
  const { t } = useLang();
  const { customer, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const sessionId = useCartSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<DashTab>("orders");
  const addToCart = useAddToCart();

  /* ── Address Book (localStorage) ── */
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try { return JSON.parse(localStorage.getItem("bg_address_book") ?? "[]"); } catch { return []; }
  });
  const [addrForm, setAddrForm] = useState({ label: "", city: "", address: "" });
  const [showAddrForm, setShowAddrForm] = useState(false);

  const saveAddresses = (list: SavedAddress[]) => {
    setAddresses(list);
    localStorage.setItem("bg_address_book", JSON.stringify(list));
  };
  const addAddress = () => {
    if (!addrForm.label || !addrForm.city || !addrForm.address) {
      toast({ title: t("يرجى ملء جميع الحقول", "Please fill all fields"), variant: "destructive" });
      return;
    }
    saveAddresses([...addresses, { id: nanoid(8), ...addrForm }]);
    setAddrForm({ label: "", city: "", address: "" });
    setShowAddrForm(false);
    toast({ title: t("تم حفظ العنوان", "Address saved") });
  };
  const removeAddress = (id: string) => saveAddresses(addresses.filter(a => a.id !== id));

  useEffect(() => {
    if (!isAuthenticated) setLocation("/account/login");
  }, [isAuthenticated]);

  const { data: orders, isLoading } = useGetCustomerOrders(customer?.id ?? 0, {
    query: { enabled: !!customer?.id, queryKey: getGetCustomerOrdersQueryKey(customer?.id ?? 0) },
  });

  /* ── Loyalty Points calculation ── */
  const totalSpent = orders?.reduce((acc, o) => acc + (o.total ?? 0), 0) ?? 0;
  const loyaltyPoints = Math.floor(totalSpent / 1000);
  const loyaltyBalance = loyaltyPoints * 10; // 10 YER per point

  /* ── Reorder ── */
  const handleReorder = (order: NonNullable<typeof orders>[number]) => {
    let remaining = order.items.length;
    order.items.forEach((item) => {
      addToCart.mutate(
        { data: { sessionId, productId: item.productId, variantId: item.variantId, quantity: item.quantity } },
        {
          onSettled: () => {
            remaining--;
            if (remaining === 0) {
              queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
              toast({ title: t("✓ تمت إضافة الطلب السابق للسلة", "✓ Previous order added to cart") });
              setLocation("/cart");
            }
          },
        }
      );
    });
  };

  if (!isAuthenticated) return null;

  const tabs: { key: DashTab; ar: string; en: string }[] = [
    { key: "orders",    ar: "طلباتي",       en: "My Orders" },
    { key: "addresses", ar: "دفتر العناوين", en: "Addresses" },
    { key: "loyalty",   ar: "نقاط الولاء",  en: "Loyalty" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-border py-12">
        <div className="container mx-auto px-4 max-w-screen-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-2">{t("حسابي", "My Account")}</p>
            <h1 className="text-3xl font-bold tracking-wider">{t("لوحة التحكم", "Dashboard")}</h1>
          </div>
          <Button variant="ghost" onClick={() => { logout(); setLocation("/"); }} className="text-muted-foreground hover:text-foreground gap-2" data-testid="button-logout">
            <LogOut className="h-4 w-4" />{t("خروج", "Sign Out")}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-xl py-10">
        {/* Profile card */}
        {customer && (
          <div className="bg-card border border-border p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent border border-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">{customer.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>
            {/* Quick loyalty snippet */}
            <div className="text-right">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{t("النقاط المكتسبة", "Earned Points")}</p>
              <p className="text-2xl font-bold text-primary">{loyaltyPoints.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-6 py-3 text-xs tracking-widest uppercase transition-all ${activeTab === tab.key ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t(tab.ar, tab.en)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
              ) : !orders || orders.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-30" />
                  <h2 className="text-xl font-bold text-muted-foreground mb-4">{t("لا توجد طلبات بعد", "No orders yet")}</h2>
                  <Link href="/products"><Button className="bg-primary text-primary-foreground h-12 px-8 tracking-widest uppercase">{t("تسوق الآن", "Shop Now")}</Button></Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border p-6" data-testid={`order-row-${order.id}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium tracking-wide">{t(`طلب رقم #${order.id}`, `Order #${order.id}`)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(t("ar-SA", "en-US"), { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.items.length} {t("عنصر", "items")}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-xs tracking-widest uppercase px-3 py-1 border ${order.status === "delivered" ? "border-green-500/30 text-green-400" : order.status === "cancelled" ? "border-destructive/30 text-destructive" : "border-primary/30 text-primary"}`} data-testid={`status-order-${order.id}`}>
                            {t(STATUS_MAP[order.status]?.ar ?? order.status, STATUS_MAP[order.status]?.en ?? order.status)}
                          </span>
                          <span className="font-bold text-primary" data-testid={`total-order-${order.id}`}>{Math.round(order.total).toLocaleString()} {t(CUR_AR, CUR_EN)}</span>
                          <Link href={`/account/orders/${order.id}`} data-testid={`link-order-${order.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs tracking-widest uppercase border border-border px-4 hover:border-primary/50">{t("التفاصيل", "Details")}</Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => handleReorder(order)}
                            className="text-xs tracking-widest uppercase border-primary/40 text-primary hover:bg-primary/10 gap-1.5" data-testid={`button-reorder-${order.id}`}>
                            <RotateCcw className="h-3 w-3" />{t("إعادة الطلب", "Reorder")}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── ADDRESS BOOK TAB ── */}
          {activeTab === "addresses" && (
            <motion.div key="addresses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">{addresses.length} {t("عنوان محفوظ", "saved addresses")}</p>
                <Button size="sm" onClick={() => setShowAddrForm(!showAddrForm)}
                  className="bg-primary text-primary-foreground text-xs tracking-widest uppercase h-9 gap-1.5">
                  <Plus className="h-3.5 w-3.5" />{t("+ إضافة عنوان جديد", "+ Add New Location")}
                </Button>
              </div>

              <AnimatePresence>
                {showAddrForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="bg-card border border-primary/30 p-6 space-y-4">
                      <p className="text-xs tracking-widest uppercase text-primary">{t("عنوان جديد", "New Address")}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">{t("اسم العنوان *", "Label *")}</label>
                          <Input value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                            placeholder={t("مثال: فرع صنعاء", "e.g. Branch 1")} className="bg-background border-border h-10" />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">{t("المدينة *", "City *")}</label>
                          <div className="relative">
                            <select value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                              className="w-full h-10 bg-background border border-border px-3 text-sm text-foreground focus:outline-none appearance-none">
                              <option value="">{t("اختر...", "Select...")}</option>
                              {siteConfig.citiesShipping.map((c) => (
                                <option key={c.id} value={c.ar}>{t(c.ar, c.en)}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">{t("العنوان التفصيلي *", "Address *")}</label>
                          <Input value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                            placeholder={t("الشارع، الحي...", "Street, district...")} className="bg-background border-border h-10" />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setShowAddrForm(false)} className="text-xs tracking-widest">{t("إلغاء", "Cancel")}</Button>
                        <Button size="sm" onClick={addAddress} className="bg-primary text-primary-foreground text-xs tracking-widest uppercase h-9">{t("حفظ العنوان", "Save Address")}</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {addresses.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">{t("لا توجد عناوين محفوظة بعد", "No saved addresses yet")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <motion.div key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="bg-card border border-border p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-sm">{addr.label}</p>
                          <p className="text-xs text-muted-foreground">{addr.city}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{addr.address}</p>
                        </div>
                      </div>
                      <button onClick={() => removeAddress(addr.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── LOYALTY TAB ── */}
          {activeTab === "loyalty" && (
            <motion.div key="loyalty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Main wallet card */}
              <div className="relative overflow-hidden bg-card border border-primary/40 p-8"
                style={{ background: "linear-gradient(135deg, hsl(43 90% 8% / 1) 0%, hsl(43 90% 4% / 1) 100%)", boxShadow: "0 0 0 1px hsl(43 90% 50% / 0.3), 0 8px 32px hsl(43 90% 50% / 0.1)" }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(43 90% 50%) 0%, transparent 60%)" }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-1">{t("محفظة الولاء", "Loyalty Wallet")}</p>
                      <p className="text-sm text-muted-foreground">{customer?.name}</p>
                    </div>
                    <Star className="h-6 w-6 text-primary" fill="hsl(43 90% 50%)" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-primary/60 mb-1">{t("النقاط المكتسبة", "Earned Points")}</p>
                      <p className="text-4xl font-bold text-primary">{loyaltyPoints.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{t("نقطة", "pts")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-primary/60 mb-1">{t("رصيد المكافآت", "Reward Balance")}</p>
                      <p className="text-4xl font-bold text-primary">{loyaltyBalance.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{t(CUR_AR, CUR_EN)}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground">{t("إجمالي المشتريات", "Total Spent")}: <span className="text-primary font-bold">{Math.round(totalSpent).toLocaleString()} {t(CUR_AR, CUR_EN)}</span></p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-card border border-border p-6">
                <p className="text-xs tracking-widest uppercase text-primary mb-4">{t("كيف يعمل؟", "How it works")}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { emoji: "🛒", ar: "اشتر بـ 1,000 ر.ي",       en: "Spend 1,000 YER" },
                    { emoji: "⭐", ar: "احصل على نقطة ولاء",      en: "Earn 1 loyalty point" },
                    { emoji: "🎁", ar: "كل نقطة = 10 ر.ي خصم",   en: "Each point = 10 YER discount" },
                  ].map((step, i) => (
                    <div key={i} className="text-center p-4 border border-border">
                      <div className="text-2xl mb-2">{step.emoji}</div>
                      <p className="text-xs text-muted-foreground">{t(step.ar, step.en)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order history for points */}
              {orders && orders.length > 0 && (
                <div className="bg-card border border-border p-6">
                  <p className="text-xs tracking-widest uppercase text-primary mb-4">{t("سجل النقاط", "Points History")}</p>
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{t(`طلب #${order.id}`, `Order #${order.id}`)}</span>
                        <span className="text-primary font-medium">+{Math.floor((order.total ?? 0) / 1000)} {t("نقاط", "pts")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/products">
                <Button className="w-full h-12 bg-primary text-primary-foreground tracking-widest uppercase gap-2">
                  <ShoppingBag className="h-4 w-4" />{t("اكسب المزيد من النقاط", "Earn More Points")}
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
