// 「ROM・MMT測定表（最新）」原本のような、対になる運動方向を1本の目盛りで
// 表す軸構成。id は romMmtRows.ts の行 id を参照する。
// neg側＝目盛りの左（マイナス方向）、pos側＝目盛りの右（プラス方向）。

export type RomAxisSide = { id: string } | null;

export type RomAxisDef = {
  section: string;
  neg: RomAxisSide;
  pos: RomAxisSide;
  // true のとき、右側（右の測定）のみ左右の文字ラベルの位置を入れ替える
  swapRightLabels?: boolean;
};

export const ROM_MMT_AXES: RomAxisDef[] = [
  { section: "頸", neg: { id: "cspine-ext" }, pos: { id: "cspine-flex" }, swapRightLabels: true },
  { section: "頸", neg: { id: "cspine-leftbend" }, pos: { id: "cspine-rightbend" } },

  { section: "体幹", neg: { id: "tlspine-ext" }, pos: { id: "tlspine-flex" }, swapRightLabels: true },
  { section: "体幹", neg: { id: "tlspine-leftbend" }, pos: { id: "tlspine-rightbend" } },

  { section: "肩", neg: { id: "shoulder-ext" }, pos: { id: "shoulder-flex" }, swapRightLabels: true },
  { section: "肩", neg: { id: "shoulder-add" }, pos: { id: "shoulder-abd" } },
  { section: "肩", neg: { id: "shoulder-ir" }, pos: { id: "shoulder-er" } },

  { section: "肘", neg: { id: "elbow-ext" }, pos: { id: "elbow-flex" } },

  { section: "前腕", neg: { id: "forearm-pro" }, pos: { id: "forearm-sup" }, swapRightLabels: true },

  { section: "手", neg: { id: "wrist-flex" }, pos: { id: "wrist-ext" } },

  { section: "中手指節(MP)", neg: { id: "mp-t-ext" }, pos: { id: "mp-t-flex" }, swapRightLabels: true },
  { section: "中手指節(MP)", neg: { id: "mp-i-ext" }, pos: { id: "mp-i-flex" }, swapRightLabels: true },
  { section: "中手指節(MP)", neg: { id: "mp-m-ext" }, pos: { id: "mp-m-flex" }, swapRightLabels: true },
  { section: "中手指節(MP)", neg: { id: "mp-r-ext" }, pos: { id: "mp-r-flex" }, swapRightLabels: true },
  { section: "中手指節(MP)", neg: { id: "mp-l-ext" }, pos: { id: "mp-l-flex" }, swapRightLabels: true },
  { section: "近位指節(PIP)", neg: { id: "pip-t-ext" }, pos: { id: "pip-t-flex" }, swapRightLabels: true },
  { section: "近位指節(PIP)", neg: { id: "pip-i-ext" }, pos: { id: "pip-i-flex" }, swapRightLabels: true },
  { section: "近位指節(PIP)", neg: { id: "pip-m-ext" }, pos: { id: "pip-m-flex" }, swapRightLabels: true },
  { section: "近位指節(PIP)", neg: { id: "pip-r-ext" }, pos: { id: "pip-r-flex" }, swapRightLabels: true },
  { section: "近位指節(PIP)", neg: { id: "pip-l-ext" }, pos: { id: "pip-l-flex" }, swapRightLabels: true },


  { section: "股", neg: { id: "hip-ext" }, pos: { id: "hip-flex" }, swapRightLabels: true },
  { section: "股", neg: { id: "hip-add" }, pos: { id: "hip-abd" }, swapRightLabels: true },
  { section: "股", neg: { id: "hip-ir" }, pos: { id: "hip-er" }, swapRightLabels: true },

  { section: "膝", neg: { id: "knee-ext" }, pos: { id: "knee-flex" } },

  { section: "足", neg: { id: "ankle-plantar" }, pos: { id: "ankle-dorsi" } },

];
