export type RomMmtRowDef = {
  id: string;
  section: string; // 部位（先頭行のみ表示）
  movement: string; // 運動方向
  refRom: string; // 参考ROM値
};

// スプレッドシート「ROM・MMT測定表」（シンプル表形式）の内容をそのまま採用
export const ROM_MMT_ROWS: RomMmtRowDef[] = [
  { id: "shoulder-flex", section: "肩関節", movement: "屈曲", refRom: "180°" },
  { id: "shoulder-ext", section: "肩関節", movement: "伸展", refRom: "60°" },
  { id: "shoulder-abd", section: "肩関節", movement: "外転", refRom: "180°" },
  { id: "shoulder-add", section: "肩関節", movement: "内転", refRom: "0°" },
  { id: "shoulder-er", section: "肩関節", movement: "外旋", refRom: "60°" },
  { id: "shoulder-ir", section: "肩関節", movement: "内旋", refRom: "80°" },

  { id: "elbow-flex", section: "肘関節", movement: "屈曲", refRom: "145°" },
  { id: "elbow-ext", section: "肘関節", movement: "伸展", refRom: "5°" },

  { id: "forearm-sup", section: "前腕", movement: "回外", refRom: "90°" },
  { id: "forearm-pro", section: "前腕", movement: "回内", refRom: "90°" },

  { id: "wrist-ext", section: "手関節", movement: "背屈", refRom: "70°" },
  { id: "wrist-flex", section: "手関節", movement: "掌屈", refRom: "90°" },

  { id: "mp-t-flex", section: "中手指節(MP)", movement: "母 屈曲", refRom: "60°" },
  { id: "mp-t-ext", section: "中手指節(MP)", movement: "母 伸展", refRom: "10°" },
  { id: "mp-i-flex", section: "中手指節(MP)", movement: "示 屈曲", refRom: "90°" },
  { id: "mp-i-ext", section: "中手指節(MP)", movement: "示 伸展", refRom: "45°" },
  { id: "mp-m-flex", section: "中手指節(MP)", movement: "中 屈曲", refRom: "90°" },
  { id: "mp-m-ext", section: "中手指節(MP)", movement: "中 伸展", refRom: "45°" },
  { id: "mp-r-flex", section: "中手指節(MP)", movement: "環 屈曲", refRom: "90°" },
  { id: "mp-r-ext", section: "中手指節(MP)", movement: "環 伸展", refRom: "45°" },
  { id: "mp-l-flex", section: "中手指節(MP)", movement: "小 屈曲", refRom: "90°" },
  { id: "mp-l-ext", section: "中手指節(MP)", movement: "小 伸展", refRom: "45°" },

  { id: "pip-t-flex", section: "近位指節(PIP)", movement: "母 屈曲", refRom: "80°" },
  { id: "pip-t-ext", section: "近位指節(PIP)", movement: "母 伸展", refRom: "0°" },
  { id: "pip-i-flex", section: "近位指節(PIP)", movement: "示 屈曲", refRom: "100°" },
  { id: "pip-i-ext", section: "近位指節(PIP)", movement: "示 伸展", refRom: "0°" },
  { id: "pip-m-flex", section: "近位指節(PIP)", movement: "中 屈曲", refRom: "100°" },
  { id: "pip-m-ext", section: "近位指節(PIP)", movement: "中 伸展", refRom: "0°" },
  { id: "pip-r-flex", section: "近位指節(PIP)", movement: "環 屈曲", refRom: "100°" },
  { id: "pip-r-ext", section: "近位指節(PIP)", movement: "環 伸展", refRom: "0°" },
  { id: "pip-l-flex", section: "近位指節(PIP)", movement: "小 屈曲", refRom: "100°" },
  { id: "pip-l-ext", section: "近位指節(PIP)", movement: "小 伸展", refRom: "0°" },

  { id: "hip-flex", section: "股関節", movement: "屈曲", refRom: "125°" },
  { id: "hip-ext", section: "股関節", movement: "伸展", refRom: "15°" },
  { id: "hip-abd", section: "股関節", movement: "外転", refRom: "45°" },
  { id: "hip-add", section: "股関節", movement: "内転", refRom: "20°" },
  { id: "hip-er", section: "股関節", movement: "外旋", refRom: "45°" },
  { id: "hip-ir", section: "股関節", movement: "内旋", refRom: "45°" },

  { id: "knee-flex", section: "膝関節", movement: "屈曲", refRom: "130°" },
  { id: "knee-ext", section: "膝関節", movement: "伸展", refRom: "0°" },

  { id: "ankle-dorsi", section: "足関節", movement: "背屈", refRom: "20°" },
  { id: "ankle-plantar", section: "足関節", movement: "底屈", refRom: "45°" },

  { id: "cspine-flex", section: "頸椎", movement: "前屈", refRom: "60°" },
  { id: "cspine-ext", section: "頸椎", movement: "後屈", refRom: "50°" },
  { id: "cspine-leftbend", section: "頸椎", movement: "左屈", refRom: "50°" },
  { id: "cspine-rightbend", section: "頸椎", movement: "右屈", refRom: "50°" },

  { id: "tlspine-flex", section: "胸腰椎", movement: "前屈", refRom: "45°" },
  { id: "tlspine-ext", section: "胸腰椎", movement: "後屈", refRom: "30°" },
  { id: "tlspine-leftbend", section: "胸腰椎", movement: "左屈", refRom: "50°" },
  { id: "tlspine-rightbend", section: "胸腰椎", movement: "右屈", refRom: "50°" },
];
