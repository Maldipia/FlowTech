import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { trpc } from "@/lib/trpc";

interface TenantProfile {
  profile: {
    id: number;
    userId: number;
    tenantId: number;
    role: "admin" | "manager" | "cashier";
    isActive: boolean;
  };
  tenant: {
    id: number;
    name: string;
    subdomain: string;
    businessType: string;
    birTin: string | null;
    birRegisteredName: string | null;
    birAddress: string | null;
    birPermitNo: string | null;
    birAccreditationNo: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    addressStreet: string | null;
    addressCity: string | null;
    addressProvince: string | null;
  };
}

interface TenantContextType {
  activeTenant: TenantProfile | null;
  setActiveTenant: (t: TenantProfile | null) => void;
  tenants: TenantProfile[];
  isLoading: boolean;
  role: "admin" | "manager" | "cashier" | null;
  tenantId: number | null;
}

const TenantContext = createContext<TenantContextType>({
  activeTenant: null,
  setActiveTenant: () => {},
  tenants: [],
  isLoading: true,
  role: null,
  tenantId: null,
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [activeTenant, setActiveTenantState] = useState<TenantProfile | null>(null);
  const { data: tenants = [], isLoading } = trpc.tenant.myTenants.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (tenants.length > 0 && !activeTenant) {
      // Auto-select first tenant
      const stored = localStorage.getItem("flowtech_active_tenant");
      if (stored) {
        const found = tenants.find((t) => t.tenant.id === parseInt(stored));
        if (found) {
          setActiveTenantState(found as TenantProfile);
          return;
        }
      }
      setActiveTenantState(tenants[0] as TenantProfile);
    }
  }, [tenants, activeTenant]);

  const setActiveTenant = (t: TenantProfile | null) => {
    setActiveTenantState(t);
    if (t) localStorage.setItem("flowtech_active_tenant", String(t.tenant.id));
    else localStorage.removeItem("flowtech_active_tenant");
  };

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        setActiveTenant,
        tenants: tenants as TenantProfile[],
        isLoading,
        role: activeTenant?.profile.role ?? null,
        tenantId: activeTenant?.tenant.id ?? null,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
