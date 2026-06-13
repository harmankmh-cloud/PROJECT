(function attachScanner(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.RouteMaxScanner = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function scannerFactory() {
  let activeScanner = null;

  function ensureLibrary() {
    if (typeof Html5Qrcode === "undefined") {
      throw new Error("Scanner library not loaded.");
    }
  }

  async function startScan(regionId, onDecoded) {
    ensureLibrary();
    if (activeScanner) {
      await stopScan();
    }

    const scanner = new Html5Qrcode(regionId);
    activeScanner = scanner;

    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 280, height: 180 } },
      (decoded) => {
        stopScan().catch(() => {});
        onDecoded(decoded);
      },
      () => {},
    );

    return scanner;
  }

  async function stopScan() {
    if (!activeScanner) return;
    const scanner = activeScanner;
    activeScanner = null;
    try {
      if (scanner.isScanning) await scanner.stop();
    } catch {
      /* ignore */
    }
    try {
      scanner.clear();
    } catch {
      /* ignore */
    }
  }

  return {
    startScan,
    stopScan,
  };
});
