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
  height = 28,
}: Props) {
  const negScale = NEG_SCALE;
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

  // 入力された側（0°やマイナス値を含む）の端に矢じりを付ける。伸展側の値が
  // マイナスなら（例：-10°）、0より屈曲側にずれた位置が端点になる。
  const hasNeg = negVal != null;
  const hasPos = posVal != null;
  const clampDeg = (d: number) => Math.max(-negScale, Math.min(posScale, d));
  const startDeg = hasNeg ? clampDeg(-(negVal as number)) : 0;
  const endDeg = hasPos ? clampDeg(posVal as number) : 0;
  const showArrow = (hasNeg || hasPos) && startDeg !== endDeg;
  const onlyZero = (hasNeg || hasPos) && startDeg === endDeg;
  // 端点から見て、もう一方の端と反対向きが矢じりの向き
  const headDir = (fromDeg: number, otherDeg: number): 1 | -1 => {
    const degDir = fromDeg <= otherDeg ? -1 : 1;
    return (flip ? -degDir : degDir) as 1 | -1;
  };

  // 矢印が短い（値が近い）ときは矢じりも小さくして、線が矢じりに隠れないようにする
  const arrowLen = Math.abs(degToX(endDeg) - degToX(startDeg));
  const headSize = Math.max(HEAD_MIN, Math.min(HEAD_MAX, arrowLen * 0.5));

  const topY = showScale ? 16 : 0;
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
      <rect x={0} y={baseY} width={width} height={height} fill="none" stroke="#000000" strokeWidth={1.2} />

      {/* 目盛り数値（区間の先頭行のみ表示） */}
      {showScale &&
        ticks
          .filter((d) => d % CAP_LABEL_STEP === 0)
          .map((d) => (
            <text
              key={`n${d}`}
              x={degToX(d)}
              y={12}
              fontSize={10}
              fill="#333333"
              textAnchor={degToX(d) < 8 ? "start" : degToX(d) > width - 8 ? "end" : "middle"}
            >
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
            y2={major ? baseY + height : baseY + height - 6}
            stroke={major ? "#000000" : "#666666"}
            strokeWidth={major ? 1.4 : 0.8}
          />
        );
      })}

      {/* 測定値の矢印（矢じりは長さに関わらず一定サイズで描く） */}
      {showArrow && (
        <g>
          <line
            x1={degToX(startDeg)}
            y1={midY}
            x2={degToX(endDeg)}
            y2={midY}
            stroke="#000000"
            strokeWidth={3.5}
          />
          {hasPos && <ArrowHead tipX={degToX(endDeg)} y={midY} dir={headDir(endDeg, startDeg)} size={headSize} />}
          {hasNeg && <ArrowHead tipX={degToX(startDeg)} y={midY} dir={headDir(startDeg, endDeg)} size={headSize} />}
        </g>
      )}
      {/* 0°と入力された場合は0の位置に印を付ける */}
      {onlyZero && <circle cx={degToX(startDeg)} cy={midY} r={5.5} fill="#000000" />}
    </svg>
  );
}

const HEAD_MAX = 16;
const HEAD_MIN = 9;

function ArrowHead({ tipX, y, dir, size }: { tipX: number; y: number; dir: 1 | -1; size: number }) {
  const HEAD = size;
  const baseX = tipX - dir * HEAD;
  return <polygon points={`${tipX},${y} ${baseX},${y - HEAD * 0.45} ${baseX},${y + HEAD * 0.45}`} fill="#000000" />;
}
