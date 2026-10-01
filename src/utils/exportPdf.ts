import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// A3横（420mm×297mm）での出力はブラウザの印刷機能（@page size）に頼ると
// Safari 等では用紙サイズ・向きが無視され、縦向きや複数ページに崩れてしまう。
// そのため、画面には表示しない複製をA3横の実寸ピクセルで組み立て、
// html2canvas で画像化してから jsPDF でA3横2ページのPDFとして直接書き出す。

const A3_WIDTH_MM = 420;
const A3_HEIGHT_MM = 297;
const PX_PER_MM = 3.78; // 96dpi 相当
const EXPORT_WIDTH_PX = Math.round(A3_WIDTH_MM * PX_PER_MM);

export async function exportPatientPdf(fileName: string): Promise<void> {
  const printLayout = document.querySelector(".print-only .print-layout");
  if (!printLayout) throw new Error("印刷用レイアウトが見つかりません");

  const pages = Array.from(printLayout.querySelectorAll(":scope > .print-page-a3"));
  if (pages.length === 0) throw new Error("出力対象のページが見つかりません");

  const container = document.createElement("div");
  container.className = "pdf-export-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "-99999px";
  container.style.width = `${EXPORT_WIDTH_PX}px`;
  container.style.background = "#ffffff";
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

    for (let i = 0; i < pages.length; i++) {
      container.innerHTML = "";
      const clone = pages[i].cloneNode(true) as HTMLElement;
      container.appendChild(clone);
      // レイアウト・画像の読み込みが落ち着くのを少し待つ
      await new Promise((resolve) => setTimeout(resolve, 60));

      const canvas = await html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 2,
        windowWidth: EXPORT_WIDTH_PX,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      if (i > 0) pdf.addPage("a3", "landscape");
      pdf.addImage(imgData, "JPEG", 0, 0, A3_WIDTH_MM, A3_HEIGHT_MM);
    }

    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}
