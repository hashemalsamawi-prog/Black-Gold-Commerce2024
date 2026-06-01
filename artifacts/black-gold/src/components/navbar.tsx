import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Globe, Menu, X } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useCartSession } from "@/hooks/use-cart-session";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "./ui/button";
const logoImg = "/brand/logo-transparent.png";

export function Navbar() {
  const { lang, setLang, t } = useLang();
  const { isAuthenticated } = useAuth();
  const sessionId = useCartSession();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const navLinks = [
    { href: "/products", ar: "المنتجات", en: "Products" },
    { href: "/wholesale", ar: "الجملة", en: "Wholesale" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/90 backdrop-blur-md"
      style={{ boxShadow: "0 1px 0 hsl(43 90% 50% / 0.12), 0 4px 24px hsl(0 0% 0% / 0.5)" }}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-8 flex-shrink-0" data-testid="link-logo">
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Black Gold Logo"
              className="h-10 w-auto object-contain drop-shadow-[0_0_6px_hsl(43_90%_50%/0.4)]"
              style={{ maxWidth: "44px" }}
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm tracking-[0.25em] uppercase gold-shimmer">
                {t("الذهب الأسود", "BLACK GOLD")}
              </span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-primary/50 mt-0.5">
                {t("حلول متميزة", "Premium & Delivery")}
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-widest uppercase transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-primary/55"}`}
            >
              {t(link.ar, link.en)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Language */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="h-9 px-3 text-xs tracking-widest uppercase text-primary/60 hover:text-primary hover:bg-primary/8"
            data-testid="button-toggle-language"
          >
            <Globe className="h-4 w-4 mr-1.5" />
            {lang === "ar" ? "EN" : "AR"}
          </Button>

          {/* Account */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation(isAuthenticated ? "/account/orders" : "/account/login")}
            className="h-9 w-9 text-primary/60 hover:text-primary hover:bg-primary/8"
            data-testid="button-account"
          >
            <User className="h-4 w-4" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/cart")}
            className="h-9 w-9 relative text-primary/60 hover:text-primary hover:bg-primary/8"
            data-testid="button-cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <AnimatePresence>
              {cart && cart.itemCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground font-bold shadow-[0_0_6px_hsl(43_90%_50%/0.6)]"
                  data-testid="text-cart-count"
                >
                  {cart.itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden text-primary/60 hover:text-primary hover:bg-primary/8"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => { setLocation(link.href); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                >
                  {t(link.ar, link.en)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
