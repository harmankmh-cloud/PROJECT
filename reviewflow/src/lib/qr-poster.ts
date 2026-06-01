import QRCode from "qrcode";

type PosterOptions = {
  url: string;
  businessName: string;
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, centerX, y);
    y += lineHeight;
  }

  return y;
}

export async function generateQrPosterDataUrl({ url, businessName }: PosterOptions): Promise<string> {
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 420,
    color: { dark: "#000000", light: "#ffffff" },
  });

  const canvas = document.createElement("canvas");
  const width = 640;
  const height = 860;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create poster image.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d6d3d1";
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  ctx.fillStyle = "#78716c";
  ctx.font = "600 20px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("HOW WAS YOUR VISIT?", width / 2, 88);

  ctx.fillStyle = "#0c1222";
  ctx.font = "600 40px Georgia, 'Times New Roman', serif";
  const nameBottom = wrapText(ctx, businessName, width / 2, 138, width - 96, 46);

  ctx.fillStyle = "#f59e0b";
  ctx.font = "32px system-ui, sans-serif";
  ctx.fillText("★ ★ ★ ★ ★", width / 2, nameBottom + 28);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load QR code."));
    image.src = qrDataUrl;
  });

  const qrSize = 340;
  const qrX = (width - qrSize) / 2;
  const qrY = nameBottom + 52;
  ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "#0c1222";
  ctx.font = "600 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("Scan with your phone camera", width / 2, qrY + qrSize + 52);

  ctx.fillStyle = "#57534e";
  ctx.font = "400 17px system-ui, -apple-system, sans-serif";
  ctx.fillText("Pick your stars · we help you write the review", width / 2, qrY + qrSize + 86);
  ctx.fillText("Takes under 1 minute — no app needed", width / 2, qrY + qrSize + 116);

  ctx.fillStyle = "#a8a29e";
  ctx.font = "500 13px system-ui, -apple-system, sans-serif";
  ctx.fillText(businessName, width / 2, height - 52);

  return canvas.toDataURL("image/png");
}

export async function generateQrOnlyDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 2,
    width: 512,
    color: { dark: "#000000", light: "#ffffff" },
  });
}
