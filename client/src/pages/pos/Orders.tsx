import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ClipboardList, Plus, RefreshCw, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-muted text-muted-foreground border-border",
  voided: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Orders() {
  const { tenantId, role } = useTenant();
  const [, navigate] = useLocation();
  const [voidOrderId, setVoidOrderId] = useState<number | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [viewOrder, setViewOrder] = useState<number | null>(null);

  const { data: activeOrders = [], refetch } = trpc.orders.getActive.useQuery(
    { tenantId: tenantId! },
    { enabled: !!tenantId, refetchInterval: 10000 }
  );

  const { data: recentOrders = [] } = trpc.orders.getRecent.useQuery(
    { tenantId: tenantId!, limit: 30 },
    { enabled: !!tenantId }
  );

  const { data: orderDetails } = trpc.orders.getWithItems.useQuery(
    { orderId: viewOrder!, tenantId: tenantId! },
    { enabled: !!viewOrder && !!tenantId }
  );

  const voidMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Order voided");
      setVoidOrderId(null);
      setVoidReason("");
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <POSLayout title="Orders">
      <div className="p-6 space-y-6">
        {/* Active Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Active Orders
              <Badge variant="outline" className="text-xs">{activeOrders.length}</Badge>
            </h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => navigate("/pos/orders/new")}>
                <Plus className="w-4 h-4 mr-1.5" />
                New Order
              </Button>
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border/50 rounded-xl">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No active orders</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-border/50 bg-card hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm">Order #{order.id}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {order.orderType?.replace("_", " ")}
                        {order.tableId && ` · Table ${order.tableId}`}
                      </div>
                    </div>
                    <Badge className={`text-[10px] border ${STATUS_COLORS[order.status] ?? ""}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-primary mb-3">
                    ₱{parseFloat(String(order.totalAmount || 0)).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {new Date(order.createdAt).toLocaleTimeString("en-PH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs"
                      onClick={() => setViewOrder(order.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {(role === "admin" || role === "manager") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => setVoidOrderId(order.id)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="font-semibold mb-4 text-muted-foreground">Recent Orders</h2>
          <div className="border border-border/50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Total</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {order.orderType?.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] border ${STATUS_COLORS[order.status] ?? ""}`}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-primary">
                      ₱{parseFloat(String(order.totalAmount || 0)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleString("en-PH", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setViewOrder(order.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{viewOrder}</DialogTitle>
          </DialogHeader>
          {orderDetails && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className={`text-[10px] border ${STATUS_COLORS[orderDetails.status] ?? ""}`}>
                  {orderDetails.status}
                </Badge>
              </div>
              <div className="space-y-2">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="text-primary">₱{parseFloat(String(item.totalPrice)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/50 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₱{parseFloat(String(orderDetails.subtotal || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>VAT (12%)</span>
                  <span>₱{parseFloat(String(orderDetails.taxAmount || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-primary">
                  <span>Total</span>
                  <span>₱{parseFloat(String(orderDetails.totalAmount || 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Void Dialog */}
      <Dialog open={!!voidOrderId} onOpenChange={(o) => !o && setVoidOrderId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Void Order #{voidOrderId}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>Reason for voiding (required)</Label>
            <Textarea
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="Enter reason..."
              className="mt-1.5"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidOrderId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!voidReason.trim() || voidMutation.isPending}
              onClick={() =>
                voidMutation.mutate({
                  orderId: voidOrderId!,
                  tenantId: tenantId!,
                  status: "voided",
                  voidReason,
                })
              }
            >
              {voidMutation.isPending ? "Voiding..." : "Void Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </POSLayout>
  );
}
