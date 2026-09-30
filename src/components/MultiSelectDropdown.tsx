import { useEffect, useRef, useState } from "react";

type Props = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function MultiSelectDropdown({ options, selected, onChange, placeholder = "未選択" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (option: string) => {
    const next = selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option];
    onChange(next);
  };

  const summary = selected.length === 0 ? placeholder : selected.join("、");

  return (
    <div className="multiselect" ref={ref}>
      <button type="button" className="multiselect-trigger" onClick={() => setOpen((v) => !v)}>
        <span className="multiselect-summary">{summary}</span>
      </button>
      {open && (
        <div className="multiselect-panel" role="listbox" aria-multiselectable="true">
          {options.map((o) => {
            const checked = selected.includes(o);
            return (
              <div
                key={o}
                role="option"
                aria-selected={checked}
                className={`multiselect-option${checked ? " checked" : ""}`}
                onClick={() => toggle(o)}
              >
                <span className="multiselect-check">{checked ? "✓" : ""}</span>
                {o}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
