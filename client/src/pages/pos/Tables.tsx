import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Users, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const STATUS_CONFIG = {
  available: { label: "Available", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  occupied: { label: "Occupied", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  reserved: { label: "Reserved", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  cleaning: { label: "Cleaning", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

export default function Tables() {
  const { tenantId, role } = useTenant();
  const [, navigate] = useLocation();
  const [showAdd, setShowAdd] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", capacity: "4", section: "" });

  const { data: tables = [], refetch, isLoading } = trpc.tables.list.useQuery(
    { tenantId: tenantId! },
    { enabled: !!tenantId, refetchInterval: 15000 }
  );

  const createMutation = trpc.tables.create.useMutation({
    onSuccess: () => {
      toast.success("Table created");
      setShowAdd(false);
      setNewTable({ name: "", capacity: "4", section: "" });
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateStatusMutation = trpc.tables.updateStatus.useMutation({
    onSuccess: () => refetch(),
    onError: (e) => toast.error(e.message),
  });

  const startOrder = async (tableId: number) => {
    navigate(`/pos/orders/new?tableId=${tableId}`);
  };

  const sections = Array.from(new Set(tables.map((t) => t.section).filter(Boolean)));
  const ungrouped = tables.filter((t) => !t.section);

  const renderTable = (table: typeof tables[0]) => {
    const status = table.status as keyof typeof STATUS_CONFIG;
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
    return (
      <div
        key={table.id}
        className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
          status === "available"
            ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50"
            : status === "occupied"
            ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
            : status === "reserved"
            ? "border-blue-500/30 bg-blue-500/5"
            : "border-purple-500/30 bg-purple-500/5"
        }`}
        onClick={() => status === "available" && startOrder(table.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-sm">{table.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Users className="w-3 h-3" />
              {table.capacity} seats
            </div>
          </div>
          <Badge className={`text-[10px] px-2 py-0.5 border ${config.color}`}>
            {config.label}
          </Badge>
        </div>

        {status === "available" && (
          <Button
            size="sm"
            className="w-full h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              startOrder(table.id);
            }}
          >
            New Order
          </Button>
        )}

        {status === "occupied" && (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pos/orders?tableId=${table.id}`);
            }}
          >
            View Order
          </Button>
        )}

        {(role === "admin" || role === "manager") && status !== "available" && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full h-6 text-[10px] mt-1 text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              updateStatusMutation.mutate({ id: table.id, tenantId: tenantId!, status: "available" });
            }}
          >
            Mark Available
          </Button>
        )}
      </div>
    );
  };

  return (
    <POSLayout title="Table Management">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {Object.entries(STATUS_CONFIG).map(([key, val]) => {
              const count = tables.filter((t) => t.status === key).length;
              return (
                <div key={key} className="flex items-center gap-1.5 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    key === "available" ? "bg-green-400" :
                    key === "occupied" ? "bg-amber-400" :
                    key === "reserved" ? "bg-blue-400" : "bg-purple-400"
                  }`} />
                  <span className="text-muted-foreground">{val.label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            {(role === "admin" || role === "manager") && (
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Add Table
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No tables configured</p>
            <p className="text-sm mt-1">Add tables to start taking orders</p>
            {(role === "admin" || role === "manager") && (
              <Button className="mt-4" onClick={() => setShowAdd(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Table
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {tables.filter((t) => t.section === section).map(renderTable)}
                </div>
              </div>
            ))}
            {ungrouped.length > 0 && (
              <div>
                {sections.length > 0 && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    General
                  </h3>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {ungrouped.map(renderTable)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Table Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Table Name</Label>
              <Input
                placeholder="e.g. Table 1, Bar Seat A"
                value={newTable.name}
                onChange={(e) => setNewTable((p) => ({ ...p, name: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={newTable.capacity}
                onChange={(e) => setNewTable((p) => ({ ...p, capacity: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Section (optional)</Label>
              <Input
                placeholder="e.g. Indoor, Outdoor, Bar"
                value={newTable.section}
                onChange={(e) => setNewTable((p) => ({ ...p, section: e.target.value }))}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button
              onClick={() =>
                createMutation.mutate({
                  tenantId: tenantId!,
                  name: newTable.name,
                  capacity: parseInt(newTable.capacity),
                  section: newTable.section || undefined,
                })
              }
              disabled={!newTable.name || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Table"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </POSLayout>
  );
}

// Fix missing import
function LayoutGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  );
}
