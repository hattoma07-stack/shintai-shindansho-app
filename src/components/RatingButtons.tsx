import { RATING_OPTIONS } from "../data/options";
import type { Rating } from "../types";

type Props = {
  value: Rating;
  onChange: (value: Rating) => void;
  label?: string;
};

const TITLES: Record<string, string> = {
  "◯": "自立",
  "△": "半介助",
  "×": "全介助又は不能",
};

export function RatingButtons({ value, onChange, label }: Props) {
  return (
    <span className="rating-buttons" role="group" aria-label={label}>
      {RATING_OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`rating-btn${value === opt ? " active" : ""}`}
          title={TITLES[opt]}
          onClick={() => onChange(value === opt ? "" : opt)}
        >
          {opt}
        </button>
      ))}
    </span>
  );
}
