import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Printer, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";

export default function Reports() {
  const { tenantId } = useTenant();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [showConfirm, setShowConfirm] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  const { data: zReports = [], refetch: refetchReports } = trpc.reports.getZReports.useQuery(
    { tenantId: tenantId!, limit: 30 },
    { enabled: !!tenantId }
  );

  const { data: todaySummary } = trpc.reports.dailySummary.useQuery(
    { tenantId: tenantId!, date: today },
    { enabled: !!tenantId }
  );

  const generateMutation = trpc.reports.generateZReport.useMutation({
    onSuccess: (data) => {
      setGeneratedReport(data);
      setShowConfirm(false);
      refetchReports();
      toast.success(`Z-Report ${data.reportNo} generated successfully`);
    },
    onError: (e) => {
      toast.error(e.message);
      setShowConfirm(false);
    },
  });

  const todayHasReport = zReports.some(
    (r) => new Date(r.reportDate).toISOString().split("T")[0] === today
  );

  return (
    <POSLayout title="Reports & Z-Report">
      <div className="p-6 space-y-6">
        {/* Z-Report Generator */}
        <div className="p-6 rounded-xl border border-border/50 bg-card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                End-of-Day Z-Report
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Generate the BIR-required daily closing report. This action is irreversible.
              </p>
            </div>
            {todayHasReport ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Generated Today
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                Pending
              </Badge>
            )}
          </div>

          {/* Today's Summary Preview */}
          {todaySummary && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Transactions</div>
                <div className="font-bold text-lg">{todaySummary.totalTransactions}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Gross Sales</div>
                <div className="font-bold text-lg text-primary">
                  ₱{parseFloat(String(todaySummary.totalSales)).toFixed(2)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Cash</div>
                <div className="font-bold text-lg">
                  ₱{parseFloat(String(todaySummary.cashSales)).toFixed(2)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Card</div>
                <div className="font-bold text-lg">
                  ₱{parseFloat(String(todaySummary.cardSales)).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={todayHasReport || generateMutation.isPending}
            >
              <FileText className="w-4 h-4 mr-2" />
              {todayHasReport ? "Already Generated" : "Generate Z-Report"}
            </Button>
          </div>
        </div>

        {/* Generated Report Display */}
        {generatedReport && (
          <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-green-400">Z-Report Generated</h3>
            </div>
            <div className="font-mono text-sm space-y-1 bg-background/50 rounded-lg p-4">
              <div className="text-center font-bold text-base mb-3">Z-REPORT</div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Report No.</span>
                <span>{generatedReport.reportNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date().toLocaleDateString("en-PH")}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sales</span>
                <span>₱{parseFloat(String(generatedReport.totalSales)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT (12%)</span>
                <span>₱{parseFloat(String(generatedReport.totalVat)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash Sales</span>
                <span>₱{parseFloat(String(generatedReport.cashSales)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Sales</span>
                <span>₱{parseFloat(String(generatedReport.cardSales)).toFixed(2)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>
        )}

        {/* Z-Report History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Z-Report History</h2>
            <Button variant="ghost" size="sm" onClick={() => refetchReports()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          {zReports.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border/50 rounded-xl">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No Z-Reports generated yet</p>
            </div>
          ) : (
            <div className="border border-border/50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Report No.</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Transactions</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Total Sales</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">VAT</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {zReports.map((report) => (
                    <tr key={report.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium">{report.reportNo}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(report.reportDate).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">{report.totalTransactions}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">
                        ₱{parseFloat(String(report.totalSales)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        ₱{parseFloat(String(report.totalVat)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => window.print()}>
                          <Printer className="w-3 h-3 mr-1" />
                          Print
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Z-Report Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Generate Z-Report
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            <p>You are about to generate the end-of-day Z-Report for:</p>
            <p className="font-semibold text-foreground mt-2">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-3 text-amber-400 text-xs">
              ⚠ This action is irreversible and required by BIR regulations for daily closing.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button
              onClick={() => generateMutation.mutate({ tenantId: tenantId!, date: today })}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? "Generating..." : "Confirm & Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </POSLayout>
  );
}
