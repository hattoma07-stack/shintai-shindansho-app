export const ERA_OPTIONS = ["令和", "平成", "昭和", "大正", "明治", "西暦"];

export const CAUSE_CATEGORY_OPTIONS = [
  "交通",
  "労災",
  "その他の事故",
  "戦傷",
  "戦災",
  "自然災害",
  "疾病",
  "先天性",
  "その他",
];

export const SENSORY_IMPAIRMENT_OPTIONS = ["なし", "感覚脱失", "感覚麻痺", "異常感覚"];

export const MOTOR_IMPAIRMENT_OPTIONS = [
  "なし",
  "弛緩性麻痺",
  "痙性麻痺",
  "固縮",
  "不随意運動",
  "しんせん",
  "運動失調",
  "その他",
];

export const ORIGIN_SITE_OPTIONS = ["脳", "脊髄", "末梢神経", "筋肉", "骨関節", "その他"];

export const RATING_OPTIONS = ["◯", "△", "×"] as const;
export const RATING_LABELS: Record<string, string> = {
  "◯": "◯ 自立",
  "△": "△ 半介助",
  "×": "× 全介助又は不能",
};

export const REFLEX_OPTIONS = ["＋＋＋", "＋＋", "＋", "＋－", "－"] as const;

export const MMT_OPTIONS = ["0", "1", "2", "3", "4", "5"];
