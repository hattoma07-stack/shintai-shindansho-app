import { ROM_MMT_ROWS } from "../src/data/romMmtRows";
import { ADL_ITEMS } from "../src/data/adlItems";
import type { Patient, RomMmtRowValue, AdlItemValue, Rating, ReflexGrade } from "../src/types";
import { writeFileSync } from "fs";

function romRow(refRom: string, rightFactor: number, leftFactor: number, rightMmt: string, leftMmt: string): RomMmtRowValue {
  const ref = parseFloat(refRom) || 0;
  return {
    rightRom: String(Math.round(ref * rightFactor)),
    rightMmt,
    leftRom: String(Math.round(ref * leftFactor)),
    leftMmt,
  };
}

function buildRomMmt(rightFactor: number, leftFactor: number, rightMmt: string, leftMmt: string): Record<string, RomMmtRowValue> {
  const out: Record<string, RomMmtRowValue> = {};
  for (const row of ROM_MMT_ROWS) {
    out[row.id] = romRow(row.refRom, rightFactor, leftFactor, rightMmt, leftMmt);
  }
  return out;
}

function buildAdl(rating: Rating, lateralRight: Rating, lateralLeft: Rating): Record<string, AdlItemValue> {
  const out: Record<string, AdlItemValue> = {};
  for (const item of ADL_ITEMS) {
    if (item.laterality) {
      out[item.id] = { rating: "", ratingRight: lateralRight, ratingLeft: lateralLeft, note: "" };
    } else {
      out[item.id] = { rating, note: "" };
    }
  }
  return out;
}

const now = Date.now();

const patientA: Patient = {
  id: "demo-a",
  createdAt: now,
  updatedAt: now,
  summary: {
    name: "愛知 一郎",
    birth: { era: "昭和", year: "45", month: "5", day: "10" },
    age: "55",
    gender: "男",
    address: "愛知県名古屋市中区栄一丁目1番1号",
    disabilityName: "右片麻痺（脳血管障害後遺症）",
    causeCategories: ["疾病"],
    causeOther: "",
    diseaseName: "脳梗塞（左中大脳動脈領域）",
    onsetDate: { era: "令和", year: "5", month: "3", day: "2" },
    onsetPlace: "自宅にて発症、救急搬送",
    courseFindings:
      "令和5年3月2日、突然の右上下肢脱力及び構音障害にて発症。当院救急搬送後、頭部MRIにて左中大脳動脈領域の急性期脳梗塞を確認。血栓溶解療法及び急性期リハビリテーションを実施。その後回復期リハビリテーション病棟にて機能訓練を継続するも、右片麻痺（上肢優位）及び感覚障害が残存し、症状固定と判断した。",
    fixedDate: { era: "令和", year: "5", month: "9", day: "2" },
    overallFindings:
      "右上下肢に中等度の痙性麻痺を認め、特に右手指の巧緻運動障害が著明。歩行は短下肢装具及びT字杖を使用し屋内自立、屋外は見守りを要する。日常生活動作は概ね自立しているが、両手動作を要する動作（ボタン留め等）に一部介助を要する。",
    gradeUpperLimb: "3",
    gradeLowerLimb: "4",
    gradeTrunk: "",
    reassessment: "要",
    reassessmentType: "軽度化",
    reassessmentDate: { era: "令和", year: "8", month: "9", day: "" },
    complications: "高血圧症、2型糖尿病、脂質異常症にて内科通院加療中。",
    diagnosisDate: { era: "令和", year: "6", month: "1", day: "10" },
    hospitalName: "愛知総合リハビリテーション病院",
    hospitalAddress: "愛知県名古屋市中区三の丸二丁目2番2号",
    department: "リハビリテーション",
    doctorName: "山田 太郎",
    lawOpinion: "該当する",
    lawOpinionGrade: "3",
  },
  status: {
    sensoryImpairment: "感覚麻痺",
    motorImpairment: ["痙性麻痺"],
    motorImpairmentOther: "",
    originSite: ["脳"],
    originSiteOther: "",
    urinaryBowelDysfunction: "なし",
    deformity: "なし",
    measurements: {
      right: {
        upperLimbLength: "73",
        lowerLimbLength: "85",
        upperArmCirc: "27",
        forearmCirc: "24",
        thighCirc: "45",
        calfCirc: "33",
        gripStrength: "12",
      },
      left: {
        upperLimbLength: "74",
        lowerLimbLength: "86",
        upperArmCirc: "28",
        forearmCirc: "25",
        thighCirc: "47",
        calfCirc: "34",
        gripStrength: "31",
      },
    },
    gaitNormal: false,
    gaitLimitDistance: "500",
    standNormal: false,
    standLimitMinutes: "10",
    oneLegStanding: "不可",
    adl: {
      ...buildAdl("◯", "△", "◯"),
      indoorMove: { rating: "◯", note: "" },
      outdoorMove: { rating: "△", note: "" },
      stairs: { rating: "△", note: "" },
    },
    reflex: {
      upperRight: "＋＋＋",
      upperLeft: "＋＋",
      lowerRight: "＋＋＋",
      lowerLeft: "＋＋",
      babinskiRight: "＋",
      babinskiLeft: "－",
      note: "右側で腱反射亢進及びバビンスキー反射陽性を認める。",
    },
  },
  romMmt: buildRomMmt(0.6, 1.0, "3", "5"),
};

const patientB: Patient = {
  id: "demo-b",
  createdAt: now,
  updatedAt: now,
  summary: {
    name: "尾張 花子",
    birth: { era: "平成", year: "2", month: "11", day: "23" },
    age: "34",
    gender: "女",
    address: "愛知県豊田市西町三丁目4番5号",
    disabilityName: "両下肢機能障害（脊髄損傷）",
    causeCategories: ["交通"],
    causeOther: "",
    diseaseName: "外傷性脊髄損傷（第12胸椎破裂骨折後遺症）",
    onsetDate: { era: "令和", year: "4", month: "7", day: "18" },
    onsetPlace: "国道1号線にて自動車運転中の交通事故、現場より救急搬送",
    courseFindings:
      "令和4年7月18日、交通事故により第12胸椎破裂骨折及び脊髄損傷（Frankel C）を受傷。同日緊急手術（脊椎後方固定術）施行。術後より両下肢の不全麻痺が残存し、リハビリテーションを継続したが下肢筋力の回復は限定的であった。膀胱直腸障害を合併し、自己導尿を導入している。",
    fixedDate: { era: "令和", year: "5", month: "7", day: "18" },
    overallFindings:
      "両下肢に中等度から高度の弛緩性麻痺を認め、両側短下肢装具及び両松葉づえを使用して屋内短距離歩行が可能。長距離移動及び屋外移動は車椅子を使用。体幹バランスは概ね良好で座位保持は自立している。",
    gradeUpperLimb: "",
    gradeLowerLimb: "1",
    gradeTrunk: "3",
    reassessment: "不要",
    reassessmentType: "",
    reassessmentDate: { era: "令和", year: "", month: "", day: "" },
    complications: "神経因性膀胱にて自己導尿を実施中。仙骨部褥瘡の既往あり、現在は治癒。",
    diagnosisDate: { era: "令和", year: "6", month: "2", day: "5" },
    hospitalName: "豊田記念病院",
    hospitalAddress: "愛知県豊田市小坂本町一丁目1番地",
    department: "整形外科",
    doctorName: "鈴木 花子",
    lawOpinion: "該当する",
    lawOpinionGrade: "1",
  },
  status: {
    sensoryImpairment: "感覚脱失",
    motorImpairment: ["弛緩性麻痺"],
    motorImpairmentOther: "",
    originSite: ["脊髄"],
    originSiteOther: "",
    urinaryBowelDysfunction: "あり",
    deformity: "なし",
    measurements: {
      right: {
        upperLimbLength: "72",
        lowerLimbLength: "84",
        upperArmCirc: "24",
        forearmCirc: "22",
        thighCirc: "38",
        calfCirc: "28",
        gripStrength: "27",
      },
      left: {
        upperLimbLength: "72",
        lowerLimbLength: "84",
        upperArmCirc: "24",
        forearmCirc: "22",
        thighCirc: "37",
        calfCirc: "27",
        gripStrength: "26",
      },
    },
    gaitNormal: false,
    gaitLimitDistance: "50",
    standNormal: false,
    standLimitMinutes: "3",
    oneLegStanding: "不可",
    adl: {
      ...buildAdl("◯", "◯", "◯"),
      indoorMove: { rating: "△", note: "" },
      outdoorMove: { rating: "×", note: "" },
      stairs: { rating: "×", note: "" },
      sitWesternToilet: { rating: "△", note: "" },
      toiletCleanup: { rating: "", ratingRight: "△", ratingLeft: "△", note: "" },
    },
    reflex: {
      upperRight: "＋＋",
      upperLeft: "＋＋",
      lowerRight: "－",
      lowerLeft: "－",
      babinskiRight: "－",
      babinskiLeft: "－",
      note: "両下肢腱反射消失。膀胱直腸障害あり自己導尿実施中。",
    },
  },
  romMmt: buildRomMmt(1.0, 1.0, "5", "5"),
};

// 下肢のみ低下（脊髄損傷パターン）を反映
for (const row of ROM_MMT_ROWS) {
  const lowerSections = ["股関節", "膝関節", "足関節", "母趾"];
  if (lowerSections.includes(row.section)) {
    const ref = parseFloat(row.refRom) || 0;
    patientB.romMmt[row.id] = {
      rightRom: String(Math.round(ref * 0.5)),
      rightMmt: "2",
      leftRom: String(Math.round(ref * 0.55)),
      leftMmt: "2",
    };
  }
}

const patientC: Patient = {
  id: "demo-c",
  createdAt: now,
  updatedAt: now,
  summary: {
    name: "三河 次郎",
    birth: { era: "昭和", year: "30", month: "8", day: "2" },
    age: "70",
    gender: "男",
    address: "愛知県岡崎市康生通三丁目6番地",
    disabilityName: "両股関節機能障害（変形性股関節症）",
    causeCategories: ["疾病"],
    causeOther: "",
    diseaseName: "両側変形性股関節症",
    onsetDate: { era: "平成", year: "28", month: "4", day: "" },
    onsetPlace: "自宅にて徐々に発症（誘因なし）",
    courseFindings:
      "数年前より両股関節痛が徐々に増悪し、近医整形外科にて変形性股関節症と診断。保存療法（鎮痛薬、リハビリテーション）を継続するも症状の改善が乏しく、令和5年に右人工股関節全置換術、令和6年に左人工股関節全置換術を施行。術後リハビリテーションを経て可動域はある程度改善したが、著明な可動域制限が残存している。",
    fixedDate: { era: "令和", year: "6", month: "10", day: "1" },
    overallFindings:
      "両股関節の可動域制限が高度で、特に屈曲・外転・内外旋の制限が著しい。歩行は両ロフストランド杖を使用して屋内外とも短距離であれば可能だが、跛行を伴う。しゃがみ込み動作や靴下の着脱など股関節の深い屈曲を要する動作に強い制限がある。",
    gradeUpperLimb: "",
    gradeLowerLimb: "4",
    gradeTrunk: "",
    reassessment: "不要",
    reassessmentType: "",
    reassessmentDate: { era: "令和", year: "", month: "", day: "" },
    complications: "高血圧症、両膝変形性関節症の既往あり。",
    diagnosisDate: { era: "令和", year: "6", month: "11", day: "20" },
    hospitalName: "岡崎中央整形外科病院",
    hospitalAddress: "愛知県岡崎市明大寺町字寺南1番地",
    department: "整形外科",
    doctorName: "田中 三郎",
    lawOpinion: "該当する",
    lawOpinionGrade: "4",
  },
  status: {
    sensoryImpairment: "なし",
    motorImpairment: ["固縮"],
    motorImpairmentOther: "",
    originSite: ["骨関節"],
    originSiteOther: "",
    urinaryBowelDysfunction: "なし",
    deformity: "あり",
    measurements: {
      right: {
        upperLimbLength: "75",
        lowerLimbLength: "88",
        upperArmCirc: "26",
        forearmCirc: "23",
        thighCirc: "44",
        calfCirc: "34",
        gripStrength: "34",
      },
      left: {
        upperLimbLength: "75",
        lowerLimbLength: "87",
        upperArmCirc: "26",
        forearmCirc: "23",
        thighCirc: "43",
        calfCirc: "33",
        gripStrength: "33",
      },
    },
    gaitNormal: false,
    gaitLimitDistance: "300",
    standNormal: false,
    standLimitMinutes: "5",
    oneLegStanding: "不可",
    adl: {
      ...buildAdl("◯", "◯", "◯"),
      sitLegsOut: { rating: "△", note: "" },
      indoorMove: { rating: "◯", note: "" },
      outdoorMove: { rating: "△", note: "" },
      stairs: { rating: "△", note: "" },
      sitWesternToilet: { rating: "◯", note: "" },
      wearPants: { rating: "△", note: "" },
    },
    reflex: {
      upperRight: "＋＋",
      upperLeft: "＋＋",
      lowerRight: "＋＋",
      lowerLeft: "＋＋",
      babinskiRight: "－",
      babinskiLeft: "－",
      note: "両人工股関節置換術後。感覚障害・病的反射は認めない。",
    },
  },
  romMmt: buildRomMmt(1.0, 1.0, "4", "4"),
};

// 股関節のみ高度に制限（変形性股関節症パターン）を反映
for (const row of ROM_MMT_ROWS) {
  if (row.section === "股関節") {
    const ref = parseFloat(row.refRom) || 0;
    patientC.romMmt[row.id] = {
      rightRom: String(Math.round(ref * 0.35)),
      rightMmt: "3",
      leftRom: String(Math.round(ref * 0.4)),
      leftMmt: "3",
    };
  }
}

writeFileSync(
  new URL("./demoPatients.json", import.meta.url),
  JSON.stringify([patientA, patientB, patientC], null, 2)
);
console.log("wrote demoPatients.json");
