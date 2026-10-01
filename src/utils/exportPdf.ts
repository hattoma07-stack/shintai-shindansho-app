import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

// A3横（420mm×297mm）での出力はブラウザの印刷機能（@page size）に頼ると
// Safari 等では用紙サイズ・向きが無視され、縦向きや複数ページに崩れてしまう。
// そのため、画面には表示しない複製をA3横の実寸ピクセルで組み立て、
// html-to-image（SVG foreignObject + 実ブラウザ描画）で画像化してから
// jsPDF でA3横2ページのPDFとして直接書き出す。
// （html2canvas は独自のCSS解釈エンジンを持ち、flexbox 等のモダンCSSを
// 正しく再現できずレイアウトが崩れることが分かったため不採用とした）

const A3_WIDTH_MM = 420;
const A3_HEIGHT_MM = 297;
const PX_PER_MM = 3.78; // 96dpi 相当
const EXPORT_WIDTH_PX = Math.round(A3_WIDTH_MM * PX_PER_MM);

export async function exportPatientPdf(fileName: string): Promise<void> {
  const printLayout = document.querySelector(".print-only .print-layout");
  if (!printLayout) throw new Error("印刷用レイアウトが見つかりません");

  const pages = Array.from(printLayout.querySelectorAll(":scope > .print-page-a3"));
  if (pages.length === 0) throw new Error("出力対象のページが見つかりません");

  // html-to-image は要素が画面外（position固定での大幅なマイナス座標や
  // opacity:0 など）にあると正しく描画できず空白画像になることがあるため、
  // 実際に画面内に表示した状態でキャプチャし、その上を不透明なオーバーレイで覆って
  // 利用者には「PDF作成中」の表示だけが見えるようにする。
  const overlay = document.createElement("div");
  overlay.className = "pdf-export-overlay";
  overlay.textContent = "PDFを作成しています…";
  document.body.appendChild(overlay);

  const container = document.createElement("div");
  container.className = "pdf-export-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = `${EXPORT_WIDTH_PX}px`;
  container.style.background = "#ffffff";
  container.style.zIndex = "9998";
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

    for (let i = 0; i < pages.length; i++) {
      container.innerHTML = "";
      const clone = pages[i].cloneNode(true) as HTMLElement;
      container.appendChild(clone);
      // レイアウト・画像の読み込みが落ち着くのを少し待つ
      await new Promise((resolve) => setTimeout(resolve, 60));

      const exportHeightPx = clone.scrollHeight || Math.round(EXPORT_WIDTH_PX * (A3_HEIGHT_MM / A3_WIDTH_MM));
      const imgData = await toJpeg(container, {
        backgroundColor: "#ffffff",
        width: EXPORT_WIDTH_PX,
        height: exportHeightPx,
        pixelRatio: 2,
        quality: 0.95,
        skipFonts: true,
      });

      // アスペクト比を保ったまま1ページに収める（歪み・はみ出し防止）
      const contentHeightMm = exportHeightPx / PX_PER_MM;
      let imgWidthMm = A3_WIDTH_MM;
      let imgHeightMm = contentHeightMm;
      if (imgHeightMm > A3_HEIGHT_MM) {
        const scale = A3_HEIGHT_MM / imgHeightMm;
        imgHeightMm = A3_HEIGHT_MM;
        imgWidthMm = A3_WIDTH_MM * scale;
      }
      const offsetX = (A3_WIDTH_MM - imgWidthMm) / 2;
      const offsetY = (A3_HEIGHT_MM - imgHeightMm) / 2;

      if (i > 0) pdf.addPage("a3", "landscape");
      pdf.addImage(imgData, "JPEG", offsetX, offsetY, imgWidthMm, imgHeightMm);
    }

    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
    document.body.removeChild(overlay);
  }
}
