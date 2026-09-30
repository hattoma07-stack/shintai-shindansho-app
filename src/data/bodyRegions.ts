import type { BodyRegion, HandPart } from "../types";

// 上肢は体幹（左右半身）を含めて左右で判断するため、体幹は独立した選択肢としては持たない。
export const REGION_OPTIONS: { value: BodyRegion; label: string; hasSide: boolean }[] = [
  { value: "face", label: "顔面", hasSide: false },
  { value: "upperLimb", label: "上肢", hasSide: true },
  { value: "lowerLimb", label: "下肢", hasSide: true },
  { value: "hand", label: "手指", hasSide: true },
];

export const REGION_LABEL: Record<BodyRegion, string> = {
  face: "顔面",
  trunk: "体幹",
  upperLimb: "上肢",
  lowerLimb: "下肢",
  hand: "手指",
};

export const SIDE_LABEL: Record<string, string> = {
  right: "右",
  left: "左",
  both: "両側",
  "": "",
};

export const HAND_PART_OPTIONS: { value: HandPart; label: string }[] = [
  { value: "whole", label: "手全体" },
  { value: "thumb", label: "親指のみ" },
  { value: "indexMiddle", label: "人差し指と中指" },
  { value: "ringLittle", label: "薬指と小指" },
];

export const HAND_PART_LABEL: Record<HandPart, string> = {
  whole: "手全体",
  thumb: "親指のみ",
  indexMiddle: "人差し指と中指",
  ringLittle: "薬指と小指",
};
