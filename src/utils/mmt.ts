// 原本の注記に基づく筋力テスト(MMT)数値→記号の変換
// ×＝筋力0・1・2（消失または著減）　△＝筋力3（半減）　○＝筋力4・5（正常またはやや減）
export function mmtToSymbol(mmt: string | undefined): string {
  if (!mmt) return "";
  const n = Number(mmt);
  if (Number.isNaN(n)) return "";
  if (n <= 2) return "×";
  if (n === 3) return "△";
  return "○";
}
