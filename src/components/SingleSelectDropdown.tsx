import { useEffect, useRef, useState } from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

export function SingleSelectDropdown({ options, value, onChange, placeholder = "未選択" }: Props) {
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

  const select = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const summary = value || placeholder;

  return (
    <div className="multiselect" ref={ref}>
      <button type="button" className="multiselect-trigger" onClick={() => setOpen((v) => !v)}>
        <span className="multiselect-summary">{summary}</span>
      </button>
      {open && (
        <div className="multiselect-panel" role="listbox">
          {options.map((o) => {
            const checked = value === o;
            return (
              <div
                key={o}
                role="option"
                aria-selected={checked}
                className={`multiselect-option${checked ? " checked" : ""}`}
                onClick={() => select(o)}
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
