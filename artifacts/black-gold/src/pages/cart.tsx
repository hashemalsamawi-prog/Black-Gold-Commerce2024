import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Flame } from "lucide-react";
import { siteConfig } from "@/data/config";
import {
  useGetCart,
  getGetCartQueryKey,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/contexts/LanguageContext";
import { useCartSession } from "@/hooks/use-cart-session";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cart() {
  const { t } = useLang();
  const sessionId = useCartSession();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: cart, isLoading } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
  };

  const handleUpdate = (itemId: number, qty: number) => {
    updateItem.mutate({ itemId, data: { sessionId, quantity: qty } }, { onSuccess: invalidateCart });
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate({ itemId, data: { sessionId } }, { onSuccess: invalidateCart });
  };

  const handleClear = () => {
    clearCart.mutate({ data: { sessionId } }, { onSuccess: invalidateCart });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-screen-xl py-16">
        <Skeleton className="h-8 w-48 mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full mb-4" />
        ))}
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border py-12">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-wider"
          >
            {t("سلة التسوق", "Shopping Cart")}
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-xl py-12">
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-30" />
            <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
              {t("السلة فارغة", "Your cart is empty")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("ابدأ التسوق من مجموعتنا الفاخرة", "Start shopping from our premium collection")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products">
                <Button className="bg-primary text-primary-foreground h-12 px-8 tracking-widest uppercase" data-testid="button-continue-shopping">
                  {t("تسوق الآن", "Shop Now")}
                </Button>
              </Link>
              <Link href="/products?sort=bestsellers">
                <Button variant="outline" className="h-12 px-8 tracking-widest uppercase border-primary/40 text-primary hover:bg-primary/10" data-testid="button-best-sellers">
                  🔥 {t("الأكثر مبيعاً", "Shop Best Sellers")}
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">
                  {cart.itemCount} {t("عنصر", "items")}
                </p>
                <button
                  onClick={handleClear}
                  className="text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors"
                  data-testid="button-clear-cart"
                >
                  {t("إفراغ السلة", "Clear cart")}
                </button>
              </div>

              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    className="flex gap-6 p-6 bg-card border border-border"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-background border border-border">
                      <img
                        src={item.imageUrl}
                        alt={t(item.productNameAr, item.productNameEn)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1">
                        {t(item.productNameAr, item.productNameEn)}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {t(item.variantNameAr, item.variantNameEn)}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => handleUpdate(item.id, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="h-8 w-10 flex items-center justify-center text-sm border-x border-border" data-testid={`text-qty-${item.id}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdate(item.id, item.quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-primary font-bold" data-testid={`text-item-price-${item.id}`}>
                          {Math.round(item.price * item.quantity).toLocaleString()} {t(siteConfig.delivery.currencyAr, siteConfig.delivery.currencyEn)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex-shrink-0 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border p-8 sticky top-24"
              >
                <h2 className="text-lg font-bold tracking-wider mb-6 pb-4 border-b border-border">
                  {t("ملخص الطلب", "Order Summary")}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("المجموع الفرعي", "Subtotal")}</span>
                    <span data-testid="text-subtotal">{cart.subtotal.toFixed(0)} {t("ر.س", "SAR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("رسوم التوصيل", "Delivery")}</span>
                    <span className="text-primary">
                      {cart.subtotal >= 500 ? t("مجاني", "Free") : `30 ${t("ر.س", "SAR")}`}
                    </span>
                  </div>
                  {cart.subtotal < 500 && (
                    <div className="p-3 bg-primary/5 border border-primary/20 text-xs text-primary text-center tracking-wide">
                      {t(`أضف ${(500 - cart.subtotal).toFixed(0)} ر.س للتوصيل المجاني 🎁`, `Add ${(500 - cart.subtotal).toFixed(0)} SAR for free delivery 🎁`)}
                    </div>
                  )}
                </div>

                <div className="gold-divider mb-6" />

                {/* 🔥 Upsell Banner */}
                {cart.subtotal < 400 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 border border-primary/30 bg-accent/30"
                  >
                    <div className="flex items-start gap-2">
                      <Flame className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">
                          {t("جلستك تستاهل أكثر!", "Your session deserves more!")}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {t("أضف عبوة 500 جرام إضافية واجعل جلستك مثالية طوال الليل!", "Add an extra 500g pack for a perfect session all night long!")}
                        </p>
                        <Link
                          href="/products"
                          className="inline-block mt-2 text-[10px] tracking-widest uppercase text-primary hover:underline"
                        >
                          {t("إضافة المزيد ←", "Add More →")}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between font-bold text-lg mb-8">
                  <span>{t("الإجمالي", "Total")}</span>
                  <span className="text-primary" data-testid="text-total">
                    {(cart.subtotal + (cart.subtotal >= 500 ? 0 : 30)).toFixed(0)} {t("ر.س", "SAR")}
                  </span>
                </div>

                <Button
                  onClick={() => setLocation("/checkout")}
                  className="w-full h-14 bg-primary text-primary-foreground text-sm tracking-widest uppercase gap-3"
                  data-testid="button-proceed-checkout"
                >
                  {t("إتمام الشراء", "Proceed to Checkout")}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Link href="/products" className="block text-center mt-4 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                  {t("متابعة التسوق", "Continue Shopping")}
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
