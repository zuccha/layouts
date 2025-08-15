import { jsPDF } from "jspdf";

export async function pngsToPdf(
  pngs: string[],
  w: number,
  h: number,
  gap: number,
  margin: number,
): Promise<jsPDF> {
  const pdf = new jsPDF({ format: "a4", unit: "in" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const contentW = Math.max(pageW - 2 * margin, 0);
  const contentH = Math.max(pageH - 2 * margin, 0);

  const cols = Math.floor((contentW + gap) / (w + gap));
  const rows = Math.floor((contentH + gap) / (h + gap));

  const offsetX =
    margin + (contentW - cols * w - Math.max(cols - 1, 0) * gap) / 2;
  const offsetY =
    margin + (contentH - rows * h - Math.max(rows - 1, 0) * gap) / 2;

  if (cols === 0 || rows === 0) return pdf;

  let pngIndex = 0;
  while (pngIndex < pngs.length) {
    if (pngIndex > 0) pdf.addPage();
    for (let r = 0; r < rows && pngIndex < pngs.length; r++) {
      for (let c = 0; c < cols && pngIndex < pngs.length; c++) {
        const x = offsetX + c * (w + gap);
        const y = offsetY + r * (h + gap);
        pdf.addImage(pngs[pngIndex], "PNG", x, y, w, h);
        pngIndex++;
      }
    }
  }

  return pdf;
}
