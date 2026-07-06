import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/config";
import { Search, SlidersHorizontal, X, ShoppingBag, Eye } from "lucide-react";
import {
  useListProducts,
  useListCategories,
  useAddToCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import { useCartSession } from "@/hooks/use-cart-session";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCard({ product, index }: { product: any; index: number }) {
  const { t } = useLang();
  const { toast } = useToast();
  const sessionId = useCartSession();
  const queryClient = useQueryClient();
  const addToCart = useAddToCart();
  const [hovered, setHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    const firstVariantId = product.variantId ?? null;
    addToCart.mutate(
      { data: { sessionId, productId: product.id, variantId: firstVariantId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
          toast({
            title: t("✓ تمت الإضافة إلى السلة", "✓ Added to cart"),
            description: t(product.nameAr, product.nameEn),
          });
        },
        onError: () => {
          // If no variant, redirect to product page
          window.location.href = `/products/${product.id}`;
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image wrapper */}
        <div
          className="relative overflow-hidden bg-card border border-border mb-0 transition-all duration-500"
          style={{
            aspectRatio: "3/4",
            boxShadow: hovered
              ? "0 0 0 1px hsl(43 90% 50% / 0.5), 0 12px 40px hsl(43 90% 50% / 0.15), 0 4px 16px rgba(0,0,0,0.6)"
              : "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          <img
            src={product.imageUrl}
            alt={t(product.nameAr, product.nameEn)}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
            loading="lazy"
            decoding="async"
          />

          {/* Dark overlay — lighter on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.1) 100%)" }}
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 ltr:left-3 rtl:right-3 z-20">
              <span className="bg-primary text-primary-foreground text-[9px] tracking-widest uppercase px-3 py-1 font-bold">
                {product.badge}
              </span>
            </div>
          )}

          {/* Low stock badge (deterministic from product ID — marketing feature) */}
          {product.inStock && [2,3,4,5,7,11].includes(product.id % 13) && (
            <div className="absolute top-3 ltr:right-3 rtl:left-3 z-20">
              <span className="bg-background/90 border border-destructive/60 text-destructive text-[8px] tracking-widest uppercase px-2 py-1 font-bold flex items-center gap-1">
                🔥 {t(`متبقي ${(product.id % 4) + 2} فقط`, `Only ${(product.id % 4) + 2} left`)}
              </span>
            </div>
          )}

          {/* Out of stock */}
          {!product.inStock && (
            <div className="absolute inset-0 z-20 bg-background/70 flex items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase border border-border px-4 py-2 text-muted-foreground bg-background/80">
                {t("نفذ المخزون", "Out of Stock")}
              </span>
            </div>
          )}

          {/* Hover action buttons */}
          <AnimatePresence>
            {hovered && product.inStock && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                className="absolute bottom-0 left-0 right-0 z-30 p-4 flex gap-2"
              >
                <button
                  onClick={handleQuickAdd}
                  disabled={addToCart.isPending}
                  className="flex-1 btn-gold-shimmer flex items-center justify-center gap-2 h-11 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase font-bold transition-all hover:brightness-110 active:scale-95"
                  style={{ boxShadow: "0 0 16px hsl(43 90% 50% / 0.35)" }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {addToCart.isPending ? t("...", "...") : t("أضف للسلة", "Add to Cart")}
                </button>
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center justify-center h-11 w-11 border border-primary/60 text-primary bg-background/80 hover:bg-primary/15 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom info — always visible */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-16 transition-all duration-300">
            <p className="text-[9px] tracking-[0.25em] uppercase text-primary/70 mb-1">
              {t(product.categoryNameAr ?? "", product.categoryNameEn ?? "")}
            </p>
          </div>
        </div>

        {/* Info below image */}
        <div
          className="px-1 pt-3 pb-4 bg-card border-x border-b border-border transition-all duration-300"
          style={{
            borderColor: hovered ? "hsl(43 90% 50% / 0.4)" : undefined,
          }}
        >
          <h3 className="font-semibold text-foreground tracking-wide leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-1 px-2">
            {t(product.nameAr, product.nameEn)}
          </h3>
          <div className="flex items-center justify-between mt-2 px-2">
            <span className="text-primary font-bold text-xl tracking-tight">
              {product.basePrice.toFixed(0)}
              <span className="text-sm font-normal mr-1 text-primary/70"> {t(siteConfig.delivery.currencyAr, siteConfig.delivery.currencyEn)}</span>
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-primary text-xs">★</span>
                <span className="text-[10px] text-muted-foreground">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Products() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const params = {
    search: search || undefined,
    categoryId: selectedCategory ?? undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  };

  const { data: products, isLoading } = useListProducts(params);
  const { data: categories } = useListCategories();

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = search || selectedCategory || minPrice || maxPrice;

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Page Header */}
      <div className="relative py-20 border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 60% 80% at 50% 120%, hsl(43 90% 50% / 0.12) 0%, transparent 65%)" }} />
        </div>
        <div className="container mx-auto px-4 max-w-screen-2xl text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary tracking-[0.35em] uppercase text-[10px] mb-5"
          >
            {t("مجموعتنا الفاخرة", "Our Premium Collection")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-calligraphic text-5xl md:text-7xl gold-shimmer mb-4"
          >
            {t("المنتجات", "Products")}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="gold-divider w-28 mx-auto"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-2xl py-10">

        {/* Search + Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t("ابحث عن منتج...", "Search products...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ltr:pl-10 rtl:pr-10 bg-card border-border h-12 text-foreground placeholder:text-muted-foreground focus:border-primary/60 transition-colors"
              data-testid="input-search"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 px-6 border-border gap-2 transition-all ${showFilters ? "border-primary text-primary bg-accent" : ""}`}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{t("فلترة", "Filter")}</span>
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-12 px-4 text-muted-foreground hover:text-destructive"
              data-testid="button-clear-filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-6 bg-card border border-border grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">{t("السعر من", "Min Price")}</p>
                  <Input
                    type="number"
                    placeholder={t("من", "From")}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-background border-border h-10"
                    data-testid="input-min-price"
                  />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">{t("السعر إلى", "Max Price")}</p>
                  <Input
                    type="number"
                    placeholder={t("إلى", "To")}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-background border-border h-10"
                    data-testid="input-max-price"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills — single horizontal scrollable row */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-5 py-2 text-[10px] tracking-widest uppercase border transition-all duration-200 ${!selectedCategory ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_hsl(43_90%_50%/0.35)]" : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"}`}
          >
            {t("الكل", "All")}
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 text-[10px] tracking-widest uppercase border transition-all duration-200 ${selectedCategory === cat.id ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_hsl(43_90%_50%/0.35)]" : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"}`}
            >
              {t(cat.nameAr, cat.nameEn)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-0">
                <Skeleton className="w-full" style={{ aspectRatio: "3/4" }} />
                <Skeleton className="h-16 w-full mt-0 rounded-none" />
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-5xl mb-6">🪨</p>
            <p className="text-muted-foreground text-lg tracking-wide">{t("لا توجد منتجات تطابق البحث", "No products match your search")}</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-6 text-primary text-sm underline-offset-4 hover:underline">
                {t("إلغاء الفلاتر", "Clear filters")}
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Result count */}
            {hasFilters && products && (
              <p className="text-xs text-muted-foreground mb-4 tracking-widest">
                {t(`${products.length} منتج`, `${products.length} products`)}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products?.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
