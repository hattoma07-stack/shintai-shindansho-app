// 身体障害者診断書・意見書（肢体不自由障害用）データモデル

export type EraDate = {
  era: string; // 明治/大正/昭和/平成/令和/西暦
  year: string;
  month: string;
  day: string;
};

export const emptyEraDate = (): EraDate => ({ era: "令和", year: "", month: "", day: "" });

export type Rating = "" | "◯" | "△" | "×";
export type ReflexGrade = "" | "＋＋＋" | "＋＋" | "＋" | "＋－" | "－";

export type SummaryData = {
  name: string;
  birth: EraDate;
  age: string;
  gender: "" | "男" | "女";
  address: string;

  disabilityName: string;

  causeCategories: string[]; // 交通/労災/その他の事故/戦傷/戦災/自然災害/疾病/先天性/その他
  causeOther: string;
  diseaseName: string;

  onsetDate: EraDate;
  onsetPlace: string;

  courseFindings: string;

  fixedDate: EraDate;

  overallFindings: string;
  gradeUpperLimb: string;
  gradeLowerLimb: string;
  gradeTrunk: string;

  reassessment: "" | "要" | "不要";
  reassessmentType: string; // 軽度化・重度化
  reassessmentDate: EraDate;

  complications: string;

  diagnosisDate: EraDate;
  hospitalName: string;
  hospitalAddress: string;
  department: string;
  doctorName: string;

  lawOpinion: "" | "該当する" | "該当しない";
  lawOpinionGrade: string;
};

export const emptySummary = (): SummaryData => ({
  name: "",
  birth: emptyEraDate(),
  age: "",
  gender: "",
  address: "",
  disabilityName: "",
  causeCategories: [],
  causeOther: "",
  diseaseName: "",
  onsetDate: emptyEraDate(),
  onsetPlace: "",
  courseFindings: "",
  fixedDate: emptyEraDate(),
  overallFindings: "",
  gradeUpperLimb: "",
  gradeLowerLimb: "",
  gradeTrunk: "",
  reassessment: "",
  reassessmentType: "",
  reassessmentDate: emptyEraDate(),
  complications: "",
  diagnosisDate: emptyEraDate(),
  hospitalName: "",
  hospitalAddress: "",
  department: "",
  doctorName: "",
  lawOpinion: "",
  lawOpinionGrade: "",
});

export type SideMeasurements = {
  upperLimbLength: string;
  lowerLimbLength: string;
  upperArmCirc: string;
  forearmCirc: string;
  thighCirc: string;
  calfCirc: string;
  gripStrength: string;
};

export const emptySideMeasurements = (): SideMeasurements => ({
  upperLimbLength: "",
  lowerLimbLength: "",
  upperArmCirc: "",
  forearmCirc: "",
  thighCirc: "",
  calfCirc: "",
  gripStrength: "",
});

export type BodyMarkType = "sensory" | "motor";
export type BodyRegion = "face" | "trunk" | "upperLimb" | "lowerLimb" | "hand";
export type BodySide = "" | "right" | "left" | "both"; // 顔面は側の指定なし
export type HandPart = "whole" | "thumb" | "indexMiddle" | "ringLittle";

export type BodyMark = {
  id: string;
  type: BodyMarkType;
  region: BodyRegion;
  side: BodySide;
  handPart?: HandPart; // region が hand のときのみ使用
};

export type AdlItemValue = {
  rating: Rating;
  ratingRight?: Rating; // for laterality items
  ratingLeft?: Rating;
  note: string;
};

export const emptyAdlItemValue = (): AdlItemValue => ({ rating: "", note: "" });

export type StatusData = {
  sensoryImpairment: string; // なし・感覚脱失・感覚麻痺・異常感覚
  motorImpairment: string[]; // なし・弛緩性麻痺・痙性麻痺・固縮・不随意運動・しんせん・運動失調・その他
  motorImpairmentOther: string;
  originSite: string[]; // 脳・脊髄・末梢神経・筋肉・骨関節・その他
  originSiteOther: string;
  urinaryBowelDysfunction: "" | "なし" | "あり";
  deformity: "" | "なし" | "あり";

  measurements: { right: SideMeasurements; left: SideMeasurements };

  gaitNormal: boolean;
  gaitLimitDistance: string; // m以上歩行不能
  standNormal: boolean;
  standLimitMinutes: string; // 分以上困難
  oneLegStanding: "" | "可" | "不可";

  adl: Record<string, AdlItemValue>;

  bodyMarks: BodyMark[];

  reflex: {
    upperRight: ReflexGrade;
    upperLeft: ReflexGrade;
    lowerRight: ReflexGrade;
    lowerLeft: ReflexGrade;
    babinskiRight: ReflexGrade;
    babinskiLeft: ReflexGrade;
    note: string;
  };
};

export const emptyStatus = (): StatusData => ({
  sensoryImpairment: "",
  motorImpairment: [],
  motorImpairmentOther: "",
  originSite: [],
  originSiteOther: "",
  urinaryBowelDysfunction: "",
  deformity: "",
  measurements: { right: emptySideMeasurements(), left: emptySideMeasurements() },
  gaitNormal: false,
  gaitLimitDistance: "",
  standNormal: false,
  standLimitMinutes: "",
  oneLegStanding: "",
  adl: {},
  bodyMarks: [],
  reflex: {
    upperRight: "",
    upperLeft: "",
    lowerRight: "",
    lowerLeft: "",
    babinskiRight: "",
    babinskiLeft: "",
    note: "",
  },
});

export type RomMmtRowValue = {
  rightRom: string;
  rightMmt: string;
  leftRom: string;
  leftMmt: string;
};

export const emptyRomMmtRowValue = (): RomMmtRowValue => ({
  rightRom: "",
  rightMmt: "",
  leftRom: "",
  leftMmt: "",
});

export type Patient = {
  id: string;
  createdAt: number;
  updatedAt: number;
  summary: SummaryData;
  status: StatusData;
  romMmt: Record<string, RomMmtRowValue>; // key = rowId
};

export const emptyPatient = (id: string): Patient => ({
  id,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  summary: emptySummary(),
  status: emptyStatus(),
  romMmt: {},
});
