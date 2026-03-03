import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRef } from "react";

export interface BIRReceiptData {
  // Tenant / Business Info
  businessName: string;
  birRegisteredName?: string;
  birAddress?: string;
  birTin?: string;
  birPermitNo?: string;
  birAccreditationNo?: string;

  // Receipt Info
  birReceiptNo: string;
  issuedAt: Date;
  cashierName?: string;

  // Order Info
  orderNo: string;
  tableLabel?: string;
  orderType: string;

  // Line Items
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    modifiers?: string;
  }[];

  // Totals
  subtotal: number;
  vatableSales: number;
  vatAmount: number;
  discount?: number;
  total: number;

  // Payment
  paymentMethod: string;
  amountTendered?: number;
  changeAmount?: number;
}

interface BIRReceiptProps {
  data: BIRReceiptData;
  onClose?: () => void;
}

export function BIRReceipt({ data, onClose }: BIRReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    if (!printContent) return;
    const win = window.open("", "_blank", "width=400,height=700");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Receipt - ${data.birReceiptNo}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 11px; margin: 0; padding: 8px; width: 72mm; }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 4px 0; }
            .row { display: flex; justify-content: space-between; }
            .small { font-size: 9px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col gap-4">
      {/* Receipt Preview */}
      <div
        ref={receiptRef}
        className="bg-white text-black font-mono text-xs p-4 rounded-lg w-full max-w-xs mx-auto"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {/* Header */}
        <div className="text-center space-y-0.5 mb-3">
          <div className="font-bold text-sm">{data.birRegisteredName || data.businessName}</div>
          {data.birAddress && (
            <div className="text-[10px] leading-tight">{data.birAddress}</div>
          )}
          {data.birTin && (
            <div className="text-[10px]">TIN: {data.birTin}</div>
          )}
          {data.birPermitNo && (
            <div className="text-[10px]">PTU No.: {data.birPermitNo}</div>
          )}
          {data.birAccreditationNo && (
            <div className="text-[10px]">Accreditation No.: {data.birAccreditationNo}</div>
          )}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Receipt Details */}
        <div className="space-y-0.5 mb-2">
          <div className="flex justify-between">
            <span className="font-bold">OFFICIAL RECEIPT</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Receipt No.:</span>
            <span className="font-bold">{data.birReceiptNo}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Date:</span>
            <span>
              {data.issuedAt.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Time:</span>
            <span>
              {data.issuedAt.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
          {data.cashierName && (
            <div className="flex justify-between text-[10px]">
              <span>Cashier:</span>
              <span>{data.cashierName}</span>
            </div>
          )}
          <div className="flex justify-between text-[10px]">
            <span>Order No.:</span>
            <span>{data.orderNo}</span>
          </div>
          {data.tableLabel && (
            <div className="flex justify-between text-[10px]">
              <span>Table:</span>
              <span>{data.tableLabel}</span>
            </div>
          )}
          <div className="flex justify-between text-[10px]">
            <span>Type:</span>
            <span className="capitalize">{data.orderType}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Line Items */}
        <div className="space-y-1 mb-2">
          {data.items.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <span className="flex-1 pr-2 leading-tight">{item.name}</span>
                <span className="flex-shrink-0">₱{fmt(item.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 pl-2">
                <span>{item.quantity} x ₱{fmt(item.unitPrice)}</span>
              </div>
              {item.modifiers && (
                <div className="text-[10px] text-gray-500 pl-2">{item.modifiers}</div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Totals */}
        <div className="space-y-0.5 mb-2">
          <div className="flex justify-between text-[10px]">
            <span>Subtotal:</span>
            <span>₱{fmt(data.subtotal)}</span>
          </div>
          {data.discount !== undefined && data.discount > 0 && (
            <div className="flex justify-between text-[10px]">
              <span>Discount:</span>
              <span>-₱{fmt(data.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[10px]">
            <span>VATable Sales:</span>
            <span>₱{fmt(data.vatableSales)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>VAT (12%):</span>
            <span>₱{fmt(data.vatAmount)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>₱{fmt(data.total)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Payment */}
        <div className="space-y-0.5 mb-2">
          <div className="flex justify-between text-[10px]">
            <span>Payment Method:</span>
            <span className="capitalize">{data.paymentMethod}</span>
          </div>
          {data.amountTendered !== undefined && (
            <div className="flex justify-between text-[10px]">
              <span>Amount Tendered:</span>
              <span>₱{fmt(data.amountTendered)}</span>
            </div>
          )}
          {data.changeAmount !== undefined && data.changeAmount > 0 && (
            <div className="flex justify-between text-[10px]">
              <span>Change:</span>
              <span>₱{fmt(data.changeAmount)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* BIR Footer */}
        <div className="text-center space-y-0.5">
          <div className="text-[10px]">This serves as your Official Receipt</div>
          <div className="text-[10px]">pursuant to BIR regulations.</div>
          <div className="text-[9px] mt-2 text-gray-500">
            Powered by Flowtech POS · flowtech.ph
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
        {onClose && (
          <Button size="sm" onClick={onClose}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
