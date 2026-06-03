import { Navbar } from "./navbar";
import { useLang } from "@/contexts/LanguageContext";
const logoImg = "/brand/logo-transparent.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLang();

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-16">
        <div className="container px-4 md:px-8 mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImg} alt="Black Gold" className="h-12 w-12 object-cover object-top" />
                <div>
                  <span className="text-lg font-bold tracking-[0.2em] uppercase gold-shimmer block leading-none">
                    {t("الذهب الأسود", "BLACK GOLD")}
                  </span>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                    {t("حلول متميزة وتوصيل", "Premium & Delivery Solutions")}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {t(
                  "فحم شيشة فاخر بجودة لا مثيل لها. اشتعال سريع، احتراق طويل، وبدون روائح.",
                  "Premium hookah charcoal of unrivaled quality. Quick ignition, long-lasting burn, odorless."
                )}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-primary mb-4">{t("تسوق", "Shop")}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/products" className="hover:text-primary transition-colors">{t("جميع المنتجات", "All Products")}</a></li>
                <li><a href="/products?category=1" className="hover:text-primary transition-colors">{t("فحم بلدي", "Local Charcoal")}</a></li>
                <li><a href="/products?category=2" className="hover:text-primary transition-colors">{t("فحم فاخر", "Premium Charcoal")}</a></li>
                <li><a href="/wholesale" className="hover:text-primary transition-colors">{t("الجملة", "Wholesale")}</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-primary mb-4">{t("حسابي", "Account")}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/account/login" className="hover:text-primary transition-colors">{t("تسجيل الدخول", "Sign In")}</a></li>
                <li><a href="/account/orders" className="hover:text-primary transition-colors">{t("طلباتي", "My Orders")}</a></li>
                <li><a href="/cart" className="hover:text-primary transition-colors">{t("سلة التسوق", "Cart")}</a></li>
              </ul>
            </div>
          </div>
          <div className="gold-divider mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs tracking-widest">
              © {new Date().getFullYear()} {t("الذهب الأسود. جميع الحقوق محفوظة.", "BLACK GOLD. ALL RIGHTS RESERVED.")}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="mailto:blackgold.ye@gmail.com"
                className="text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-email-footer"
              >
                blackgold.ye@gmail.com
              </a>
              <span className="hidden sm:block text-border">|</span>
              <a
                href="https://wa.me/+966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-whatsapp-footer"
              >
                {t("تواصل معنا عبر واتساب", "Contact us on WhatsApp")}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp — premium charcoal + gold ring */}
      <a
        href="https://wa.me/+966500000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex h-14 w-14 items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #0e0e0e 0%, #1a1a1a 100%)",
          borderRadius: "50%",
          boxShadow: "0 0 0 1.5px hsl(43 90% 50% / 0.7), 0 0 18px hsl(43 90% 50% / 0.25), 0 4px 20px rgba(0,0,0,0.6)",
        }}
        data-testid="button-whatsapp"
        aria-label={t("تواصل معنا واتساب", "WhatsApp us")}
      >
        <svg
          className="h-6 w-6 transition-all duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          style={{ fill: "hsl(43 90% 50%)" }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
