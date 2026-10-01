// 感覚障害・運動障害の参考図示マークは、以前はSVGの<pattern>（url(#id)参照）で
// 斜線・横線を表現していたが、iPad（Safari）でPDF書き出し（html-to-image）を行うと
// そのブロックごと真っ白に消えることが分かった。SVGのpattern/url()参照はブラウザ間・
// 画像化ライブラリ間での対応差が大きいため、参照を使わずに直接<line>座標を計算して
// 描画する方式に変更し、どの環境でも同じ見た目になるようにする。

export type LineSeg = { x1: number; y1: number; x2: number; y2: number };

type Rect = { x: number; y: number; width: number; height: number };

// 45度の斜線（感覚障害）。spacingは斜線同士の間隔(px)。
export function diagonalHatchLines({ x, y, width, height }: Rect, spacing: number): LineSeg[] {
  const lines: LineSeg[] = [];
  const cMin = y - (x + width);
  const cMax = y + height - x;
  const start = Math.floor(cMin / spacing) * spacing;
  for (let c = start; c <= cMax; c += spacing) {
    // 直線 y = x + c 上で、矩形 [x, x+width] x [y, y+height] に収まる区間を求める
    let x1 = x;
    let y1 = x1 + c;
    if (y1 < y) {
      y1 = y;
      x1 = y1 - c;
    } else if (y1 > y + height) {
      y1 = y + height;
      x1 = y1 - c;
    }
    let x2 = x + width;
    let y2 = x2 + c;
    if (y2 < y) {
      y2 = y;
      x2 = y2 - c;
    } else if (y2 > y + height) {
      y2 = y + height;
      x2 = y2 - c;
    }
    if (x1 >= x - 0.01 && x1 <= x + width + 0.01 && x2 >= x - 0.01 && x2 <= x + width + 0.01 && (x1 !== x2 || y1 !== y2)) {
      lines.push({ x1, y1, x2, y2 });
    }
  }
  return lines;
}

// 横線（運動障害）。spacingは線同士の間隔(px)。
export function horizontalLines({ x, y, width, height }: Rect, spacing: number): LineSeg[] {
  const lines: LineSeg[] = [];
  for (let ly = y + spacing / 2; ly < y + height; ly += spacing) {
    lines.push({ x1: x, y1: ly, x2: x + width, y2: ly });
  }
  return lines;
}
