import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/layout";
import { SplashScreen } from "@/components/splash-screen";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import Wholesale from "@/pages/wholesale";
import AccountLogin from "@/pages/account-login";
import AccountRegister from "@/pages/account-register";
import AccountOrders from "@/pages/account-orders";
import AccountOrderDetail from "@/pages/account-order-detail";
import Tracking from "@/pages/tracking";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation/:id" component={OrderConfirmation} />
        <Route path="/wholesale" component={Wholesale} />
        <Route path="/account/login" component={AccountLogin} />
        <Route path="/account/register" component={AccountRegister} />
        <Route path="/account/orders" component={AccountOrders} />
        <Route path="/account/orders/:id" component={AccountOrderDetail} />
        <Route path="/tracking" component={Tracking} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <SplashScreen />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
