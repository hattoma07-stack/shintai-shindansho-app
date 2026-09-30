import type { SummaryData } from "../types";
import { Field } from "./Field";
import { EraDateInput } from "./EraDateInput";
import { CAUSE_CATEGORY_OPTIONS } from "../data/options";

type Props = {
  value: SummaryData;
  onChange: (value: SummaryData) => void;
};

export function SummaryTab({ value, onChange }: Props) {
  const set = <K extends keyof SummaryData>(key: K, v: SummaryData[K]) =>
    onChange({ ...value, [key]: v });

  const toggleCause = (cat: string) => {
    const has = value.causeCategories.includes(cat);
    set(
      "causeCategories",
      has ? value.causeCategories.filter((c) => c !== cat) : [...value.causeCategories, cat]
    );
  };

  return (
    <div className="tab-panel">
      <h2>総括表</h2>

      <section className="form-section">
        <div className="form-row">
          <Field label="氏名" wide>
            <input value={value.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="性別">
            <select value={value.gender} onChange={(e) => set("gender", e.target.value as SummaryData["gender"])}>
              <option value="">未選択</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </Field>
        </div>
        <div className="form-row">
          <Field label="生年月日" wide>
            <EraDateInput value={value.birth} onChange={(v) => set("birth", v)} />
          </Field>
          <Field label="年齢（歳）">
            <input
              className="short"
              value={value.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>
        </div>
        <Field label="住所" wide>
          <input value={value.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </section>

      <section className="form-section">
        <h3>① 障害名（部位を明記）</h3>
        <Field label="障害名" wide>
          <textarea
            rows={2}
            value={value.disabilityName}
            onChange={(e) => set("disabilityName", e.target.value)}
          />
        </Field>
      </section>

      <section className="form-section">
        <h3>② 原因となった疾病・外傷名</h3>
        <div className="checkbox-group">
          {CAUSE_CATEGORY_OPTIONS.map((cat) => (
            <label key={cat} className="checkbox-item">
              <input
                type="checkbox"
                checked={value.causeCategories.includes(cat)}
                onChange={() => toggleCause(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
        {value.causeCategories.includes("その他") && (
          <Field label="その他（詳細）" wide>
            <input value={value.causeOther} onChange={(e) => set("causeOther", e.target.value)} />
          </Field>
        )}
        <Field label="疾病・外傷名" wide>
          <input value={value.diseaseName} onChange={(e) => set("diseaseName", e.target.value)} />
        </Field>
      </section>

      <section className="form-section">
        <h3>③ 疾病・外傷発生年月日</h3>
        <div className="form-row">
          <Field label="発生年月日" wide>
            <EraDateInput value={value.onsetDate} onChange={(v) => set("onsetDate", v)} />
          </Field>
          <Field label="場所" wide>
            <input value={value.onsetPlace} onChange={(e) => set("onsetPlace", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="form-section">
        <h3>④ 参考となる経過・現症（エックス線写真及び検査所見を含む。）</h3>
        <textarea
          rows={5}
          value={value.courseFindings}
          onChange={(e) => set("courseFindings", e.target.value)}
        />
      </section>

      <section className="form-section">
        <h3>障害固定又は障害確定（推定）</h3>
        <EraDateInput value={value.fixedDate} onChange={(v) => set("fixedDate", v)} />
      </section>

      <section className="form-section">
        <h3>⑤ 総合所見</h3>
        <textarea
          rows={5}
          value={value.overallFindings}
          onChange={(e) => set("overallFindings", e.target.value)}
        />
        <div className="form-row" style={{ marginTop: 8 }}>
          <Field label="上肢　級">
            <input className="short" value={value.gradeUpperLimb} onChange={(e) => set("gradeUpperLimb", e.target.value)} />
          </Field>
          <Field label="下肢　級">
            <input className="short" value={value.gradeLowerLimb} onChange={(e) => set("gradeLowerLimb", e.target.value)} />
          </Field>
          <Field label="体幹　級">
            <input className="short" value={value.gradeTrunk} onChange={(e) => set("gradeTrunk", e.target.value)} />
          </Field>
        </div>

        <div className="form-row" style={{ marginTop: 8 }}>
          <Field label="将来再認定">
            <select value={value.reassessment} onChange={(e) => set("reassessment", e.target.value as SummaryData["reassessment"])}>
              <option value="">未選択</option>
              <option value="要">要</option>
              <option value="不要">不要</option>
            </select>
          </Field>
          {value.reassessment === "要" && (
            <>
              <Field label="軽度化・重度化">
                <input
                  className="short"
                  value={value.reassessmentType}
                  onChange={(e) => set("reassessmentType", e.target.value)}
                  placeholder="軽度化 or 重度化"
                />
              </Field>
              <Field label="再認定の時期" wide>
                <EraDateInput
                  value={value.reassessmentDate}
                  onChange={(v) => set("reassessmentDate", v)}
                  showDay={false}
                />
              </Field>
            </>
          )}
        </div>
      </section>

      <section className="form-section">
        <h3>⑥ その他参考となる合併症状</h3>
        <textarea
          rows={4}
          value={value.complications}
          onChange={(e) => set("complications", e.target.value)}
        />
      </section>

      <section className="form-section">
        <h3>診断日・医療機関情報</h3>
        <Field label="診断年月日" wide>
          <EraDateInput value={value.diagnosisDate} onChange={(v) => set("diagnosisDate", v)} />
        </Field>
        <Field label="病院又は診療所の名称" wide>
          <input value={value.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} />
        </Field>
        <Field label="所在地" wide>
          <input value={value.hospitalAddress} onChange={(e) => set("hospitalAddress", e.target.value)} />
        </Field>
        <div className="form-row">
          <Field label="診療担当科名">
            <input value={value.department} onChange={(e) => set("department", e.target.value)} />
          </Field>
          <Field label="医師氏名">
            <input value={value.doctorName} onChange={(e) => set("doctorName", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="form-section">
        <h3>身体障害者福祉法第15条第３項の意見</h3>
        <p className="note-text">障害の程度は、身体障害者福祉法別表に掲げる障害に</p>
        <div className="form-row">
          <label className="radio-item">
            <input
              type="radio"
              name="lawOpinion"
              checked={value.lawOpinion === "該当する"}
              onChange={() => set("lawOpinion", "該当する")}
            />
            該当する（
            <input
              className="short"
              value={value.lawOpinionGrade}
              onChange={(e) => set("lawOpinionGrade", e.target.value)}
            />
            ）級相当
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="lawOpinion"
              checked={value.lawOpinion === "該当しない"}
              onChange={() => set("lawOpinion", "該当しない")}
            />
            該当しない
          </label>
        </div>
      </section>
    </div>
  );
}
