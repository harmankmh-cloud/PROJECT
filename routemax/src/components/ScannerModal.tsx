import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";

type Props = {
  onScan: (text: string) => void;
  onClose: () => void;
};

export function ScannerModal({ onScan, onClose }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "routemax-scanner";

  useEffect(() => {
    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 160 } },
        (decoded) => {
          scanner.stop().catch(() => {});
          onScan(decoded);
        },
        () => {}
      )
      .catch(() => {
        onScan("");
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 p-4">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-lg font-semibold">Scan package label</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-slate-800 p-2"
          aria-label="Close scanner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="mb-3 text-sm text-slate-400">
        Point at a QR code or barcode that contains the delivery address.
      </p>
      <div id={regionId} className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl" />
    </div>
  );
}
