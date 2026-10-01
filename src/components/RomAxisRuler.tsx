// 原本「ROM・MMT測定表」の目盛りは全ての行で共通の固定スケール（マイナス側90度・
// プラス側180度）を使い、各運動方向ごとの参考ROM値を超える部分をグレーで塗って
// 「参考可動域を超える範囲」を示す。実測値が入力されている場合は、その角度まで
// 矢印を重ねて表示する。

const NEG_SCALE = 90;
const POS_SCALE = 180;
const CAP_LABEL_STEP = 30;

type Props = {
  negRef: number; // 0 の場合はマイナス側なし（片方向のみの運動）
  posRef: number;
  negVal: number | null;
  posVal: number | null;
  flip?: boolean; // 左側の目盛りは左右反転して表示する
  showScale?: boolean; // 目盛り数値のヘッダーを表示するか
  width?: number;
  height?: number;
};

export function RomAxisRuler({
  negRef,
  posRef,
  negVal,
  posVal,
  flip = false,
  showScale = false,
  width = 210,
  height = 16,
}: Props) {
  const hasNegSide = negRef > 0 || negVal != null;
  const negScale = hasNegSide ? NEG_SCALE : 0;
  const posScale = POS_SCALE;
  const total = negScale + posScale;
  const pxPerDeg = width / total;
  const zeroX = negScale * pxPerDeg;

  const degToX = (deg: number) => {
    const raw = zeroX + deg * pxPerDeg;
    return flip ? width - raw : raw;
  };

  const ticks: number[] = [];
  for (let d = -negScale; d <= posScale; d += 10) {
    ticks.push(d);
  }

  const hasNeg = negVal != null && negVal > 0;
  const hasPos = posVal != null && posVal > 0;
  const startDeg = hasNeg ? -(negVal as number) : 0;
  const endDeg = hasPos ? (posVal as number) : 0;
  const showArrow = hasNeg || hasPos;

  const topY = showScale ? 12 : 0;
  const baseY = topY + 2;
  const midY = baseY + height / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${topY + height + 6}`}
      className="rom-ruler-svg"
      style={{ width: "100%", maxWidth: width, height: "auto", display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* 参考ROM値を超える範囲（グレー） */}
      {/* html-to-image でのPDF書き出し時にSVGのCSSクラス指定（fill/stroke）が
          反映されないことがあるため、スタイルはここでインライン属性として直接指定する。 */}
      {negScale > 0 && (
        <rect
          x={Math.min(degToX(-negRef), degToX(-negScale))}
          y={baseY}
          width={Math.abs(degToX(-negRef) - degToX(-negScale))}
          height={height}
          fill="#aaaaaa"
        />
      )}
      <rect
        x={Math.min(degToX(posRef), degToX(posScale))}
        y={baseY}
        width={Math.abs(degToX(posScale) - degToX(posRef))}
        height={height}
        fill="#aaaaaa"
      />
      {/* 参考ROM値内（白） */}
      <rect
        x={Math.min(degToX(-negRef), degToX(posRef))}
        y={baseY}
        width={Math.abs(degToX(posRef) - degToX(-negRef))}
        height={height}
        fill="#ffffff"
      />
      {/* 外枠 */}
      <rect x={0} y={baseY} width={width} height={height} fill="none" stroke="#000000" strokeWidth={0.75} />

      {/* 目盛り数値（区間の先頭行のみ表示） */}
      {showScale &&
        ticks
          .filter((d) => d % CAP_LABEL_STEP === 0)
          .map((d) => (
            <text key={`n${d}`} x={degToX(d)} y={9} fontSize={6} fill="#333333" textAnchor="middle">
              {Math.abs(d)}
            </text>
          ))}

      {/* 目盛り線 */}
      {ticks.map((d) => {
        const x = degToX(d);
        const major = d % CAP_LABEL_STEP === 0;
        return (
          <line
            key={d}
            x1={x}
            x2={x}
            y1={baseY}
            y2={major ? baseY + height : baseY + height - 4}
            stroke={major ? "#000000" : "#666666"}
            strokeWidth={major ? 1 : 0.5}
          />
        );
      })}

      {/* 測定値の矢印 */}
      {showArrow && (
        <g>
          <line
            x1={degToX(startDeg)}
            y1={midY}
            x2={degToX(endDeg)}
            y2={midY}
            stroke="#000000"
            strokeWidth={1.6}
            markerStart={hasNeg ? "url(#romArrowHead)" : undefined}
            markerEnd={hasPos ? "url(#romArrowHead)" : undefined}
          />
        </g>
      )}
    </svg>
  );
}

export function RomArrowMarkerDefs() {
  return (
    <svg width={0} height={0}>
      <defs>
        <marker id="romArrowHead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill="#000" />
        </marker>
      </defs>
    </svg>
  );
}
