import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Zap, ArrowRight, Building2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const BUSINESS_TYPES = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "CAFE", label: "Café" },
  { value: "BAR", label: "Bar & Lounge" },
  { value: "FOOD_TRUCK", label: "Food Truck" },
  { value: "BAKERY", label: "Bakery" },
  { value: "FASTFOOD", label: "Fast Food" },
  { value: "OTHER", label: "Other F&B" },
];

export default function Onboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    businessType: "RESTAURANT",
    contactEmail: user?.email ?? "",
    contactPhone: "",
    addressCity: "",
    birTin: "",
  });

  const createMutation = trpc.tenant.create.useMutation({
    onSuccess: () => {
      toast.success("Business created! Welcome to Flowtech.");
      navigate("/pos/tables");
    },
    onError: (e) => toast.error(e.message),
  });

  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 30);
  };

  const handleNameChange = (name: string) => {
    setForm((p) => ({
      ...p,
      name,
      subdomain: generateSubdomain(name),
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Flowtech
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Set up your business
              </h1>
              <p className="text-muted-foreground text-sm">Tell us about your F&B establishment</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Yani Garden Cafe"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Business Type</Label>
                <Select
                  value={form.businessType}
                  onValueChange={(v) => setForm((p) => ({ ...p, businessType: v }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subdomain</Label>
                <div className="flex items-center mt-1.5">
                  <Input
                    value={form.subdomain}
                    onChange={(e) => setForm((p) => ({ ...p, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                    className="rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
                    .flowtech.ph
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => setStep(2)}
              disabled={!form.name || !form.subdomain}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Contact & BIR Info
              </h1>
              <p className="text-muted-foreground text-sm">
                Required for BIR-compliant receipts. You can update this later in Settings.
              </p>
            </div>

            <div className="space-y-4">
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
                  placeholder="+63 9XX XXX XXXX"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={form.addressCity}
                  onChange={(e) => setForm((p) => ({ ...p, addressCity: e.target.value }))}
                  placeholder="e.g. Makati City"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>TIN (optional — add later in Settings)</Label>
                <Input
                  value={form.birTin}
                  onChange={(e) => setForm((p) => ({ ...p, birTin: e.target.value }))}
                  placeholder="000-000-000-000"
                  className="mt-1.5 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() =>
                  createMutation.mutate({
                    name: form.name,
                    subdomain: form.subdomain,
                    businessType: form.businessType as any,
                    contactEmail: form.contactEmail || undefined,
                    contactPhone: form.contactPhone || undefined,
                    addressCity: form.addressCity || undefined,
                    birTin: form.birTin || undefined,
                  })
                }
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Launch Business"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
