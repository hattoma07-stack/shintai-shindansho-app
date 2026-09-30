export type AdlItemDef = {
  id: string;
  label: string;
  laterality: boolean; // true = 右/左別に評価
};

// スプレッドシート「肢体不自由の状況及び所見(最新）」の動作・活動 18項目
export const ADL_ITEMS: AdlItemDef[] = [
  { id: "rollOver", label: "寝返りをする", laterality: false },
  { id: "sitLegsOut", label: "足を投げ出して座る", laterality: false },
  { id: "sitOnChair", label: "椅子に腰掛ける", laterality: false },
  { id: "stand", label: "立つ（手すり、壁、つえ、松葉づえ、義肢、装具）", laterality: false },
  { id: "indoorMove", label: "家の中の移動（壁、つえ、松葉づえ、義肢、装具、車椅子）", laterality: false },
  { id: "sitWesternToilet", label: "洋式便器に座る", laterality: false },
  { id: "toiletCleanup", label: "排泄の後始末をする", laterality: true },
  { id: "eatWithUtensils", label: "（箸で）食事をする（スプーン、自助具）", laterality: true },
  { id: "drinkFromCup", label: "コップで水を飲む", laterality: true },
  { id: "wearShirt", label: "シャツを着て脱ぐ", laterality: false },
  { id: "wearPants", label: "ズボンをはいて脱ぐ（自助具）", laterality: false },
  { id: "brushTeeth", label: "ブラッシで歯を磨く（自助具）", laterality: true },
  { id: "washFace", label: "顔を洗いタオルでふく", laterality: false },
  { id: "wringTowel", label: "タオルを絞る", laterality: false },
  { id: "washBack", label: "背中を洗う", laterality: false },
  { id: "stairs", label: "二階まで階段を上って下りる（手すり、つえ、松葉づえ）", laterality: false },
  { id: "outdoorMove", label: "屋外を移動する（家の周辺程度）（つえ、松葉づえ、車椅子）", laterality: false },
  { id: "publicTransport", label: "公共の乗物を利用する", laterality: false },
];
