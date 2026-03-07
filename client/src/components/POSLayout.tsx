import { useAuth } from "@/_core/hooks/useAuth";
import { useTenant } from "@/contexts/TenantContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldCheck,
  Store,
  Users,
  Utensils,
  Zap,
  Menu,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

// ── Categorized Navigation ──────────────────────────────────────────────────
const NAV_CATEGORIES = [
  {
    label: "Operations",
    items: [
      { icon: LayoutGrid, label: "Tables", path: "/pos/tables", roles: ["admin", "manager", "cashier"] },
      { icon: ClipboardList, label: "Orders", path: "/pos/orders", roles: ["admin", "manager", "cashier"] },
      { icon: Utensils, label: "Menu", path: "/pos/menu", roles: ["admin", "manager"] },
    ],
  },
  {
    label: "Insights",
    items: [
      { icon: BarChart3, label: "Analytics", path: "/pos/analytics", roles: ["admin", "manager"] },
      { icon: FileText, label: "Reports", path: "/pos/reports", roles: ["admin", "manager"] },
    ],
  },
  {
    label: "Administration",
    items: [
      { icon: Users, label: "Staff", path: "/pos/staff", roles: ["admin"] },
      { icon: ShieldCheck, label: "Audit Log", path: "/pos/audit", roles: ["admin"] },
      { icon: Settings, label: "Settings", path: "/pos/settings", roles: ["admin"] },
    ],
  },
];

interface POSLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function POSLayout({ children, title }: POSLayoutProps) {
  const { user, logout } = useAuth();
  const { activeTenant, tenants, setActiveTenant, role } = useTenant();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      navigate("/");
    },
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col border-r border-border/50 bg-sidebar transition-all duration-200",
          sidebarOpen ? "w-56" : "w-14"
        )}
      >
        {/* Logo + Toggle */}
        <div className="h-14 flex items-center px-3 border-b border-sidebar-border justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span
                className="font-bold text-sidebar-foreground truncate"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Flowtech
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors flex-shrink-0"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Tenant Switcher */}
        {activeTenant && sidebarOpen && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto py-2 px-2 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Store className="w-3 h-3 text-primary" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-medium truncate">{activeTenant.tenant.name}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{role}</div>
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {tenants.map((t) => (
                  <DropdownMenuItem
                    key={t.tenant.id}
                    onClick={() => setActiveTenant(t)}
                    className="flex items-center gap-2"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span className="truncate">{t.tenant.name}</span>
                    {t.tenant.id === activeTenant.tenant.id && (
                      <Badge className="ml-auto text-[10px] h-4 px-1">Active</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                  + Add Business
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Collapsed tenant icon */}
        {activeTenant && !sidebarOpen && (
          <div className="px-2 py-3 border-b border-sidebar-border flex justify-center">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center" title={activeTenant.tenant.name}>
              <Store className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}

        {/* Categorized Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
          {NAV_CATEGORIES.map((category) => {
            const visibleItems = category.items.filter(
              (item) => role && item.roles.includes(role)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={category.label}>
                {/* Category Label */}
                {sidebarOpen && (
                  <div className="px-3 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
                      {category.label}
                    </span>
                  </div>
                )}
                {!sidebarOpen && (
                  <div className="border-t border-sidebar-border/50 mx-2 mb-1" />
                )}

                {/* Items */}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = location.startsWith(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        title={!sidebarOpen ? item.label : undefined}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150",
                          !sidebarOpen && "justify-center px-2",
                          isActive
                            ? "bg-primary/15 text-primary font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 flex-shrink-0",
                            isActive ? "text-primary" : ""
                          )}
                        />
                        {sidebarOpen && item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-auto py-2 text-sidebar-foreground hover:bg-sidebar-accent",
                  sidebarOpen ? "justify-start gap-2 px-2" : "justify-center px-1"
                )}
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="text-left min-w-0">
                    <div className="text-xs font-medium truncate">{user?.name ?? "User"}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {title && (
          <header className="h-14 flex items-center px-6 border-b border-border/50 bg-background flex-shrink-0">
            <h1 className="text-base font-semibold">{title}</h1>
          </header>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
