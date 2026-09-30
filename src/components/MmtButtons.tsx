import { MMT_OPTIONS } from "../data/options";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export function MmtButtons({ value, onChange, label }: Props) {
  return (
    <span className="mmt-buttons" role="group" aria-label={label}>
      {MMT_OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`mmt-btn${value === opt ? " active" : ""}`}
          onClick={() => onChange(value === opt ? "" : opt)}
        >
          {opt}
        </button>
      ))}
    </span>
  );
}
