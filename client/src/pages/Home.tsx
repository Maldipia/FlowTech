import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutGrid,
  Lock,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Multi-Tenant Architecture",
    desc: "Complete data isolation per business. Each tenant operates in a fully secured environment with PostgreSQL Row-Level Security.",
  },
  {
    icon: Utensils,
    title: "Intuitive POS Interface",
    desc: "Streamlined order-taking with table management, modifier support, and real-time kitchen updates.",
  },
  {
    icon: CreditCard,
    title: "Stripe-Powered Payments",
    desc: "PCI DSS compliant card processing. Accept cash, card, GCash, Maya, and bank transfers.",
  },
  {
    icon: FileText,
    title: "BIR Compliance Built-In",
    desc: "Automated official receipt generation, immutable transaction logs, and end-of-day Z-Reports.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live sales dashboards, top-selling items, hourly heatmaps, and comprehensive reporting.",
  },
  {
    icon: Users,
    title: "Role-Based Access Control",
    desc: "Admin, Manager, and Cashier roles with granular permissions protecting your business data.",
  },
  {
    icon: ShieldCheck,
    title: "Audit Trail",
    desc: "Every action is logged with user, timestamp, and context. Full accountability for every transaction.",
  },
  {
    icon: Store,
    title: "F&B Ready",
    desc: "Designed for restaurants, cafes, bars, food trucks, and every type of food & beverage business.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "₱999",
    period: "/mo",
    desc: "Perfect for single-location cafes and food stalls.",
    features: ["1 Location", "Up to 3 Staff", "Menu Management", "Basic Reports", "BIR Receipts", "Email Support"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₱2,499",
    period: "/mo",
    desc: "For growing restaurants that need more power.",
    features: [
      "Up to 3 Locations",
      "Unlimited Staff",
      "Advanced Analytics",
      "Z-Report Generation",
      "Stripe Payments",
      "Priority Support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For chains and large F&B groups.",
    features: [
      "Unlimited Locations",
      "Dedicated Support",
      "Custom Integrations",
      "SLA Guarantee",
      "On-site Training",
      "White-label Option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)" }}>
              Flowtech
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#compliance" className="hover:text-foreground transition-colors">Compliance</a>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} size="sm">
                Go to Dashboard <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
                <Button size="sm" asChild>
                  <a href={getLoginUrl()}>
                    Get Started <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-primary/5 blur-[80px] rounded-full" />
        </div>

        <div className="container relative text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1.5" />
            BIR Compliant · PCI Secure · Multi-Tenant
          </Badge>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)" }}
          >
            The POS Platform
            <br />
            <span className="text-primary">F&B Businesses</span>
            <br />
            Actually Love
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Flowtech is a modern, multi-tenant SaaS POS system built for Philippine food & beverage businesses.
            BIR-compliant receipts, real-time analytics, and enterprise-grade security — all in one elegant platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href={getLoginUrl()}>
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border/60">
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            {["No credit card required", "14-day free trial", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-border/60 text-muted-foreground">Features</Badge>
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)" }}
            >
              Everything Your Business Needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From order taking to BIR compliance, Flowtech covers every aspect of running a modern F&B business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIR Compliance Section ── */}
      <section id="compliance" className="py-24 border-t border-border/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10">
                BIR Compliance
              </Badge>
              <h2
                className="text-4xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)" }}
              >
                Built for Philippine Tax Compliance
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Flowtech is designed from the ground up to meet Bureau of Internal Revenue (BIR) requirements
                for POS systems in the Philippines. Every transaction is recorded, receipts are properly formatted,
                and end-of-day reports are generated automatically.
              </p>
              <div className="space-y-4">
                {[
                  "Official receipts with all required BIR fields",
                  "Sequential, immutable receipt numbering",
                  "End-of-day Z-Report generation",
                  "Void and refund audit trails",
                  "12% VAT calculation and reporting",
                  "Electronic Invoicing System (EIS) ready",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-[60px] rounded-full" />
              <div className="relative bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Official Receipt</div>
                    <div className="text-xs text-muted-foreground">BIR Compliant</div>
                  </div>
                  <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs">Valid</Badge>
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>FLOWTECH POS</span>
                    <span>flowtech.ph</span>
                  </div>
                  <div className="text-xs text-muted-foreground">TIN: 123-456-789-000</div>
                  <div className="text-xs text-muted-foreground">PTU No: FT-2026-001</div>
                  <div className="border-t border-border/50 my-2" />
                  <div className="flex justify-between"><span>Subtotal</span><span>₱450.00</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>VAT (12%)</span><span>₱54.00</span></div>
                  <div className="flex justify-between font-bold text-primary"><span>TOTAL</span><span>₱504.00</span></div>
                  <div className="border-t border-border/50 my-2" />
                  <div className="text-xs text-muted-foreground text-center">Receipt No: FT-1-00000001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="py-16 border-t border-border/50 bg-card/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Enterprise-Grade Security</div>
                <div className="text-sm text-muted-foreground">Your data is protected at every layer</div>
              </div>
            </div>
            {[
              { label: "Data Isolation", value: "PostgreSQL RLS" },
              { label: "Payments", value: "PCI DSS via Stripe" },
              { label: "Encryption", value: "TLS 1.3" },
              { label: "Compliance", value: "DPA 2012 (PH)" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-semibold text-primary text-sm">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-border/60 text-muted-foreground">Pricing</Badge>
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)" }}
            >
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">Start free. Scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border transition-all duration-200 ${
                  plan.highlighted
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3">
                    Most Popular
                  </Badge>
                )}
                <div className="mb-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <a href={getLoginUrl()}>{plan.cta}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-border/50">
        <div className="container text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
            <div className="relative">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)" }}
              >
                Ready to Transform Your F&B Business?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join hundreds of Philippine restaurants, cafes, and bars already running on Flowtech.
              </p>
              <Button size="lg" className="h-12 px-10 text-base" asChild>
                <a href={getLoginUrl()}>
                  Get Started Today
                  <ChevronRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Flowtech</span>
            <span>— F&B POS Platform</span>
          </div>
          <div>© 2026 Flowtech. All rights reserved. flowtech.ph</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
