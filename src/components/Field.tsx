import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  wide?: boolean;
};

export function Field({ label, children, wide }: Props) {
  return (
    <label className={`field${wide ? " field-wide" : ""}`}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
