import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, RefreshCw, UserPlus } from "lucide-react";
import { useState } from "react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/20 text-red-400 border-red-500/30",
  manager: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cashier: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function Staff() {
  const { tenantId } = useTenant();
  const [showInvite, setShowInvite] = useState(false);
  const [newRole, setNewRole] = useState<"manager" | "cashier">("cashier");

  const { data: staff = [], refetch, isLoading } = trpc.staff.list.useQuery(
    { tenantId: tenantId! },
    { enabled: !!tenantId }
  );

  const updateRoleMutation = trpc.staff.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated");
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const deactivateMutation = trpc.staff.deactivate.useMutation({
    onSuccess: () => {
      toast.success("Staff member deactivated");
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <POSLayout title="Staff Management">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Manage staff roles and access for this location.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => toast.info("Staff invite coming soon — share your tenant subdomain to onboard staff")}>
              <UserPlus className="w-4 h-4 mr-1.5" />
              Invite Staff
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-card animate-pulse rounded-xl border border-border/50" />
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border/50 rounded-xl">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No staff members yet</p>
            <p className="text-sm mt-1">Staff will appear here once they log in and join this tenant</p>
          </div>
        ) : (
          <div className="border border-border/50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.profile.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{member.user?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{member.user?.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={member.profile.role}
                        onValueChange={(v) =>
                          updateRoleMutation.mutate({
                            profileId: member.profile.id,
                            tenantId: tenantId!,
                            role: v as "admin" | "manager" | "cashier",
                          })
                        }
                      >
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="cashier">Cashier</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-[10px] border ${
                          member.profile.isActive
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {member.profile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(member.profile.createdAt).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {member.profile.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-destructive hover:text-destructive"
                          onClick={() =>
                            deactivateMutation.mutate({ profileId: member.profile.id, tenantId: tenantId! })
                          }
                        >
                          Deactivate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </POSLayout>
  );
}
