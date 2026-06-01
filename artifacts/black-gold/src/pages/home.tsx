import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Star, Users } from "lucide-react";
import {
  useGetFeaturedProducts,
  useListCategories,
  useGetCatalogSummary,
} from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import heroBg from "@assets/1765649759489_1780351507847.jpg";
import heroLifestyle from "@assets/1768157504696_1780351507837.jpg";
import productBags from "@assets/1768157881289_1780351507821.jpg";
import adQuality from "@assets/1765637147033_1780351507939.jpg";
import adSession from "@assets/1765637518994_1780351507902.jpg";
import adGrid from "@assets/1765636966973_1780351508012.jpg";
import displayRack from "@assets/1765642864732_1780351507862.jpg";
import deliveryBike from "@assets/1765572227744_1780351507997.jpg";

export default function Home() {
  const { t } = useLang();
  const { data: featured } = useGetFeaturedProducts();
  const { data: categories } = useListCategories();
  const { data: summary } = useGetCatalogSummary();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.4) 40%, rgba(10,10,10,0.85) 100%)" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, hsl(45 93% 47% / 0.5) 60px, hsl(45 93% 47% / 0.5) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, hsl(45 93% 47% / 0.3) 60px, hsl(45 93% 47% / 0.3) 61px)" }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-screen-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-primary border border-primary/40 px-6 py-2 backdrop-blur-sm bg-black/20">
              {t("فحم شيشة فاخر — جودة لا تضاهى", "Premium Hookah Charcoal — Unrivaled Quality")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest mb-4 leading-none"
          >
            <span className="gold-shimmer">
              {t("الذهب", "BLACK")}
            </span>
            <br />
            <span className="gold-shimmer">
              {t("الأسود", "GOLD")}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="gold-divider w-32 mx-auto my-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg md:text-xl tracking-widest max-w-xl mx-auto mb-12"
          >
            {t(
              "اشتعل بجلسة لا تُنسى. جودة لا مثيل لها، احتراق طويل، وبدون روائح",
              "Ignite an unforgettable session. Unmatched quality, long-lasting burn, odorless"
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/products"
              className="inline-flex h-14 items-center justify-center gap-3 bg-primary text-primary-foreground px-10 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              data-testid="link-shop-now"
            >
              {t("اطلب الآن", "Order Now")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/wholesale"
              className="inline-flex h-14 items-center justify-center gap-3 border border-primary/50 text-foreground px-10 text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors backdrop-blur-sm"
              data-testid="link-wholesale"
            >
              {t("طلبات الجملة", "Wholesale")}
            </Link>
          </motion.div>

          {summary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-12 mt-16 pt-16 border-t border-white/10"
            >
              {[
                { value: "٥٠٠٠+", en: "5000+", ar: "عميل راضٍ", label_en: "Happy Clients" },
                { value: "٢٤", en: "24", ar: "ساعة توصيل", label_en: "Hour Delivery" },
                { value: "١٠٠٪", en: "100%", ar: "طبيعي خالص", label_en: "Natural & Pure" },
              ].map((stat, i) => (
                <div key={i} className="text-center" data-testid={`stat-${i}`}>
                  <p className="text-3xl font-bold text-primary">{t(stat.value, stat.en)}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{t(stat.ar, stat.label_en)}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Tagline Strip */}
      <section className="bg-primary/10 border-y border-primary/20 py-4 overflow-hidden">
        <div className="flex gap-16 animate-none">
          <div className="flex items-center gap-16 whitespace-nowrap text-[10px] tracking-[0.3em] uppercase text-primary/80 px-8 w-full justify-around">
            <span>{t("اشتعال سريع", "Quick Ignition")}</span>
            <span className="text-primary/40">◆</span>
            <span>{t("احتراق طويل", "Long-Lasting Burn")}</span>
            <span className="text-primary/40">◆</span>
            <span>{t("بدون روائح", "Odorless")}</span>
            <span className="text-primary/40">◆</span>
            <span>{t("جودة مضمونة", "Quality Guaranteed")}</span>
            <span className="text-primary/40">◆</span>
            <span>{t("توصيل سريع", "Fast Delivery")}</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card/20">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">{t("اختيارات مميزة", "Curated Picks")}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-wider mb-4">{t("المنتجات المميزة", "Featured Products")}</h2>
            <div className="gold-divider w-24 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featured?.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`featured-product-${product.id}`}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-background border border-border mb-4">
                    <img
                      src={product.imageUrl}
                      alt={t(product.nameAr, product.nameEn)}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    {product.badge && (
                      <div className="absolute top-3 ltr:left-3 rtl:right-3 bg-primary text-primary-foreground text-[9px] tracking-widest uppercase px-3 py-1">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                        {t(product.categoryNameAr ?? "", product.categoryNameEn ?? "")}
                      </p>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors tracking-wide text-sm">
                        {t(product.nameAr, product.nameEn)}
                      </h3>
                      <p className="text-primary mt-1 font-bold text-lg">
                        {product.basePrice.toFixed(0)} {t("ر.س", "SAR")}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-6 py-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {t("اطلب الآن", "Order Now")}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-3 border border-border text-foreground px-10 text-xs tracking-widest uppercase hover:border-primary/50 transition-colors"
              data-testid="link-view-all"
            >
              {t("عرض جميع المنتجات", "View All Products")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase — Full-width lifestyle images */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={heroLifestyle} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.1) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-screen-xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">{t("الفحم الأصيل", "Authentic Charcoal")}</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-wider mb-6 leading-tight">
                {t("فحم شيشة فاخر.", "Premium Hookah")}
                <br />
                <span className="gold-shimmer">{t("تجربة ذهبية.", "Charcoal.")}</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t(
                  "متوفر بعبوات 250غ و500غ. اشتعال سريع ودفء يدوم طوال الجلسة.",
                  "Available in 250g and 500g packs. Quick ignition and warmth that lasts the whole session."
                )}
              </p>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-3 bg-primary text-primary-foreground px-8 text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                {t("تسوق الآن", "Shop Now")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">{t("تسوق بالفئة", "Shop by Category")}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-wider">{t("فئات المنتجات", "Product Categories")}</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/products?category=${cat.id}`}
                  className="group block relative overflow-hidden aspect-square bg-card border border-border hover:border-primary/50 transition-all"
                  data-testid={`link-category-${cat.id}`}
                >
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={t(cat.nameAr, cat.nameEn)}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105 duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <p className="font-semibold text-sm tracking-wide group-hover:text-primary transition-colors">{t(cat.nameAr, cat.nameEn)}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{cat.productCount} {t("منتج", "products")}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Grid / Social Proof */}
      <section className="py-0">
        <div className="relative h-[50vh] overflow-hidden">
          <img src={adGrid} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.5)" }} />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">{t("متوفر بعبوات متعددة", "Available in Multiple Sizes")}</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-wider text-white mb-6">
                {t("خيارك الأمثل لكل جلسة", "Your Perfect Choice for Every Session")}
              </h2>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-3 bg-primary text-primary-foreground px-10 text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                {t("اكتشف الأحجام", "Explore Sizes")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-6">{t("قصتنا", "Our Story")}</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-wider mb-8 leading-tight">
                {t("ليس مجرد فحم —", "Not just charcoal —")}
                <br />
                <span className="gold-shimmer">{t("تجربة ذهبية لا تُنسى", "An Unforgettable Golden Experience")}</span>
              </h2>
              <div className="gold-divider w-24 mb-8" />
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t(
                  "الذهب الأسود ليست مجرد علامة تجارية — إنها التزام راسخ بتقديم أجود فحم الشيشة في المملكة. نختار أفضل المواد الخام ونستخدم أحدث تقنيات التصنيع لنضمن لك اشتعالاً مثالياً في كل جلسة.",
                  "Black Gold is not just a brand — it is an unwavering commitment to delivering the finest hookah charcoal in the Kingdom. We select the best raw materials and use the latest manufacturing techniques to guarantee perfect ignition every session."
                )}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {t(
                  "فحمنا مصنوع من أجود أنواع الخشب الطبيعي — بدون إضافات كيميائية، بدون روائح، ودفء يدوم طوال جلستك.",
                  "Our charcoal is made from the finest natural wood — no chemical additives, no odors, and warmth that lasts throughout your session."
                )}
              </p>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-3 bg-primary text-primary-foreground px-8 text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
                data-testid="link-discover"
              >
                {t("اكتشف المجموعة", "Discover the Collection")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="col-span-2 aspect-video overflow-hidden border border-border">
                <img src={productBags} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden border border-border">
                <img src={adQuality} alt="" className="w-full h-full object-cover object-top" />
              </div>
              <div className="aspect-square overflow-hidden border border-border">
                <img src={adSession} alt="" className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, ar: "جودة مضمونة 100٪", en: "100% Quality Guaranteed", descAr: "فحم طبيعي خالص بدون إضافات", descEn: "Pure natural charcoal, no additives" },
              { icon: Truck, ar: "توصيل سريع", en: "Fast Delivery", descAr: "خلال 24 ساعة داخل المدينة", descEn: "Within 24 hours city-wide" },
              { icon: Star, ar: "اشتعال أطول", en: "Longer Burn", descAr: "يدوم ضعف الفحم العادي", descEn: "Lasts twice as long as ordinary charcoal" },
              { icon: Users, ar: "دعم متواصل", en: "Continuous Support", descAr: "فريقنا متاح على مدار الساعة", descEn: "Our team available around the clock" },
            ].map(({ icon: Icon, ar, en, descAr, descEn }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-8 px-4"
              >
                <div className="w-12 h-12 border border-primary/30 mx-auto mb-4 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold tracking-wide mb-2">{t(ar, en)}</h3>
                <p className="text-xs text-muted-foreground">{t(descAr, descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery & Display */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden aspect-video lg:aspect-auto min-h-[300px]"
            >
              <img src={deliveryBike} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-2">{t("توصيل سريع", "Express Delivery")}</p>
                <p className="font-bold text-lg tracking-wide">{t("يصلك الفحم خلال 24 ساعة", "Charcoal delivered within 24 hours")}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden aspect-video lg:aspect-auto min-h-[300px]"
            >
              <img src={displayRack} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-2">{t("توافر واسع", "Wide Availability")}</p>
                <p className="font-bold text-lg tracking-wide">{t("متوفر في أكثر من 50 نقطة بيع", "Available at 50+ retail points")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroLifestyle} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, hsl(45 93% 47% / 0.08) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto px-4 max-w-screen-xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-6">{t("للمقاهي والتجار والموزعين", "For Cafés, Merchants & Distributors")}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-wider mb-6">
              {t("تاجر معنا — اربح مع الذهب الأسود", "Partner With Us — Profit With Black Gold")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              {t(
                "نقدم أسعاراً تنافسية للكميات الكبيرة مع دعم متخصص لشركاء الأعمال. خصومات تصل إلى 30٪ على طلبات الجملة.",
                "We offer competitive pricing for large volumes with dedicated support for business partners. Up to 30% discount on wholesale orders."
              )}
            </p>
            <Link
              href="/wholesale"
              className="inline-flex h-14 items-center gap-3 bg-primary text-primary-foreground px-12 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              data-testid="link-wholesale-cta"
            >
              {t("طلب أسعار الجملة", "Request Wholesale Pricing")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
