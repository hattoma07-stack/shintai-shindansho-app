export type RomMmtRowDef = {
  id: string;
  section: string; // 部位（先頭行のみ表示）
  movement: string; // 運動方向
  refRom: string; // 参考ROM値
};

// スプレッドシート「ROM・MMT測定表」（シンプル表形式）の内容をそのまま採用
export const ROM_MMT_ROWS: RomMmtRowDef[] = [
  { id: "shoulder-flex", section: "肩関節", movement: "前屈（屈曲）", refRom: "180°" },
  { id: "shoulder-ext", section: "肩関節", movement: "後屈（伸展）", refRom: "60°" },
  { id: "shoulder-abd", section: "肩関節", movement: "外転", refRom: "180°" },
  { id: "shoulder-add", section: "肩関節", movement: "内転", refRom: "0°" },
  { id: "shoulder-er", section: "肩関節", movement: "外旋", refRom: "60°" },
  { id: "shoulder-ir", section: "肩関節", movement: "内旋", refRom: "80°" },

  { id: "elbow-flex", section: "肘関節", movement: "屈曲", refRom: "145°" },
  { id: "elbow-ext", section: "肘関節", movement: "伸展", refRom: "5°" },

  { id: "forearm-sup", section: "前腕", movement: "回外", refRom: "90°" },
  { id: "forearm-pro", section: "前腕", movement: "回内", refRom: "90°" },

  { id: "wrist-ext", section: "手関節", movement: "背屈（伸展）", refRom: "70°" },
  { id: "wrist-flex", section: "手関節", movement: "掌屈（屈曲）", refRom: "90°" },
  { id: "wrist-radial", section: "手関節", movement: "橈屈", refRom: "25°" },
  { id: "wrist-ulnar", section: "手関節", movement: "尺屈", refRom: "55°" },

  { id: "thumb-radialabd", section: "母指", movement: "橈側外転", refRom: "60°" },
  { id: "thumb-palmarabd", section: "母指", movement: "掌側外転", refRom: "90°" },
  { id: "thumb-mcp", section: "母指", movement: "屈曲（MCP）", refRom: "60°" },
  { id: "thumb-ip", section: "母指", movement: "屈曲（IP）", refRom: "80°" },

  { id: "finger-mcpflex", section: "示指〜小指", movement: "屈曲（MCP）", refRom: "90°" },
  { id: "finger-mcpext", section: "示指〜小指", movement: "伸展（MCP）", refRom: "45°" },
  { id: "finger-pip", section: "示指〜小指", movement: "屈曲（PIP）", refRom: "100°" },
  { id: "finger-dip", section: "示指〜小指", movement: "屈曲（DIP）", refRom: "80°" },

  { id: "hip-flex", section: "股関節", movement: "屈曲", refRom: "125°" },
  { id: "hip-ext", section: "股関節", movement: "伸展", refRom: "15°" },
  { id: "hip-abd", section: "股関節", movement: "外転", refRom: "45°" },
  { id: "hip-add", section: "股関節", movement: "内転", refRom: "20°" },
  { id: "hip-er", section: "股関節", movement: "外旋", refRom: "45°" },
  { id: "hip-ir", section: "股関節", movement: "内旋", refRom: "45°" },

  { id: "knee-flex", section: "膝関節", movement: "屈曲", refRom: "130°" },
  { id: "knee-ext", section: "膝関節", movement: "伸展", refRom: "0°" },

  { id: "ankle-dorsi", section: "足関節", movement: "背屈（屈曲）", refRom: "20°" },
  { id: "ankle-plantar", section: "足関節", movement: "底屈（伸展）", refRom: "45°" },
  { id: "ankle-eversion", section: "足関節", movement: "外反（外転）", refRom: "20°" },
  { id: "ankle-inversion", section: "足関節", movement: "内反（内転）", refRom: "30°" },

  { id: "greattoe-mcpflex", section: "母趾", movement: "屈曲（MTP）", refRom: "35°" },
  { id: "greattoe-mcpext", section: "母趾", movement: "伸展（MTP）", refRom: "60°" },

  { id: "cspine-flex", section: "頸椎", movement: "前屈", refRom: "60°" },
  { id: "cspine-ext", section: "頸椎", movement: "後屈", refRom: "50°" },
  { id: "cspine-leftbend", section: "頸椎", movement: "左側屈", refRom: "50°" },
  { id: "cspine-rightbend", section: "頸椎", movement: "右側屈", refRom: "50°" },
  { id: "cspine-leftrot", section: "頸椎", movement: "左回旋", refRom: "60°" },
  { id: "cspine-rightrot", section: "頸椎", movement: "右回旋", refRom: "60°" },

  { id: "tlspine-flex", section: "胸腰椎", movement: "前屈", refRom: "45°" },
  { id: "tlspine-ext", section: "胸腰椎", movement: "後屈", refRom: "30°" },
  { id: "tlspine-leftbend", section: "胸腰椎", movement: "左側屈", refRom: "50°" },
  { id: "tlspine-rightbend", section: "胸腰椎", movement: "右側屈", refRom: "50°" },
  { id: "tlspine-leftrot", section: "胸腰椎", movement: "左回旋", refRom: "40°" },
  { id: "tlspine-rightrot", section: "胸腰椎", movement: "右回旋", refRom: "40°" },
];
