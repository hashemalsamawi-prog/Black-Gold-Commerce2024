import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginCustomer } from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, CheckCircle2 } from "lucide-react";

/* ─────────── Email/Password ─────────── */
const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور قصيرة"),
});
type LoginForm = z.infer<typeof loginSchema>;

/* ─────────── Phone OTP ─────────── */
const MOCK_OTP = "1234";

function PhoneOtpLogin() {
  const { t } = useLang();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, "").length < 9) {
      toast({ title: t("رقم الجوال غير صحيح", "Invalid phone number"), variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("otp");
      toast({ title: t("تم إرسال الرمز (تجريبي: 1234)", "Code sent (demo: 1234)") });
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }, 1500);
  };

  const handleOtpChange = (idx: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 3) inputRefs[idx + 1].current?.focus();
    if (next.every(d => d)) {
      const code = next.join("");
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        if (code === MOCK_OTP) {
          login("otp-" + Date.now(), { id: 9999, name: t("مستخدم جوال", "Phone User"), email: `phone@blackgold.ye`, phone });
          setLocation("/account/orders");
        } else {
          toast({ title: t("رمز غير صحيح. حاول مجدداً.", "Wrong code. Try again."), variant: "destructive" });
          setOtp(["", "", "", ""]);
          inputRefs[0].current?.focus();
        }
      }, 900);
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) inputRefs[idx - 1].current?.focus();
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">{t("رقم الجوال *", "Phone Number *")}</label>
              <div className="flex gap-2">
                <span className="flex items-center h-12 px-3 border border-border bg-accent text-sm text-muted-foreground flex-shrink-0">🇾🇪 +967</span>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="7XX XXX XXX"
                  className="bg-background border-border h-12 flex-1"
                  data-testid="input-otp-phone"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
              </div>
            </div>
            <Button onClick={handleSendOtp} disabled={sending} className="w-full h-14 bg-primary text-primary-foreground tracking-widest uppercase" data-testid="button-send-otp">
              {sending ? t("جاري الإرسال...", "Sending...") : t("إرسال رمز التحقق", "Send OTP Code")}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">{t("أدخل الرمز المرسل إلى", "Enter code sent to")}</p>
              <p className="font-bold text-primary tracking-widest">{phone}</p>
              <button onClick={() => { setStep("phone"); setOtp(["", "", "", ""]); }} className="text-xs text-muted-foreground hover:text-primary underline mt-2">
                {t("تغيير الرقم", "Change number")}
              </button>
            </div>
            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`w-14 h-14 text-center text-xl font-bold bg-background border-2 text-foreground focus:outline-none transition-all ${digit ? "border-primary" : "border-border"} ${verifying ? "opacity-50" : ""}`}
                  data-testid={`input-otp-digit-${idx}`}
                />
              ))}
            </div>
            {verifying && (
              <p className="text-center text-xs text-primary tracking-widest animate-pulse">{t("جاري التحقق...", "Verifying...")}</p>
            )}
            <p className="text-center text-xs text-muted-foreground">{t("لم يصلك الرمز؟", "Didn't receive the code?")}{" "}
              <button onClick={handleSendOtp} className="text-primary hover:underline">{t("إعادة الإرسال", "Resend")}</button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── Main Component ─────────── */
export default function AccountLogin() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const loginCustomer = useLoginCustomer();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("phone");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    loginCustomer.mutate(
      { data },
      {
        onSuccess: (session) => { login(session.token, session.customer); setLocation("/account/orders"); },
        onError: () => toast({ title: t("خطأ في تسجيل الدخول", "Login failed"), variant: "destructive" }),
      }
    );
  };

  const tabs = [
    { key: "phone", icon: Phone, ar: "جوال / OTP", en: "Phone / OTP" },
    { key: "email", icon: Mail,  ar: "بريد إلكتروني", en: "Email" },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">{t("مرحباً بك", "Welcome Back")}</p>
          <h1 className="text-3xl font-bold tracking-wider gold-shimmer">{t("تسجيل الدخول", "Sign In")}</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-widest uppercase transition-all ${
                  activeTab === tab.key ? "text-primary border-b-2 border-primary bg-accent/30" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {t(tab.ar, tab.en)}
              </button>
            ))}
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {activeTab === "phone" ? (
                <motion.div key="phone-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PhoneOtpLogin />
                </motion.div>
              ) : (
                <motion.div key="email-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("البريد الإلكتروني", "Email")}</FormLabel>
                          <FormControl><Input {...field} type="email" className="bg-background border-border h-12" data-testid="input-login-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-widest uppercase text-muted-foreground">{t("كلمة المرور", "Password")}</FormLabel>
                          <FormControl><Input {...field} type="password" className="bg-background border-border h-12" data-testid="input-login-password" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" disabled={loginCustomer.isPending} className="w-full h-14 bg-primary text-primary-foreground text-sm tracking-widest uppercase" data-testid="button-login">
                        {loginCustomer.isPending ? t("جاري الدخول...", "Signing in...") : t("دخول", "Sign In")}
                      </Button>
                    </form>
                  </Form>
                  <p className="text-sm text-muted-foreground mt-6 text-center">
                    {t("تجريبي:", "Demo:")} demo@blackgold.sa / demo123
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {t("ليس لديك حساب؟", "Don't have an account?")}{" "}
                <Link href="/account/register" className="text-primary hover:underline" data-testid="link-register">{t("إنشاء حساب", "Register")}</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
