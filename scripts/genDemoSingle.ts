import { ROM_MMT_ROWS } from "../src/data/romMmtRows";
import { ADL_ITEMS } from "../src/data/adlItems";
import type { BodyMark, Patient, RomMmtRowValue, AdlItemValue, Rating } from "../src/types";
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

const bodyMarks: BodyMark[] = [
  { id: "bm1", type: "sensory", region: "upperLimb", side: "right" },
  { id: "bm2", type: "motor", region: "upperLimb", side: "right" },
  { id: "bm3", type: "motor", region: "lowerLimb", side: "right" },
  { id: "bm4", type: "sensory", region: "hand", side: "right", handPart: "thumb" },
  { id: "bm5", type: "sensory", region: "hand", side: "right", handPart: "indexMiddle" },
];

const patient: Patient = {
  id: "demo-single",
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
      "右上下肢に中等度の痙性麻痺を認め、特に右手指（母指・示指・中指）の巧緻運動障害及び感覚障害が著明。歩行は短下肢装具及びT字杖を使用し屋内自立、屋外は見守りを要する。日常生活動作は概ね自立しているが、両手動作を要する動作（ボタン留め等）に一部介助を要する。",
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
    bodyMarks,
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

writeFileSync(new URL("./demoSingle.json", import.meta.url), JSON.stringify([patient], null, 2));
console.log("wrote demoSingle.json");
