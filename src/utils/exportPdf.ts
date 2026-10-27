import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

// 用紙サイズ・向きをブラウザの印刷機能（@page size）に頼ると、Safari 等では無視されて
// 縦向きや複数ページに崩れてしまう。そのため、画面には表示しない複製を用紙の実寸ピクセルで
// 組み立て、html-to-image（SVG foreignObject + 実ブラウザ描画）で画像化してから
// jsPDF で指定サイズのPDFとして直接書き出す。
// （html2canvas は独自のCSS解釈エンジンを持ち、flexbox 等のモダンCSSを
// 正しく再現できずレイアウトが崩れることが分かったため不採用とした）

const PX_PER_MM = 3.78; // 96dpi 相当

type PaperSpec = {
  format: "a3" | "a4";
  orientation: "landscape" | "portrait";
  widthMm: number;
  heightMm: number;
  containerClass: string;
  // 出力する要素（ページ）を取得する
  selectPages: (printLayout: Element) => Element[];
};

const A3_LANDSCAPE: PaperSpec = {
  format: "a3",
  orientation: "landscape",
  widthMm: 420,
  heightMm: 297,
  containerClass: "pdf-export-root",
  selectPages: (layout) => Array.from(layout.querySelectorAll(":scope > .print-page-a3")),
};

// A4縦：A3シートの各半分（総括表／所見／ROM・MMT）を1枚ずつ。空白の半分は出力しない。
const A4_PORTRAIT: PaperSpec = {
  format: "a4",
  orientation: "portrait",
  widthMm: 210,
  heightMm: 297,
  containerClass: "pdf-export-root pdf-export-a4",
  selectPages: (layout) => Array.from(layout.querySelectorAll(".print-a3-half.print-doc")),
};

async function exportPdf(spec: PaperSpec, fileName: string): Promise<void> {
  const printLayout = document.querySelector(".print-only .print-layout");
  if (!printLayout) throw new Error("印刷用レイアウトが見つかりません");

  const pages = spec.selectPages(printLayout);
  if (pages.length === 0) throw new Error("出力対象のページが見つかりません");

  const exportWidthPx = Math.round(spec.widthMm * PX_PER_MM);

  // html-to-image は要素が画面外（position固定での大幅なマイナス座標や
  // opacity:0 など）にあると正しく描画できず空白画像になることがあるため、
  // 実際に画面内に表示した状態でキャプチャし、その上を不透明なオーバーレイで覆って
  // 利用者には「PDF作成中」の表示だけが見えるようにする。
  const overlay = document.createElement("div");
  overlay.className = "pdf-export-overlay";
  overlay.textContent = "PDFを作成しています…";
  document.body.appendChild(overlay);

  const container = document.createElement("div");
  container.className = spec.containerClass;
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = `${exportWidthPx}px`;
  container.style.background = "#ffffff";
  container.style.zIndex = "9998";
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({ orientation: spec.orientation, unit: "mm", format: spec.format });

    for (let i = 0; i < pages.length; i++) {
      container.innerHTML = "";
      const clone = pages[i].cloneNode(true) as HTMLElement;
      container.appendChild(clone);

      // cloneNode は<canvas>の描画内容（参考図示の人体図・手掌図）をコピーしないため、
      // 元の<canvas>から複製先へピクセルを手動で転写する。
      const sourceCanvases = pages[i].querySelectorAll("canvas");
      const clonedCanvases = clone.querySelectorAll("canvas");
      sourceCanvases.forEach((srcCanvas, idx) => {
        const dstCanvas = clonedCanvases[idx];
        if (!dstCanvas) return;
        dstCanvas.width = srcCanvas.width;
        dstCanvas.height = srcCanvas.height;
        dstCanvas.getContext("2d")?.drawImage(srcCanvas, 0, 0);
      });

      // レイアウト・画像の読み込みが落ち着くのを少し待つ
      await new Promise((resolve) => setTimeout(resolve, 60));

      const exportHeightPx = clone.scrollHeight || Math.round(exportWidthPx * (spec.heightMm / spec.widthMm));
      const imgData = await toJpeg(container, {
        backgroundColor: "#ffffff",
        width: exportWidthPx,
        height: exportHeightPx,
        pixelRatio: 2,
        quality: 0.95,
        skipFonts: true,
      });

      // アスペクト比を保ったまま1ページに収める（歪み・はみ出し防止）
      const contentHeightMm = exportHeightPx / PX_PER_MM;
      let imgWidthMm = spec.widthMm;
      let imgHeightMm = contentHeightMm;
      if (imgHeightMm > spec.heightMm) {
        const scale = spec.heightMm / imgHeightMm;
        imgHeightMm = spec.heightMm;
        imgWidthMm = spec.widthMm * scale;
      }
      const offsetX = (spec.widthMm - imgWidthMm) / 2;
      // A4は上詰め、A3は従来どおり上下中央
      const offsetY = spec.format === "a4" ? 0 : (spec.heightMm - imgHeightMm) / 2;

      if (i > 0) pdf.addPage(spec.format, spec.orientation);
      pdf.addImage(imgData, "JPEG", offsetX, offsetY, imgWidthMm, imgHeightMm);
    }

    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
    document.body.removeChild(overlay);
  }
}

export function exportPatientPdf(fileName: string): Promise<void> {
  return exportPdf(A3_LANDSCAPE, fileName);
}

export function exportPatientPdfA4(fileName: string): Promise<void> {
  return exportPdf(A4_PORTRAIT, fileName);
}
