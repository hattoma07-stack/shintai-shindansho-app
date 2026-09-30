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
  { section: "頸", neg: { id: "cspine-leftrot" }, pos: { id: "cspine-rightrot" } },

  { section: "体幹", neg: { id: "tlspine-ext" }, pos: { id: "tlspine-flex" } },
  { section: "体幹", neg: { id: "tlspine-leftbend" }, pos: { id: "tlspine-rightbend" } },
  { section: "体幹", neg: { id: "tlspine-leftrot" }, pos: { id: "tlspine-rightrot" } },

  { section: "肩", neg: { id: "shoulder-ext" }, pos: { id: "shoulder-flex" } },
  { section: "肩", neg: { id: "shoulder-add" }, pos: { id: "shoulder-abd" } },
  { section: "肩", neg: { id: "shoulder-ir" }, pos: { id: "shoulder-er" } },

  { section: "肘", neg: { id: "elbow-ext" }, pos: { id: "elbow-flex" } },

  { section: "前腕", neg: { id: "forearm-pro" }, pos: { id: "forearm-sup" } },

  { section: "手", neg: { id: "wrist-flex" }, pos: { id: "wrist-ext" } },
  { section: "手", neg: { id: "wrist-ulnar" }, pos: { id: "wrist-radial" } },

  { section: "母指", neg: null, pos: { id: "thumb-radialabd" } },
  { section: "母指", neg: null, pos: { id: "thumb-palmarabd" } },
  { section: "母指(MP)", neg: null, pos: { id: "thumb-mcp" } },
  { section: "母指(IP)", neg: null, pos: { id: "thumb-ip" } },

  { section: "中手指節(MP)", neg: { id: "finger-mcpext" }, pos: { id: "finger-mcpflex" } },
  { section: "近位指節(PIP)", neg: null, pos: { id: "finger-pip" } },
  { section: "DIP", neg: null, pos: { id: "finger-dip" } },

  { section: "股", neg: { id: "hip-ext" }, pos: { id: "hip-flex" } },
  { section: "股", neg: { id: "hip-add" }, pos: { id: "hip-abd" } },
  { section: "股", neg: { id: "hip-ir" }, pos: { id: "hip-er" } },

  { section: "膝", neg: { id: "knee-ext" }, pos: { id: "knee-flex" } },

  { section: "足", neg: { id: "ankle-plantar" }, pos: { id: "ankle-dorsi" } },
  { section: "足", neg: { id: "ankle-inversion" }, pos: { id: "ankle-eversion" } },

  { section: "母趾(MTP)", neg: { id: "greattoe-mcpext" }, pos: { id: "greattoe-mcpflex" } },
];
