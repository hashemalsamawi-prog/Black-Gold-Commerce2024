import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSubmitWholesaleInquiry } from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle } from "lucide-react";

const wholesaleSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  productInterest: z.string().min(3),
  estimatedQuantity: z.string().min(1),
  message: z.string().optional(),
});

type WholesaleForm = z.infer<typeof wholesaleSchema>;

export default function Wholesale() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const submitInquiry = useSubmitWholesaleInquiry();

  const form = useForm<WholesaleForm>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      productInterest: "",
      estimatedQuantity: "",
      message: "",
    },
  });

  const onSubmit = (data: WholesaleForm) => {
    submitInquiry.mutate(
      { data: { ...data, message: data.message || null } },
      { onSuccess: () => setSubmitted(true) }
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(45 93% 47%) 0%, transparent 60%)" }} />
        </div>
        <div className="container mx-auto px-4 max-w-screen-2xl relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4"
          >
            {t("شراكات الأعمال", "Business Partnerships")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-wider gold-shimmer max-w-2xl"
          >
            {t("الذهب الأسود للجملة", "Black Gold Wholesale")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-6 max-w-xl text-lg"
          >
            {t(
              "هل أنت تاجر أو موزع؟ تواصل معنا للحصول على أسعار خاصة للكميات الكبيرة وأفضل المنتجات.",
              "Are you a merchant or distributor? Contact us for special pricing on large quantities and premium products."
            )}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-xl py-16">
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { ar: "أسعار الجملة", en: "Wholesale Pricing", descAr: "أسعار تنافسية للكميات الكبيرة", descEn: "Competitive rates for large volumes" },
            { ar: "دعم مخصص", en: "Dedicated Support", descAr: "مدير حساب خاص لكل عميل", descEn: "Dedicated account manager for each client" },
            { ar: "توصيل أولوي", en: "Priority Shipping", descAr: "شحن سريع ومنتظم لطلباتك", descEn: "Fast and regular delivery for your orders" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-8"
            >
              <div className="w-10 h-10 border border-primary flex items-center justify-center mb-4">
                <span className="text-primary font-bold">0{i + 1}</span>
              </div>
              <h3 className="font-bold tracking-wide mb-2">{t(item.ar, item.en)}</h3>
              <p className="text-muted-foreground text-sm">{t(item.descAr, item.descEn)}</p>
            </motion.div>
          ))}
        </div>

        {/* Form / Success */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-16"
          >
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold tracking-wider mb-4">
              {t("تم إرسال طلبك", "Inquiry Submitted")}
            </h2>
            <p className="text-muted-foreground">
              {t("سيتواصل معك فريقنا خلال 24 ساعة", "Our team will contact you within 24 hours")}
            </p>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-10"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h2 className="text-sm tracking-widest uppercase text-primary">
                  {t("نموذج طلب الجملة", "Wholesale Inquiry Form")}
                </h2>
                <a
                  href="mailto:blackgold.ye@gmail.com"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  blackgold.ye@gmail.com
                </a>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("اسم الشركة", "Company Name")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-border h-12" data-testid="input-company-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contactName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("اسم المسؤول", "Contact Name")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-border h-12" data-testid="input-contact-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("البريد الإلكتروني", "Email")}</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="bg-background border-border h-12" data-testid="input-wholesale-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("رقم الجوال", "Phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" className="bg-background border-border h-12" data-testid="input-wholesale-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="productInterest" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("المنتج المطلوب", "Product Interest")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-border h-12" placeholder={t("مثل: تمور، عسل...", "e.g. Dates, Honey...")} data-testid="input-product-interest" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="estimatedQuantity" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("الكمية التقريبية", "Estimated Quantity")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background border-border h-12" placeholder={t("مثل: 100 كرتون شهرياً", "e.g. 100 boxes/month")} data-testid="input-quantity" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("رسالة إضافية", "Additional Message")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} className="bg-background border-border resize-none" data-testid="input-message" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button
                    type="submit"
                    disabled={submitInquiry.isPending}
                    className="w-full h-14 bg-primary text-primary-foreground text-sm tracking-widest uppercase"
                    data-testid="button-submit-wholesale"
                  >
                    {submitInquiry.isPending ? t("جاري الإرسال...", "Submitting...") : t("إرسال الطلب", "Submit Inquiry")}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
