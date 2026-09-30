import type { AdlItemValue, BodyMark, SideMeasurements, StatusData } from "../types";
import { Field } from "./Field";
import { RatingButtons } from "./RatingButtons";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { BodyMarkEditor } from "./BodyMarkEditor";
import { ReferenceDiagram } from "./ReferenceDiagram";
import { ADL_ITEMS } from "../data/adlItems";
import {
  MOTOR_IMPAIRMENT_OPTIONS,
  ORIGIN_SITE_OPTIONS,
  REFLEX_OPTIONS,
  SENSORY_IMPAIRMENT_OPTIONS,
} from "../data/options";

type Props = {
  value: StatusData;
  onChange: (value: StatusData) => void;
};

const MEASUREMENT_FIELDS: { key: keyof SideMeasurements; label: string }[] = [
  { key: "upperLimbLength", label: "上肢長 (cm)" },
  { key: "lowerLimbLength", label: "下肢長 (cm)" },
  { key: "upperArmCirc", label: "上腕周径 (cm)" },
  { key: "forearmCirc", label: "前腕周径 (cm)" },
  { key: "thighCirc", label: "大腿周径 (cm)" },
  { key: "calfCirc", label: "下腿周径 (cm)" },
  { key: "gripStrength", label: "握力 (kg)" },
];

export function StatusTab({ value, onChange }: Props) {
  const set = <K extends keyof StatusData>(key: K, v: StatusData[K]) =>
    onChange({ ...value, [key]: v });

  const setSide = (side: "right" | "left", key: keyof SideMeasurements, v: string) => {
    onChange({
      ...value,
      measurements: {
        ...value.measurements,
        [side]: { ...value.measurements[side], [key]: v },
      },
    });
  };

  const setAdl = (id: string, patch: Partial<AdlItemValue>) => {
    const current: AdlItemValue = value.adl[id] ?? { rating: "", note: "" };
    onChange({ ...value, adl: { ...value.adl, [id]: { ...current, ...patch } } });
  };

  const setReflex = (key: keyof StatusData["reflex"], v: string) => {
    onChange({ ...value, reflex: { ...value.reflex, [key]: v } });
  };

  const setBodyMarks = (next: BodyMark[]) => set("bodyMarks", next);
  const bodyMarks = value.bodyMarks ?? [];

  return (
    <div className="tab-panel">
      <h2>肢体不自由の状況及び所見</h2>

      <section className="form-section">
        <h3>神経学的所見その他の機能障害（形態異常）の所見</h3>

        <Field label="1. 感覚障害" wide>
          <SingleSelectDropdown
            options={SENSORY_IMPAIRMENT_OPTIONS}
            value={value.sensoryImpairment}
            onChange={(v) => set("sensoryImpairment", v)}
          />
        </Field>
        {value.sensoryImpairment && value.sensoryImpairment !== "なし" && (
          <BodyMarkEditor type="sensory" allMarks={bodyMarks} onChange={setBodyMarks} />
        )}

        <Field label="2. 運動障害（複数選択可）" wide>
          <MultiSelectDropdown
            options={MOTOR_IMPAIRMENT_OPTIONS}
            selected={value.motorImpairment}
            onChange={(next) => set("motorImpairment", next)}
          />
          {value.motorImpairment.includes("その他") && (
            <input
              placeholder="詳細"
              value={value.motorImpairmentOther}
              onChange={(e) => set("motorImpairmentOther", e.target.value)}
            />
          )}
        </Field>
        {value.motorImpairment.some((m) => m !== "なし") && (
          <BodyMarkEditor type="motor" allMarks={bodyMarks} onChange={setBodyMarks} />
        )}

        <Field label="3. 起因部位（複数選択可）" wide>
          <MultiSelectDropdown
            options={ORIGIN_SITE_OPTIONS}
            selected={value.originSite}
            onChange={(next) => set("originSite", next)}
          />
          {value.originSite.includes("その他") && (
            <input
              placeholder="詳細"
              value={value.originSiteOther}
              onChange={(e) => set("originSiteOther", e.target.value)}
            />
          )}
        </Field>

        <div className="form-row">
          <Field label="4. 排尿・排便機能障害">
            <SingleSelectDropdown
              options={["なし", "あり"]}
              value={value.urinaryBowelDysfunction}
              onChange={(v) => set("urinaryBowelDysfunction", v as StatusData["urinaryBowelDysfunction"])}
            />
          </Field>
          <Field label="5. 形態異常">
            <SingleSelectDropdown
              options={["なし", "あり"]}
              value={value.deformity}
              onChange={(v) => set("deformity", v as StatusData["deformity"])}
            />
          </Field>
        </div>

        <ReferenceDiagram marks={bodyMarks} />
      </section>

      <section className="form-section">
        <h3>計測値</h3>
        <div className="measurement-table">
          <div className="measurement-row measurement-header">
            <div />
            <div>右</div>
            <div>左</div>
          </div>
          {MEASUREMENT_FIELDS.map((f) => (
            <div className="measurement-row" key={f.key}>
              <div className="measurement-label">{f.label}</div>
              <input
                value={value.measurements.right[f.key]}
                onChange={(e) => setSide("right", f.key, e.target.value)}
              />
              <input
                value={value.measurements.left[f.key]}
                onChange={(e) => setSide("left", f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h3>歩行能力・起立位（補装具なしで）</h3>
        <div className="form-row">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={value.gaitNormal}
              onChange={(e) => set("gaitNormal", e.target.checked)}
            />
            歩行 正常に可能
          </label>
          <Field label="歩行不能距離 (m以上)">
            <input
              className="short"
              value={value.gaitLimitDistance}
              onChange={(e) => set("gaitLimitDistance", e.target.value)}
            />
          </Field>
        </div>
        <div className="form-row">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={value.standNormal}
              onChange={(e) => set("standNormal", e.target.checked)}
            />
            起立位 正常に可能
          </label>
          <Field label="起立位困難時間 (分以上)">
            <input
              className="short"
              value={value.standLimitMinutes}
              onChange={(e) => set("standLimitMinutes", e.target.value)}
            />
          </Field>
          <Field label="片脚での起立位保持">
            <select
              value={value.oneLegStanding}
              onChange={(e) => set("oneLegStanding", e.target.value as StatusData["oneLegStanding"])}
            >
              <option value="">未選択</option>
              <option value="可">可</option>
              <option value="不可">不可</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="form-section">
        <h3>動作・活動（自立◯／半介助△／全介助又は不能×）</h3>
        <div className="adl-list">
          {ADL_ITEMS.map((item) => {
            const v = value.adl[item.id] ?? { rating: "", note: "" };
            return (
              <div className="adl-row" key={item.id}>
                <div className="adl-label">{item.label}</div>
                {item.laterality ? (
                  <div className="adl-lateral">
                    <span>右</span>
                    <RatingButtons
                      value={v.ratingRight ?? ""}
                      onChange={(r) => setAdl(item.id, { ratingRight: r })}
                      label={`${item.label} 右`}
                    />
                    <span>左</span>
                    <RatingButtons
                      value={v.ratingLeft ?? ""}
                      onChange={(r) => setAdl(item.id, { ratingLeft: r })}
                      label={`${item.label} 左`}
                    />
                  </div>
                ) : (
                  <RatingButtons
                    value={v.rating}
                    onChange={(r) => setAdl(item.id, { rating: r })}
                    label={item.label}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="form-section">
        <h3>反射異常</h3>
        <div className="reflex-table">
          <div className="reflex-row reflex-header">
            <div />
            <div>右</div>
            <div>左</div>
          </div>
          <div className="reflex-row">
            <div className="measurement-label">上肢腱反射</div>
            <select value={value.reflex.upperRight} onChange={(e) => setReflex("upperRight", e.target.value)}>
              <option value="">-</option>
              {REFLEX_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select value={value.reflex.upperLeft} onChange={(e) => setReflex("upperLeft", e.target.value)}>
              <option value="">-</option>
              {REFLEX_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="reflex-row">
            <div className="measurement-label">下肢腱反射</div>
            <select value={value.reflex.lowerRight} onChange={(e) => setReflex("lowerRight", e.target.value)}>
              <option value="">-</option>
              {REFLEX_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select value={value.reflex.lowerLeft} onChange={(e) => setReflex("lowerLeft", e.target.value)}>
              <option value="">-</option>
              {REFLEX_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="reflex-row">
            <div className="measurement-label">バビンスキー反射</div>
            <select
              value={value.reflex.babinskiRight}
              onChange={(e) => setReflex("babinskiRight", e.target.value)}
            >
              <option value="">-</option>
              {REFLEX_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select
              value={value.reflex.babinskiLeft}
              onChange={(e) => setReflex("babinskiLeft", e.target.value)}
            >
              <option value="">-</option>
              {REFLEX_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Field label="備考" wide>
          <textarea rows={3} value={value.reflex.note} onChange={(e) => setReflex("note", e.target.value)} />
        </Field>
      </section>
    </div>
  );
}
