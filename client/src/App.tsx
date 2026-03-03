import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TenantProvider, useTenant } from "./contexts/TenantContext";
import { useAuth } from "./_core/hooks/useAuth";
import { getLoginUrl } from "./const";
import { useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Tables from "./pages/pos/Tables";
import OrderNew from "./pages/pos/OrderNew";
import Orders from "./pages/pos/Orders";
import Menu from "./pages/pos/Menu";
import Analytics from "./pages/pos/Analytics";
import Reports from "./pages/pos/Reports";
import AuditLog from "./pages/pos/AuditLog";
import Staff from "./pages/pos/Staff";
import Settings from "./pages/pos/Settings";

// Guard: redirect to login if not authenticated
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse" />
          <div className="text-sm text-muted-foreground">Loading Flowtech...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

// Guard: redirect to onboarding if no tenant
function TenantGuard({ children }: { children: React.ReactNode }) {
  const { tenants, isLoading } = useTenant();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && tenants.length === 0) {
      navigate("/onboarding");
    }
  }, [isLoading, tenants]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading your workspace...</div>
      </div>
    );
  }

  if (tenants.length === 0) return null;
  return <>{children}</>;
}

function POSRouter() {
  return (
    <TenantGuard>
      <Switch>
        <Route path="/pos/tables" component={Tables} />
        <Route path="/pos/orders/new" component={OrderNew} />
        <Route path="/pos/orders" component={Orders} />
        <Route path="/pos/menu" component={Menu} />
        <Route path="/pos/analytics" component={Analytics} />
        <Route path="/pos/reports" component={Reports} />
        <Route path="/pos/audit" component={AuditLog} />
        <Route path="/pos/staff" component={Staff} />
        <Route path="/pos/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </TenantGuard>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding">
        <AuthGuard>
          <Onboarding />
        </AuthGuard>
      </Route>
      <Route path="/pos/:rest*">
        <AuthGuard>
          <TenantProvider>
            <POSRouter />
          </TenantProvider>
        </AuthGuard>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
