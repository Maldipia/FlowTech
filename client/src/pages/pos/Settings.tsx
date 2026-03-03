import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save, Building2, Receipt } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings() {
  const { tenantId, activeTenant } = useTenant();
  const [form, setForm] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    addressStreet: "",
    addressCity: "",
    addressProvince: "",
    birTin: "",
    birRegisteredName: "",
    birAddress: "",
    birPermitNo: "",
    birAccreditationNo: "",
  });

  useEffect(() => {
    if (activeTenant?.tenant) {
      const t = activeTenant.tenant;
      setForm({
        name: t.name ?? "",
        contactEmail: t.contactEmail ?? "",
        contactPhone: t.contactPhone ?? "",
        addressStreet: t.addressStreet ?? "",
        addressCity: t.addressCity ?? "",
        addressProvince: t.addressProvince ?? "",
        birTin: t.birTin ?? "",
        birRegisteredName: t.birRegisteredName ?? "",
        birAddress: t.birAddress ?? "",
        birPermitNo: t.birPermitNo ?? "",
        birAccreditationNo: t.birAccreditationNo ?? "",
      });
    }
  }, [activeTenant]);

  const updateMutation = trpc.tenant.update.useMutation({
    onSuccess: () => toast.success("Settings saved"),
    onError: (e) => toast.error(e.message),
  });

  const handleSave = () => {
    if (!tenantId) return;
    updateMutation.mutate({ tenantId, ...form });
  };

  return (
    <POSLayout title="Settings">
      <div className="p-6 max-w-2xl space-y-8">
        {/* Business Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Business Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label>Street Address</Label>
              <Input
                value={form.addressStreet}
                onChange={(e) => setForm((p) => ({ ...p, addressStreet: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={form.addressCity}
                  onChange={(e) => setForm((p) => ({ ...p, addressCity: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Province</Label>
                <Input
                  value={form.addressProvince}
                  onChange={(e) => setForm((p) => ({ ...p, addressProvince: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* BIR Compliance */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">BIR Compliance Information</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Required for official receipts and Z-Reports. Ensure accuracy for BIR compliance.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TIN (Tax Identification Number)</Label>
                <Input
                  value={form.birTin}
                  onChange={(e) => setForm((p) => ({ ...p, birTin: e.target.value }))}
                  placeholder="000-000-000-000"
                  className="mt-1.5 font-mono"
                />
              </div>
              <div>
                <Label>BIR Registered Name</Label>
                <Input
                  value={form.birRegisteredName}
                  onChange={(e) => setForm((p) => ({ ...p, birRegisteredName: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label>BIR Registered Address</Label>
              <Input
                value={form.birAddress}
                onChange={(e) => setForm((p) => ({ ...p, birAddress: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Permit to Use (PTU) No.</Label>
                <Input
                  value={form.birPermitNo}
                  onChange={(e) => setForm((p) => ({ ...p, birPermitNo: e.target.value }))}
                  placeholder="PTU-XXXXXXXX"
                  className="mt-1.5 font-mono"
                />
              </div>
              <div>
                <Label>Accreditation No.</Label>
                <Input
                  value={form.birAccreditationNo}
                  onChange={(e) => setForm((p) => ({ ...p, birAccreditationNo: e.target.value }))}
                  className="mt-1.5 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </POSLayout>
  );
}
