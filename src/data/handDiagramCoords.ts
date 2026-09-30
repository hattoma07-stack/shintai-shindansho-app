import type { BodyMark, HandPart } from "../types";

// hand-diagram.png (493×315) 上のおおよその矩形座標。
// 向かって左の手が「右手」、右の手が「左手」（ReferenceDiagram の「右／左」ラベルに対応）。

export const HAND_VIEW_BOX = { width: 493, height: 315 };

type Rect = { x: number; y: number; width: number; height: number };

// 右手（向かって左）
const RIGHT_WHOLE: Rect = { x: 0, y: 20, width: 220, height: 280 };
const RIGHT_THUMB: Rect = { x: 0, y: 100, width: 75, height: 100 };
const RIGHT_INDEX_MIDDLE: Rect = { x: 65, y: 30, width: 77, height: 270 };
const RIGHT_RING_LITTLE: Rect = { x: 142, y: 50, width: 74, height: 250 };

// 左手（向かって右、鏡像）
const LEFT_WHOLE: Rect = { x: 273, y: 20, width: 220, height: 280 };
const LEFT_THUMB: Rect = { x: 418, y: 100, width: 75, height: 100 };
const LEFT_INDEX_MIDDLE: Rect = { x: 351, y: 30, width: 77, height: 270 };
const LEFT_RING_LITTLE: Rect = { x: 277, y: 50, width: 74, height: 250 };

const PARTS: Record<"right" | "left", Record<HandPart, Rect>> = {
  right: { whole: RIGHT_WHOLE, thumb: RIGHT_THUMB, indexMiddle: RIGHT_INDEX_MIDDLE, ringLittle: RIGHT_RING_LITTLE },
  left: { whole: LEFT_WHOLE, thumb: LEFT_THUMB, indexMiddle: LEFT_INDEX_MIDDLE, ringLittle: LEFT_RING_LITTLE },
};

export function getHandMarkRects(mark: BodyMark): Rect[] {
  if (mark.region !== "hand") return [];
  const part = mark.handPart ?? "whole";
  if (mark.side === "both") return [PARTS.right[part], PARTS.left[part]];
  if (mark.side === "right" || mark.side === "left") return [PARTS[mark.side][part]];
  return [];
}
