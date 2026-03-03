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
} from "lucide-react";
import { ReactNode } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Tables", path: "/pos/tables", roles: ["admin", "manager", "cashier"] },
  { icon: ClipboardList, label: "Orders", path: "/pos/orders", roles: ["admin", "manager", "cashier"] },
  { icon: Utensils, label: "Menu", path: "/pos/menu", roles: ["admin", "manager"] },
  { icon: BarChart3, label: "Analytics", path: "/pos/analytics", roles: ["admin", "manager"] },
  { icon: FileText, label: "Reports", path: "/pos/reports", roles: ["admin", "manager"] },
  { icon: Users, label: "Staff", path: "/pos/staff", roles: ["admin"] },
  { icon: ShieldCheck, label: "Audit Log", path: "/pos/audit", roles: ["admin"] },
  { icon: Settings, label: "Settings", path: "/pos/settings", roles: ["admin"] },
];

interface POSLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function POSLayout({ children, title }: POSLayoutProps) {
  const { user, logout } = useAuth();
  const { activeTenant, tenants, setActiveTenant, role } = useTenant();
  const [location, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      navigate("/");
    },
  });

  const visibleNav = NAV_ITEMS.filter((item) => role && item.roles.includes(role));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border/50 bg-sidebar">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span
              className="font-bold text-sidebar-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Flowtech
            </span>
          </div>
        </div>

        {/* Tenant Switcher */}
        {activeTenant && (
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

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {visibleNav.map((item) => {
            const isActive = location.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2 px-2 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-medium truncate">{user?.name ?? "User"}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                </div>
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
