import { ManagerGate } from "@/components/manager/ManagerGate";
import { ManagerShell } from "@/components/manager/ManagerShell";
import { Toaster } from "@/components/ui/sonner";

export default function ManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ManagerGate>
      <ManagerShell>{children}</ManagerShell>
      <Toaster richColors position="top-center" />
    </ManagerGate>
  );
}
