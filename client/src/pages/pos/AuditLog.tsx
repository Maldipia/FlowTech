import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

const ACTION_COLORS: Record<string, string> = {
  "order.created": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "order.voided": "bg-red-500/20 text-red-400 border-red-500/30",
  "payment.completed": "bg-green-500/20 text-green-400 border-green-500/30",
  "z_report.generated": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "menu.item_created": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "menu.item_deleted": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "tenant.created": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "staff.invited": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export default function AuditLog() {
  const { tenantId } = useTenant();
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const { data: logs = [], refetch, isLoading } = trpc.reports.auditLog.useQuery(
    { tenantId: tenantId!, limit: LIMIT, offset },
    { enabled: !!tenantId }
  );

  return (
    <POSLayout title="Audit Log">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            All critical actions are logged for BIR compliance and security auditing.
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="border border-border/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Action</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Entity</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-muted/30 animate-pulse rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No audit logs yet
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-PH", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-[10px] border font-mono ${
                          ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{log.entity}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {log.userId ? `User #${log.userId}` : "System"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono max-w-xs truncate">
                      {log.meta ? JSON.stringify(log.meta).slice(0, 80) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {offset + 1}–{offset + logs.length}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={logs.length < LIMIT}
              onClick={() => setOffset(offset + LIMIT)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </POSLayout>
  );
}
