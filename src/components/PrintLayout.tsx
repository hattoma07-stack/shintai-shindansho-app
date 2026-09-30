import type { Patient, EraDate } from "../types";
import { ADL_ITEMS } from "../data/adlItems";
import { ReferenceDiagram } from "./ReferenceDiagram";
import { RomMmtPrintSection } from "./RomMmtPrintSection";

function fmtEra(d: EraDate) {
  if (!d.year && !d.month && !d.day) return { era: d.era, year: "", month: "", day: "" };
  return d;
}

// 「該当するものを○で囲む」原本のスタイルを再現：選択された項目を丸で囲んで表示する
function Choice({
  options,
  selected,
}: {
  options: string[];
  selected: string[] | string;
}) {
  const selectedArr = Array.isArray(selected) ? selected : [selected];
  return (
    <span className="choice-list">
      {options.map((opt, i) => (
        <span key={opt}>
          <span className={selectedArr.includes(opt) ? "circle-mark" : undefined}>{opt}</span>
          {i < options.length - 1 && <span className="choice-sep">・</span>}
        </span>
      ))}
    </span>
  );
}

function Line({ value, width }: { value: string; width?: string }) {
  return (
    <span className="fill-line" style={width ? { minWidth: width } : undefined}>
      {value}
    </span>
  );
}

function adlRating(v: { rating: string } | undefined) {
  return v?.rating || "";
}

export function PrintLayout({ patient }: { patient: Patient }) {
  const s = patient.summary;
  const st = patient.status;
  const birth = fmtEra(s.birth);
  const onset = fmtEra(s.onsetDate);
  const fixed = fmtEra(s.fixedDate);
  const diag = fmtEra(s.diagnosisDate);
  const reassessDate = fmtEra(s.reassessmentDate);

  const adlLeft = ADL_ITEMS.slice(0, 9);
  const adlRight = ADL_ITEMS.slice(9, 18);

  return (
    <div className="print-layout">
      {/* ============ 総括表 ============ */}
      <section className="print-page print-doc">
        <h1 className="doc-title">身体障害者診断書・意見書（肢体不自由障害用）</h1>
        <h2 className="doc-subtitle">総括表</h2>

        <div className="doc-row">
          <span className="doc-label">氏　名</span>
          <Line value={s.name} width="220px" />
          <span className="doc-inline-label">
            <Line value={birth.year} width="30px" />年
            <Line value={birth.month} width="24px" />月
            <Line value={birth.day} width="24px" />日生（
            <Line value={s.age} width="24px" />歳）
          </span>
          <Choice options={["男", "女"]} selected={s.gender} />
        </div>

        <div className="doc-row">
          <span className="doc-label">住　所</span>
          <Line value={s.address} width="100%" />
        </div>

        <div className="doc-row">
          <span className="doc-num">①</span>
          <span className="doc-label">障害名（部位を明記）</span>
          <Line value={s.disabilityName} width="100%" />
        </div>

        <div className="doc-row doc-row-multiline">
          <span className="doc-num">②</span>
          <span className="doc-label doc-label-2line">
            原因となった
            <br />
            疾病・外傷名
          </span>
          <div className="doc-col">
            <div>
              <Choice options={["交通", "労災", "その他の事故", "戦傷", "戦災"]} selected={s.causeCategories} />
            </div>
            <div>
              <Choice options={["自然災害", "疾病", "先天性"]} selected={s.causeCategories} />
              ・
              <span className={s.causeCategories.includes("その他") ? "circle-mark" : undefined}>その他</span>
              （<Line value={s.causeOther} width="80px" />）
            </div>
            <div>
              <Line value={s.diseaseName} width="100%" />
            </div>
          </div>
        </div>

        <div className="doc-row">
          <span className="doc-num">③</span>
          <span className="doc-label">疾病・外傷発生年月日</span>
          <Line value={onset.year} width="30px" />年
          <Line value={onset.month} width="24px" />月
          <Line value={onset.day} width="24px" />日・場所
          <Line value={s.onsetPlace} width="200px" />
        </div>

        <div className="doc-row">
          <span className="doc-num">④</span>
          <span className="doc-label">参考となる経過・現症（エックス線写真及び検査所見を含む。）</span>
        </div>
        <div className="doc-box doc-box-large">{s.courseFindings}</div>

        <div className="doc-row">
          <span className="doc-label">障害固定又は障害確定（推定）</span>
          <Line value={fixed.year} width="30px" />年
          <Line value={fixed.month} width="24px" />月
          <Line value={fixed.day} width="24px" />日
        </div>

        <div className="doc-row">
          <span className="doc-num">⑤</span>
          <span className="doc-label">総合所見</span>
        </div>
        <div className="doc-grade-layout">
          <div className="doc-box doc-box-large doc-box-flex">{s.overallFindings}</div>
          <table className="grade-table">
            <thead>
              <tr>
                <th>部位</th>
                <th>等級</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>上肢</td>
                <td>
                  <Line value={s.gradeUpperLimb} width="40px" />級-
                </td>
              </tr>
              <tr>
                <td>下肢</td>
                <td>
                  <Line value={s.gradeLowerLimb} width="40px" />級-
                </td>
              </tr>
              <tr>
                <td>体幹</td>
                <td>
                  <Line value={s.gradeTrunk} width="40px" />級-
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="doc-row">
          〔将来再認定　<Choice options={["要", "不要"]} selected={s.reassessment} />
          {s.reassessment === "要" && (
            <>
              （<Choice options={["軽度化", "重度化"]} selected={s.reassessmentType} />）
            </>
          )}
          〕
        </div>
        <div className="doc-row">
          〔再認定の時期　<Line value={reassessDate.year} width="30px" />年
          <Line value={reassessDate.month} width="24px" />月〕
        </div>

        <div className="doc-row">
          <span className="doc-num">⑥</span>
          <span className="doc-label">その他参考となる合併症状</span>
        </div>
        <div className="doc-box">{s.complications}</div>

        <div className="doc-row" style={{ marginTop: 10 }}>
          　上記のとおり診断する。併せて以下の意見を付す。
        </div>
        <div className="doc-row doc-row-right">
          <Line value={diag.year} width="30px" />年
          <Line value={diag.month} width="24px" />月
          <Line value={diag.day} width="24px" />日
        </div>
        <div className="doc-row">
          <span className="doc-label">病院又は診療所の名称</span>
          <Line value={s.hospitalName} width="100%" />
        </div>
        <div className="doc-row">
          <span className="doc-label">所在地</span>
          <Line value={s.hospitalAddress} width="100%" />
        </div>
        <div className="doc-row">
          <span className="doc-label">診療担当科名</span>
          <Line value={s.department} width="120px" />科　　医師氏名
          <Line value={s.doctorName} width="180px" />
        </div>

        <div className="doc-row" style={{ marginTop: 10 }}>
          　身体障害者福祉法第15条第３項の意見〔障害程度等級についても参考意見を記入〕
        </div>
        <div className="doc-row">　障害の程度は、身体障害者福祉法別表に掲げる障害に</div>
        <div className="doc-row doc-indent">
          <span className={s.lawOpinion === "該当する" ? "circle-mark" : undefined}>・該当する</span>（
          <Line value={s.lawOpinionGrade} width="30px" />）級相当
        </div>
        <div className="doc-row doc-indent">
          <span className={s.lawOpinion === "該当しない" ? "circle-mark" : undefined}>・該当しない</span>
        </div>

        <div className="doc-notes">
          <div className="doc-notes-title">注意</div>
          <div className="doc-note-row">
            <span>１</span>
            <span>
              障害名には現在起こっている障害、例えば両眼視力障害、両耳ろう、右上下肢麻痺、心臓機能障害等を記入し、原因となった疾病には、緑内障、先天性難聴、脳卒中、僧帽弁膜狭窄窄等原因となった疾患名を記入してください。
            </span>
          </div>
          <div className="doc-note-row">
            <span>２</span>
            <span>肢体不自由のある者の場合は、全ての肢体不自由について記入してください。</span>
          </div>
          <div className="doc-note-row">
            <span>３</span>
            <span>
              歯科矯正治療等の適応の判断を要する症例については、歯科医師による診断書・意見書（様式第２号　別紙２（その２））を添付してください。
            </span>
          </div>
          <div className="doc-note-row">
            <span>４</span>
            <span>障害区分や等級決定のため、愛知県から改めて次ページ以降の部分についてお問合せをする場合があります。</span>
          </div>
        </div>
      </section>

      {/* ============ 肢体不自由の状況及び所見 ============ */}
      <section className="print-page print-doc">
        <div className="doc-annex">別紙３</div>
        <h2 className="doc-subtitle">肢体不自由の状況及び所見</h2>
        <p className="doc-small">
          神経学的所見その他の機能障害（形態異常）の所見（該当するものを○で囲み、追加所見がある場合は、余白又は備考欄に記入すること。）
        </p>

        <div className="doc-row">
          <span className="doc-num">１</span>
          感覚障害（下記図示）　：
          <Choice options={["なし", "感覚脱失", "感覚麻痺", "異常感覚"]} selected={st.sensoryImpairment} />
        </div>
        <div className="doc-row">
          <span className="doc-num">２</span>
          運動障害（下記図示）　：
          <Choice
            options={["なし", "弛緩性麻痺", "痙性麻痺", "固縮", "不随意運動", "しんせん", "運動失調", "その他"]}
            selected={st.motorImpairment}
          />
          {st.motorImpairment.includes("その他") && <>（<Line value={st.motorImpairmentOther} width="100px" />）</>}
        </div>
        <div className="doc-row">
          <span className="doc-num">３</span>
          起因部位　：
          <Choice options={["脳", "脊髄", "末梢神経", "筋肉", "骨関節", "その他"]} selected={st.originSite} />
          {st.originSite.includes("その他") && <>（<Line value={st.originSiteOther} width="100px" />）</>}
        </div>
        <div className="doc-row">
          <span className="doc-num">４</span>
          排尿・排便機能障害　：
          <Choice options={["なし", "あり"]} selected={st.urinaryBowelDysfunction} />
        </div>
        <div className="doc-row">
          <span className="doc-num">５</span>
          形態異常　：
          <Choice options={["なし", "あり"]} selected={st.deformity} />
        </div>
        <p className="doc-small">（注）関係ない部分は記入不要</p>

        <ReferenceDiagram marks={st.bodyMarks} />

        <table className="measure-print-table">
          <thead>
            <tr>
              <th></th>
              <th>上肢長cm</th>
              <th>下肢長cm</th>
              <th>上腕周径cm</th>
              <th>前腕周径cm</th>
              <th>大腿周径cm</th>
              <th>下腿周径cm</th>
              <th>握力kg</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>右</th>
              <td>{st.measurements.right.upperLimbLength}</td>
              <td>{st.measurements.right.lowerLimbLength}</td>
              <td>{st.measurements.right.upperArmCirc}</td>
              <td>{st.measurements.right.forearmCirc}</td>
              <td>{st.measurements.right.thighCirc}</td>
              <td>{st.measurements.right.calfCirc}</td>
              <td>{st.measurements.right.gripStrength}</td>
            </tr>
            <tr>
              <th>左</th>
              <td>{st.measurements.left.upperLimbLength}</td>
              <td>{st.measurements.left.lowerLimbLength}</td>
              <td>{st.measurements.left.upperArmCirc}</td>
              <td>{st.measurements.left.forearmCirc}</td>
              <td>{st.measurements.left.thighCirc}</td>
              <td>{st.measurements.left.calfCirc}</td>
              <td>{st.measurements.left.gripStrength}</td>
            </tr>
          </tbody>
        </table>

        <div className="doc-row">
          歩行能力（補装具なしで）正常に可能：
          <Line value={st.gaitNormal ? "◯" : ""} width="24px" />
          <Line value={st.gaitLimitDistance} width="40px" />m以上歩行不能
        </div>
        <div className="doc-row">
          起立位（補装具無しで）正常に可能：
          <Line value={st.standNormal ? "◯" : ""} width="24px" />
          <Line value={st.standLimitMinutes} width="40px" />分以上困難: 片脚での起立位保持(
          <Choice options={["可", "不可"]} selected={st.oneLegStanding} />)
        </div>

        <p className="doc-small">
          動作・活動　自立◯　半介助△　全介助又は不能✕　（　）の中のものを使うときはそれに◯を付けること。
        </p>

        <table className="adl-print-table-2col">
          <tbody>
            {adlLeft.map((item, idx) => {
              const v = st.adl[item.id];
              const right = adlRight[idx];
              const vr = st.adl[right.id];
              return (
                <tr key={item.id}>
                  <td className="adl-label-cell">{item.label}</td>
                  <td className="adl-rating-cell">
                    {item.laterality ? (
                      <>
                        右<span className="circle-mark">{v?.ratingRight || ""}</span>　左
                        <span className="circle-mark">{v?.ratingLeft || ""}</span>
                      </>
                    ) : (
                      <Choice options={["◯", "△", "×"]} selected={adlRating(v)} />
                    )}
                  </td>
                  <td className="adl-label-cell">{right.label}</td>
                  <td className="adl-rating-cell">
                    {right.laterality ? (
                      <>
                        右<span className="circle-mark">{vr?.ratingRight || ""}</span>　左
                        <span className="circle-mark">{vr?.ratingLeft || ""}</span>
                      </>
                    ) : (
                      <Choice options={["◯", "△", "×"]} selected={adlRating(vr)} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="doc-notes">
          <div className="doc-note-row">
            <span>注：</span>
            <span>
              身体障害者福祉法の等級は機能障害(impairment)のレベルで認定されますので（　）の中に○が付いている場合、原則としていないという解釈になります。
            </span>
          </div>
        </div>
      </section>

      {/* ============ ROM・MMT測定表 ============ */}
      <section className="print-page print-doc">
        <h2 className="doc-subtitle">関節可動域 (ROM) と筋力テスト (MMT)</h2>
        <p className="doc-small">※ この表は必要な部分を記入　　筋力テスト（　）　　関節可動域　　筋力テスト（　）</p>

        <RomMmtPrintSection patient={patient} />

        <table className="reflex-print-table">
          <thead>
            <tr>
              <th>反射異常</th>
              <th colSpan={2}>上肢腱反射</th>
              <th colSpan={2}>下肢腱反射</th>
              <th colSpan={2}>バビンスキー反射</th>
            </tr>
            <tr>
              <th></th>
              <th>右</th>
              <th>左</th>
              <th>右</th>
              <th>左</th>
              <th>右</th>
              <th>左</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>判定</th>
              <td>{st.reflex.upperRight}</td>
              <td>{st.reflex.upperLeft}</td>
              <td>{st.reflex.lowerRight}</td>
              <td>{st.reflex.lowerLeft}</td>
              <td>{st.reflex.babinskiRight}</td>
              <td>{st.reflex.babinskiLeft}</td>
            </tr>
          </tbody>
        </table>
        <div className="doc-row">
          備考　<Line value={st.reflex.note} width="100%" />
        </div>

        <div className="doc-notes">
          <div className="doc-note-row">
            <span>注：</span>
            <span>
              関節可動域は、他動的可動域を原則とする。関節可動域は、基本肢位を0度とする日本整形外科学会日本リハビリテーション医学会の指定する表示法とする。筋力については、0〜5の6段階（0：消失、1〜2：著減、3：半減、4〜5：正常又はやや減）で記入する。
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
