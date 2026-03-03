import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  CheckCircle2,
} from "lucide-react";
import { BIRReceipt } from "@/components/BIRReceipt";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";

interface CartItem {
  menuItemId?: number;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: { groupName: string; optionName: string; priceDelta: string }[];
  notes?: string;
}

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "gcash", label: "GCash", icon: Smartphone },
  { id: "maya", label: "Maya", icon: Smartphone },
] as const;

export default function OrderNew() {
  const { tenantId } = useTenant();
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tableId = params.get("tableId") ? parseInt(params.get("tableId")!) : undefined;

  const [orderId, setOrderId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "gcash" | "maya">("cash");
  const [amountTendered, setAmountTendered] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [receiptData, setReceiptData] = useState<{ birReceiptNo: string; changeAmount: string | null } | null>(null);
  const [showFullReceipt, setShowFullReceipt] = useState(false);

  const { data: menuData = [] } = trpc.menu.getFullMenu.useQuery(
    { tenantId: tenantId! },
    { enabled: !!tenantId }
  );

  const createOrderMutation = trpc.orders.create.useMutation();
  const addItemMutation = trpc.orders.addItem.useMutation();
  const processPaymentMutation = trpc.payments.process.useMutation();

  // Auto-create order on mount
  useEffect(() => {
    if (!tenantId || orderId) return;
    createOrderMutation.mutate(
      { tenantId, tableId, orderType: tableId ? "dine_in" : "takeout" },
      {
        onSuccess: (order) => {
          if (order) setOrderId(order.id);
        },
        onError: (e) => toast.error("Failed to create order: " + e.message),
      }
    );
  }, [tenantId]);

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxAmount = subtotal * 0.12;
  const totalAmount = subtotal + taxAmount;
  const change = amountTendered ? Math.max(0, parseFloat(amountTendered) - totalAmount) : 0;

  const filteredMenu = useMemo(() => {
    return menuData
      .filter((cat) => !activeCategory || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menuData, activeCategory, searchQuery]);

  const addToCart = (item: { id: number; name: string; price: string }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id && c.modifiers.length === 0);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id && c.modifiers.length === 0
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          unitPrice: parseFloat(item.price),
          quantity: 1,
          modifiers: [],
        },
      ];
    });
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + delta };
      if (updated[idx].quantity <= 0) updated.splice(idx, 1);
      return updated;
    });
  };

  const removeItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleProcessPayment = async () => {
    if (!orderId || !tenantId) return;

    // First sync cart items to the order
    for (const item of cart) {
      await addItemMutation.mutateAsync({
        tenantId,
        orderId,
        menuItemId: item.menuItemId,
        name: item.name,
        unitPrice: item.unitPrice.toFixed(2),
        quantity: item.quantity,
        modifiers: item.modifiers,
        notes: item.notes,
      });
    }

    // Process payment
    processPaymentMutation.mutate(
      {
        tenantId,
        orderId,
        method: paymentMethod,
        amount: totalAmount.toFixed(2),
        amountTendered: paymentMethod === "cash" ? amountTendered : undefined,
      },
      {
        onSuccess: (result) => {
          setReceiptData({
            birReceiptNo: result.birReceiptNo,
            changeAmount: result.changeAmount,
          });
          setPaymentDone(true);
          toast.success("Payment processed successfully!");
        },
        onError: (e) => toast.error("Payment failed: " + e.message),
      }
    );
  };

  if (paymentDone && receiptData) {
    const birReceiptProps = {
      businessName: "Flowtech POS",
      birReceiptNo: receiptData.birReceiptNo,
      issuedAt: new Date(),
      orderNo: `ORD-${orderId}`,
      orderType: tableId ? "Dine-in" : "Takeout",
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        modifiers: item.modifiers.map((m) => m.optionName).join(", ") || undefined,
      })),
      subtotal,
      vatableSales: subtotal / 1.12,
      vatAmount: subtotal - subtotal / 1.12,
      total: totalAmount,
      paymentMethod,
      amountTendered: paymentMethod === "cash" && amountTendered ? parseFloat(amountTendered) : undefined,
      changeAmount: receiptData.changeAmount ? parseFloat(receiptData.changeAmount) : undefined,
    };

    return (
      <POSLayout title="Payment Complete">
        <div className="flex items-center justify-center h-full p-6 overflow-y-auto">
          <div className="max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Payment Complete</h2>
              <p className="text-muted-foreground text-sm">Official receipt issued</p>
            </div>
            <BIRReceipt
              data={birReceiptProps}
              onClose={() => navigate("/pos/tables")}
            />
          </div>
        </div>
      </POSLayout>
    );
  }

  return (
    <POSLayout>
      <div className="flex h-full">
        {/* ── Left: Menu ── */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border/50">
          {/* Search + Category Filter */}
          <div className="p-4 border-b border-border/50 space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/pos/tables")}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Tables
              </Button>
              {tableId && (
                <Badge variant="outline" className="text-xs">
                  Table #{tableId}
                </Badge>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                size="sm"
                variant={activeCategory === null ? "default" : "outline"}
                className="flex-shrink-0 h-7 text-xs"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {menuData.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  className="flex-shrink-0 h-7 text-xs"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {filteredMenu.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No items found</p>
                </div>
              ) : (
                filteredMenu.map((cat) => (
                  <div key={cat.id}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {cat.name}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {cat.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className="p-3 rounded-lg border border-border/50 bg-card text-left hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 group"
                        >
                          <div className="font-medium text-sm leading-tight mb-1">{item.name}</div>
                          {item.description && (
                            <div className="text-[11px] text-muted-foreground line-clamp-1 mb-2">
                              {item.description}
                            </div>
                          )}
                          <div className="text-primary font-semibold text-sm">
                            ₱{parseFloat(String(item.price)).toFixed(2)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ── Right: Cart ── */}
        <div className="w-80 flex flex-col bg-card/50">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Order</span>
              {cart.length > 0 && (
                <Badge className="ml-auto text-xs bg-primary/20 text-primary border-primary/30">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                <ShoppingCart className="w-8 h-8 mb-2 opacity-30" />
                <p>Add items to start</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-primary">
                        ₱{(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(idx, -1)}
                        className="w-6 h-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(idx, 1)}
                        className="w-6 h-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(idx)}
                        className="w-6 h-6 rounded-md text-destructive/70 hover:text-destructive flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Totals + Checkout */}
          <div className="p-4 border-t border-border/50 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (12%)</span>
                <span>₱{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">₱{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={cart.length === 0 || !orderId}
              onClick={() => setShowPayment(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Amount */}
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Amount Due</div>
              <div className="text-4xl font-bold text-primary">₱{totalAmount.toFixed(2)}</div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                Payment Method
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                      paymentMethod === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-card hover:border-border"
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash tendered */}
            {paymentMethod === "cash" && (
              <div>
                <Label>Amount Tendered</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  className="mt-1.5 text-lg font-mono"
                />
                {amountTendered && parseFloat(amountTendered) >= totalAmount && (
                  <div className="mt-2 text-sm text-green-400 font-medium">
                    Change: ₱{change.toFixed(2)}
                  </div>
                )}
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2">
                  {[totalAmount, Math.ceil(totalAmount / 100) * 100, Math.ceil(totalAmount / 500) * 500, 1000].map(
                    (amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-7"
                        onClick={() => setAmountTendered(amt.toFixed(2))}
                      >
                        ₱{amt.toFixed(0)}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={
                processPaymentMutation.isPending ||
                addItemMutation.isPending ||
                (paymentMethod === "cash" && (!amountTendered || parseFloat(amountTendered) < totalAmount))
              }
            >
              {processPaymentMutation.isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </POSLayout>
  );
}
