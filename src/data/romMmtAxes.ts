// 「ROM・MMT測定表（最新）」原本のような、対になる運動方向を1本の目盛りで
// 表す軸構成。id は romMmtRows.ts の行 id を参照する。
// neg側＝目盛りの左（マイナス方向）、pos側＝目盛りの右（プラス方向）。

export type RomAxisSide = { id: string } | null;

export type RomAxisDef = {
  section: string;
  neg: RomAxisSide;
  pos: RomAxisSide;
};

export const ROM_MMT_AXES: RomAxisDef[] = [
  { section: "頸", neg: { id: "cspine-ext" }, pos: { id: "cspine-flex" } },
  { section: "頸", neg: { id: "cspine-leftbend" }, pos: { id: "cspine-rightbend" } },

  { section: "体幹", neg: { id: "tlspine-ext" }, pos: { id: "tlspine-flex" } },
  { section: "体幹", neg: { id: "tlspine-leftbend" }, pos: { id: "tlspine-rightbend" } },

  { section: "肩", neg: { id: "shoulder-ext" }, pos: { id: "shoulder-flex" } },

  { section: "肘", neg: { id: "elbow-ext" }, pos: { id: "elbow-flex" } },

  { section: "前腕", neg: { id: "forearm-pro" }, pos: { id: "forearm-sup" } },

  { section: "手", neg: { id: "wrist-flex" }, pos: { id: "wrist-ext" } },

  { section: "中手指節(MP)", neg: { id: "mp-t-ext" }, pos: { id: "mp-t-flex" } },
  { section: "中手指節(MP)", neg: { id: "mp-i-ext" }, pos: { id: "mp-i-flex" } },
  { section: "中手指節(MP)", neg: { id: "mp-m-ext" }, pos: { id: "mp-m-flex" } },
  { section: "中手指節(MP)", neg: { id: "mp-r-ext" }, pos: { id: "mp-r-flex" } },
  { section: "中手指節(MP)", neg: { id: "mp-l-ext" }, pos: { id: "mp-l-flex" } },
  { section: "近位指節(PIP)", neg: { id: "pip-t-ext" }, pos: { id: "pip-t-flex" } },
  { section: "近位指節(PIP)", neg: { id: "pip-i-ext" }, pos: { id: "pip-i-flex" } },
  { section: "近位指節(PIP)", neg: { id: "pip-m-ext" }, pos: { id: "pip-m-flex" } },
  { section: "近位指節(PIP)", neg: { id: "pip-r-ext" }, pos: { id: "pip-r-flex" } },
  { section: "近位指節(PIP)", neg: { id: "pip-l-ext" }, pos: { id: "pip-l-flex" } },


  { section: "股", neg: { id: "hip-ext" }, pos: { id: "hip-flex" } },
  { section: "股", neg: { id: "hip-add" }, pos: { id: "hip-abd" } },
  { section: "股", neg: { id: "hip-ir" }, pos: { id: "hip-er" } },

  { section: "膝", neg: { id: "knee-ext" }, pos: { id: "knee-flex" } },

  { section: "足", neg: { id: "ankle-plantar" }, pos: { id: "ankle-dorsi" } },

];
