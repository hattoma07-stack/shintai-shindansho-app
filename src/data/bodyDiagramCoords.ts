import type { BodyMark } from "../types";

// body-diagram.png (560×494) 上の各部位のおおよその矩形座標。
// 正面図はローカル座標のまま、背面図は X 方向に BACK_OFFSET だけ平行移動して使う。
// 「右」はどちらの図でも向かって左側（本人から見て右）として単純化して統一している。
// 上肢は体幹の左右半身も含めて一つの部位として扱う。

export const VIEW_BOX = { width: 560, height: 494 };
const BACK_OFFSET = 295;

type Rect = { x: number; y: number; width: number; height: number };

const FACE: Rect = { x: 58, y: 5, width: 122, height: 87 };
const TRUNK = { x: 58, y: 92, width: 132, height: 168 };
const TRUNK_HALF: Record<"right" | "left", Rect> = {
  right: { x: TRUNK.x, y: TRUNK.y, width: TRUNK.width / 2, height: TRUNK.height },
  left: { x: TRUNK.x + TRUNK.width / 2, y: TRUNK.y, width: TRUNK.width / 2, height: TRUNK.height },
};

const LIMB_Y = {
  upperLimb: { top: 95, bottom: 260 },
  lowerLimb: { top: 260, bottom: 480 },
};

const LIMB_X = {
  upperLimb: { right: { x: 5, width: 75 }, left: { x: 180, width: 75 } },
  lowerLimb: { right: { x: 63, width: 62 }, left: { x: 125, width: 62 } },
};

function limbRect(region: "upperLimb" | "lowerLimb", side: "right" | "left"): Rect {
  const xInfo = LIMB_X[region][side];
  const yInfo = LIMB_Y[region];
  return { x: xInfo.x, y: yInfo.top, width: xInfo.width, height: yInfo.bottom - yInfo.top };
}

function frontRects(mark: BodyMark): Rect[] {
  if (mark.region === "face") return [FACE];
  if (mark.region === "upperLimb") {
    if (mark.side === "both") {
      return [limbRect("upperLimb", "right"), limbRect("upperLimb", "left"), TRUNK];
    }
    if (mark.side === "right" || mark.side === "left") {
      return [limbRect("upperLimb", mark.side), TRUNK_HALF[mark.side]];
    }
    return [];
  }
  if (mark.region === "lowerLimb") {
    if (mark.side === "both") return [limbRect("lowerLimb", "right"), limbRect("lowerLimb", "left")];
    if (mark.side === "right" || mark.side === "left") return [limbRect("lowerLimb", mark.side)];
    return [];
  }
  return [];
}

export function getMarkRects(mark: BodyMark): { front: Rect; back: Rect }[] {
  return frontRects(mark).map((front) => ({ front, back: { ...front, x: front.x + BACK_OFFSET } }));
}
