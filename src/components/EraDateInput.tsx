import { ERA_OPTIONS } from "../data/options";
import type { EraDate } from "../types";

type Props = {
  value: EraDate;
  onChange: (value: EraDate) => void;
  showDay?: boolean;
};

export function EraDateInput({ value, onChange, showDay = true }: Props) {
  return (
    <span className="era-date">
      <select
        value={value.era}
        onChange={(e) => onChange({ ...value, era: e.target.value })}
        aria-label="元号"
      >
        {ERA_OPTIONS.map((era) => (
          <option key={era} value={era}>
            {era}
          </option>
        ))}
      </select>
      <input
        type="text"
        inputMode="numeric"
        className="era-year"
        placeholder="年"
        value={value.year}
        onChange={(e) => onChange({ ...value, year: e.target.value })}
        aria-label="年"
      />
      <span>年</span>
      <input
        type="text"
        inputMode="numeric"
        className="era-small"
        placeholder="月"
        value={value.month}
        onChange={(e) => onChange({ ...value, month: e.target.value })}
        aria-label="月"
      />
      <span>月</span>
      {showDay && (
        <>
          <input
            type="text"
            inputMode="numeric"
            className="era-small"
            placeholder="日"
            value={value.day}
            onChange={(e) => onChange({ ...value, day: e.target.value })}
            aria-label="日"
          />
          <span>日</span>
        </>
      )}
    </span>
  );
}
