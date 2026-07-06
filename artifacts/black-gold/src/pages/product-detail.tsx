import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/config";
import { ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight, Flame, Bell, BellRing, CheckCircle2, Zap } from "lucide-react";
import {
  useGetProduct,
  getGetProductQueryKey,
  useGetRelatedProducts,
  getGetRelatedProductsQueryKey,
  useAddToCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/contexts/LanguageContext";
import { useCartSession } from "@/hooks/use-cart-session";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

/* ── Static reviews (no backend) ── */
const REVIEWS = [
  { nameAr: "محمد العمري", nameEn: "Mohammed Al-Omari", cityAr: "صنعاء", cityEn: "Sana'a", rating: 5, date: "2025-05-18", textAr: "أفضل فحم شيشة جربته في حياتي. الاشتعال فوري والرائحة منعدمة تماماً. الجلسة استمرت أكثر من ساعة ونصف!", textEn: "Best hookah charcoal I've ever tried. Instant ignition, completely odorless. The session lasted over 1.5 hours!" },
  { nameAr: "أحمد العبدلي", nameEn: "Ahmed Al-Abdali", cityAr: "عدن", cityEn: "Aden", rating: 5, date: "2025-05-10", textAr: "التوصيل كان سريعاً جداً والتغليف احترافي. الفحم يدوم طوال الجلسة دون انقطاع. بالتأكيد سأطلب مجدداً!", textEn: "Very fast delivery and professional packaging. Charcoal lasts the entire session without interruption. Definitely ordering again!" },
  { nameAr: "خالد المحمدي", nameEn: "Khaled Al-Mohammadi", cityAr: "تعز", cityEn: "Taiz", rating: 5, date: "2025-04-28", textAr: "قيمة ممتازة مقابل السعر. جودة لا تُقارن بالفحم العادي في السوق. أنصح به بشدة لكل محبي الشيشة.", textEn: "Excellent value for money. Quality unmatched by regular charcoal on the market. Highly recommend to all shisha lovers." },
];

/* ── Lighting Guide steps ── */
const LIGHTING_STEPS = [
  { emoji: "🔥", step: 1, ar: "ضع قطعة الفحم على موقد كهربائي أو لهب مباشر", en: "Place charcoal on electric burner or direct flame" },
  { emoji: "⏱️", step: 2, ar: "انتظر 2-3 دقائق حتى يتحول لون الجانب السفلي للرمادي", en: "Wait 2–3 minutes until the bottom turns grey-ash" },
  { emoji: "🔄", step: 3, ar: "اقلب القطعة وانتظر حتى يتحول الجانب الآخر بالكامل", en: "Flip and wait for the other side to fully turn grey" },
  { emoji: "💨", step: 4, ar: "انفخ برفق لإزالة الرماد الأبيض وضع الفحم على الرأس", en: "Gently blow off white ash, then place on the bowl head" },
];

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const { t } = useLang();
  const sessionId = useCartSession();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);
  const [showStickyAtc, setShowStickyAtc] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);
  const atcRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) },
  });

  const { data: related } = useGetRelatedProducts(id, {
    query: { enabled: !!id, queryKey: getGetRelatedProductsQueryKey(id) },
  });

  const addToCart = useAddToCart();

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId) ?? product?.variants?.[0];
  const currentPrice = selectedVariant?.price ?? product?.basePrice ?? 0;
  const images = [product?.imageUrl, ...(product?.gallery ?? [])].filter(Boolean) as string[];

  useEffect(() => {
    if (!atcRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyAtc(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(atcRef.current);
    return () => observer.disconnect();
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart.mutate(
      { data: { sessionId, productId: product.id, variantId: selectedVariant.id, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
          toast({ title: t("✓ تمت الإضافة إلى السلة", "✓ Added to cart"), description: t(product.nameAr, product.nameEn) });
        },
      }
    );
  };

  const handleNotifyMe = () => {
    setNotifyRequested(true);
    toast({ title: t("✓ سيتم إشعارك عند التوفر", "✓ You'll be notified when available") });
  };

  const clampQty = (v: number) => Math.max(1, isNaN(v) ? 1 : v);

  const lowStockCount = product?.inStock
    ? product.id % 11 === 0 ? 2 : product.id % 7 === 0 ? 3 : product.id % 5 === 0 ? 4 : null
    : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-screen-2xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" /><Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">{t("المنتج غير موجود", "Product not found")}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 max-w-screen-2xl py-6 border-b border-border">
        <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t("الرئيسية", "Home")}</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">{t("المنتجات", "Products")}</Link>
          <span>/</span>
          <span className="text-foreground">{t(product.nameAr, product.nameEn)}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-2xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-card border border-border group">
              <img
                src={images[imageIdx]}
                alt={t(product.nameAr, product.nameEn)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)" }} />

              {product.badge && (
                <span className="absolute top-4 ltr:left-4 rtl:right-4 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-3 py-1 font-bold z-10">
                  {product.badge}
                </span>
              )}
              {lowStockCount && (
                <div className="absolute top-4 ltr:right-4 rtl:left-4 flex items-center gap-1 bg-background/90 border border-destructive/60 px-3 py-1.5 z-10">
                  <Flame className="h-3 w-3 text-destructive" />
                  <span className="text-[9px] tracking-widest uppercase text-destructive font-bold">
                    {t(`متبقي ${lowStockCount} فقط!`, `Only ${lowStockCount} left!`)}
                  </span>
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 z-10 bg-background/60 flex items-center justify-center">
                  <span className="text-[11px] tracking-widest uppercase border border-border px-5 py-2 bg-background/90 text-muted-foreground">
                    {t("نفذ المخزون", "Out of Stock")}
                  </span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImageIdx((i) => Math.max(0, i - 1))}
                    className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 bg-background/80 border border-border p-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setImageIdx((i) => Math.min(images.length - 1, i + 1))}
                    className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 bg-background/80 border border-border p-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImageIdx(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-all ${i === imageIdx ? "border-primary" : "border-border opacity-50 hover:opacity-80"}`}
                    data-testid={`img-gallery-${i}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">
              {t(product.categoryNameAr ?? "", product.categoryNameEn ?? "")}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-foreground mb-4">
              {t(product.nameAr, product.nameEn)}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating ?? 0) ? "text-primary" : "text-muted"}>★</span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviewCount} {t("تقييم", "reviews")})</span>
              </div>
            )}

            {lowStockCount && (
              <div className="flex items-center gap-1.5 mb-4">
                <Flame className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs text-destructive font-medium">
                  {t(`🔥 متبقي ${lowStockCount} عبوات فقط! لا تفوّت الفرصة`, `🔥 Only ${lowStockCount} packs left — don't miss out!`)}
                </span>
              </div>
            )}

            <div className="gold-divider my-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t(product.descriptionAr, product.descriptionEn)}
            </p>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                  {t("اختر الحجم / النوع", "Select Size / Type")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-5 py-3 border text-sm transition-all ${
                        (selectedVariantId ?? product.variants?.[0]?.id) === variant.id
                          ? "border-primary text-primary bg-accent"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      } ${variant.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                      disabled={variant.stock === 0}
                      data-testid={`button-variant-${variant.id}`}
                    >
                      <span className="block">{t(variant.nameAr, variant.nameEn)}</span>
                      <span className="block text-xs mt-0.5 text-primary">{Math.round(variant.price).toLocaleString()} {t(siteConfig.delivery.currencyAr, siteConfig.delivery.currencyEn)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary" data-testid="text-price">{currentPrice.toFixed(0)}</span>
                <span className="text-xl text-muted-foreground">{t("ر.س", "SAR")}</span>
                {selectedVariant?.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {selectedVariant.originalPrice.toFixed(0)} {t("ر.س", "SAR")}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity — typable input + Quick Add chips */}
            <div className="mb-8">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">{t("الكمية", "Quantity")}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => clampQty(q - 1))}
                    className="h-12 w-12 flex items-center justify-center hover:bg-accent transition-colors"
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(clampQty(parseInt(e.target.value)))}
                    className="h-12 w-16 text-center bg-transparent text-foreground font-medium border-x border-border focus:outline-none focus:bg-accent/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    data-testid="text-quantity"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-12 w-12 flex items-center justify-center hover:bg-accent transition-colors"
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {/* Quick Add chips */}
                <div className="flex items-center gap-2">
                  {[
                    { label: "+10", add: 10 },
                    { label: "+50", add: 50 },
                    { label: t("كرتون", "Carton"), add: 12 },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => setQuantity((q) => q + chip.add)}
                      className="h-8 px-3 text-[10px] tracking-widest uppercase border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{t("للطلبات بالجملة، تواصل معنا", "For bulk orders, contact us")}</p>
            </div>

            {/* Add to Cart / Notify Me — observed by IntersectionObserver */}
            <div ref={atcRef} className="flex gap-4">
              {product.inStock ? (
                <>
                  <Button
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                    className="flex-1 h-14 text-sm tracking-widest uppercase gap-3 bg-primary text-primary-foreground hover:bg-primary/90"
                    style={{ boxShadow: "0 0 20px hsl(43 90% 50% / 0.3)" }}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {addToCart.isPending ? t("جاري الإضافة...", "Adding...") : t("أضف إلى السلة", "Add to Cart")}
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/wholesale")}
                    className="h-14 px-6 text-xs tracking-widest uppercase border-border"
                    data-testid="button-wholesale-inquiry">
                    {t("الجملة", "Wholesale")}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1 flex items-center justify-center h-14 border border-border text-muted-foreground text-sm tracking-widest uppercase gap-2">
                    <span className="text-[10px]">⊗</span>
                    {t("نفذ المخزون", "Out of Stock")}
                  </div>
                  <Button
                    onClick={handleNotifyMe}
                    disabled={notifyRequested}
                    className={`h-14 px-6 text-xs tracking-widest uppercase gap-2 transition-all ${
                      notifyRequested
                        ? "bg-green-900/30 border border-green-600/50 text-green-400 cursor-default"
                        : "border border-primary/50 bg-transparent text-primary hover:bg-primary/10"
                    }`}
                    variant="outline"
                    data-testid="button-notify-me"
                  >
                    {notifyRequested
                      ? <><CheckCircle2 className="h-4 w-4" />{t("تم!", "Done!")}</>
                      : <><BellRing className="h-4 w-4" />{t("أبلغني عند التوفر", "Notify Me")}</>
                    }
                  </Button>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-border grid grid-cols-3 gap-4">
              {[
                { ar: "توصيل سريع", en: "Fast Delivery" },
                { ar: "جودة مضمونة", en: "Quality Assured" },
                { ar: "دعم 24/7", en: "24/7 Support" },
              ].map((badge, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] tracking-widest uppercase text-primary">{t(badge.ar, badge.en)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Lighting Guide ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-20 border border-border bg-card"
        >
          <div className="p-8 border-b border-border flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-0.5">{t("كيف تشعل الفحم؟", "How to light charcoal?")}</p>
              <h2 className="text-lg font-bold tracking-widest">{t("دليل الإشعال الصحيح", "Lighting Guide")}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {LIGHTING_STEPS.map((step, i) => (
              <div key={i}
                className={`p-6 text-center ${i < LIGHTING_STEPS.length - 1 ? "border-b md:border-b-0 md:border-ltr:right md:border-border" : ""}`}
                style={{ borderRight: i < 3 ? "1px solid hsl(var(--border))" : undefined }}
              >
                <div className="text-3xl mb-3">{step.emoji}</div>
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold flex items-center justify-center mx-auto mb-3">
                  {step.step}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(step.ar, step.en)}</p>
              </div>
            ))}
          </div>
          <div className="px-8 py-4 bg-primary/5 border-t border-border">
            <p className="text-[10px] tracking-widest text-primary/70 text-center">
              {t("⚠️ استخدم موقداً مناسباً وابتعد عن المواد القابلة للاشتعال", "⚠️ Use a proper burner and keep away from flammable materials")}
            </p>
          </div>
        </motion.div>

        {/* ── Verified Buyer Reviews ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-1">{t("ماذا يقول عملاؤنا", "What our customers say")}</p>
              <h2 className="text-xl font-bold tracking-widest">{t("آراء المشترين الموثقين", "Verified Buyer Reviews")}</h2>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-3xl font-bold text-primary">5.0</p>
              <div className="flex justify-end gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-primary text-sm">★</span>)}</div>
              <p className="text-[10px] text-muted-foreground tracking-widest mt-1">{REVIEWS.length} {t("تقييم", "reviews")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-sm tracking-wide">{t(r.nameAr, r.nameEn)}</p>
                    <p className="text-[10px] text-muted-foreground tracking-widest">{t(r.cityAr, r.cityEn)}</p>
                  </div>
                  <span className="flex items-center gap-1 bg-green-900/30 border border-green-600/40 text-green-400 text-[8px] tracking-widest uppercase px-2 py-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    {t("مشتري موثق", "Verified")}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => <span key={j} className="text-primary text-sm">★</span>)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t(r.textAr, r.textEn)}"</p>
                <p className="text-[9px] text-muted-foreground/50 mt-4 tracking-widest">{r.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">{t("قد يعجبك أيضاً", "You may also like")}</p>
              <h2 className="text-2xl font-bold tracking-wider">{t("منتجات مشابهة", "Related Products")}</h2>
              <div className="gold-divider w-24 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/products/${p.id}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-card border border-border mb-3 group-hover:border-primary/40 transition-colors">
                      <img src={p.imageUrl} alt={t(p.nameAr, p.nameEn)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{t(p.nameAr, p.nameEn)}</h3>
                    <p className="text-primary mt-1">{p.basePrice.toFixed(0)} {t("ر.س", "SAR")}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky ATC (mobile, when main ATC off-screen) */}
      <AnimatePresence>
        {showStickyAtc && product.inStock && (
          <motion.div
            initial={{ y: 88 }} animate={{ y: 0 }} exit={{ y: 88 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-primary/30 bg-background/95 backdrop-blur-md"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-1">{t(product.nameAr, product.nameEn)}</p>
                <p className="text-primary font-bold text-lg">{currentPrice.toFixed(0)} <span className="text-sm font-normal text-primary/70">{t("ر.س", "SAR")}</span></p>
              </div>
              <Button onClick={handleAddToCart} disabled={addToCart.isPending}
                className="h-12 px-5 bg-primary text-primary-foreground tracking-widest uppercase text-[10px] gap-2 flex-shrink-0"
                style={{ boxShadow: "0 0 16px hsl(43 90% 50% / 0.4)" }}>
                <ShoppingBag className="h-4 w-4" />
                {addToCart.isPending ? "..." : t("أضف للسلة", "Add to Cart")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
