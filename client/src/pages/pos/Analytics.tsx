import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, ShoppingBag, CreditCard, Receipt, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";

export default function Analytics() {
  const { tenantId } = useTenant();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  }, []);

  const { data: dailySummary, isLoading: loadingDaily, refetch } = trpc.reports.dailySummary.useQuery(
    { tenantId: tenantId!, date: today },
    { enabled: !!tenantId }
  );

  const { data: topItems = [], isLoading: loadingTop } = trpc.reports.topItems.useQuery(
    { tenantId: tenantId!, from: weekAgo, to: today, limit: 5 },
    { enabled: !!tenantId }
  );

  const isLoading = loadingDaily || loadingTop;

  const METRIC_CARDS = [
    {
      label: "Today's Revenue",
      value: `₱${parseFloat(String(dailySummary?.totalSales ?? 0)).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Orders",
      value: String(dailySummary?.totalTransactions ?? 0),
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Cash Sales",
      value: `₱${parseFloat(String(dailySummary?.cashSales ?? 0)).toFixed(2)}`,
      icon: CreditCard,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "VAT Collected",
      value: `₱${(parseFloat(String(dailySummary?.totalSales ?? 0)) - parseFloat(String(dailySummary?.totalSales ?? 0)) / 1.12).toFixed(2)}`,
      icon: Receipt,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <POSLayout title="Analytics">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Today's Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRIC_CARDS.map((card) => (
            <div key={card.label} className="p-5 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              {isLoading ? (
                <div className="h-7 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Payment Breakdown */}
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h3 className="text-sm font-semibold mb-4">Payment Breakdown (Today)</h3>
            {isLoading ? (
              <div className="h-40 bg-muted/30 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={[
                    { method: "Cash", amount: parseFloat(String(dailySummary?.cashSales ?? 0)) },
                    { method: "Card", amount: parseFloat(String(dailySummary?.cardSales ?? 0)) },
                    { method: "Other", amount: Math.max(0, parseFloat(String(dailySummary?.totalSales ?? 0)) - parseFloat(String(dailySummary?.cashSales ?? 0)) - parseFloat(String(dailySummary?.cardSales ?? 0))) },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="method" tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v) => `₱${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number) => [`₱${v.toFixed(2)}`, "Amount"]}
                  />
                  <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top Items */}
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h3 className="text-sm font-semibold mb-4">Top Selling Items (7 Days)</h3>
            {loadingTop ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-muted/30 animate-pulse rounded" />
                ))}
              </div>
            ) : topItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No sales data yet</div>
            ) : (
              <div className="space-y-3">
                {topItems.map((item, i) => {
                  const maxQty = topItems[0]?.totalQuantity ?? 1;
                  const pct = Math.round((item.totalQuantity / maxQty) * 100);
                  const colors = ["bg-primary", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400"];
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium truncate">{item.name}</span>
                        <span className="text-muted-foreground ml-2 flex-shrink-0">
                          {item.totalQuantity} sold · ₱{parseFloat(String(item.totalRevenue)).toFixed(0)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors[i % colors.length]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Daily Summary Details */}
        {dailySummary && (
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h3 className="text-sm font-semibold mb-4">Daily Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Gross Sales</div>
                <div className="font-bold">₱{parseFloat(String(dailySummary.totalSales)).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">VAT Amount (12%)</div>
                <div className="font-bold">₱{(parseFloat(String(dailySummary.totalSales)) - parseFloat(String(dailySummary.totalSales)) / 1.12).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Net Sales (ex-VAT)</div>
                <div className="font-bold">
                  ₱{(parseFloat(String(dailySummary.totalSales)) / 1.12).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Transactions</div>
                <div className="font-bold">{dailySummary.totalTransactions}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </POSLayout>
  );
}
