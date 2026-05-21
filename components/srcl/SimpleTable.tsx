import * as React from "react";
import styles from "./SimpleTable.module.css";

// Ported from SRCL (internet-development/www-sacred). First row of `data` is
// the header. `tableClassName` is exported via `simpleTableClasses` so the
// markdown renderer can apply the same styling to GFM-generated tables.
interface SimpleTableProps {
  data: React.ReactNode[][];
  align?: ("left" | "right")[];
}

export const simpleTableClasses = {
  scrollWrapper: styles.scrollWrapper,
  root: styles.root,
  alignRight: styles.alignRight,
};

export default function SimpleTable({ data, align }: SimpleTableProps) {
  if (!data || data.length === 0) return null;
  const [header, ...rows] = data;
  const alignAt = (col: number) => (align && align[col] === "right" ? styles.alignRight : undefined);

  return (
    <div className={styles.scrollWrapper}>
      <table className={styles.root}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <td key={i} className={alignAt(i)}>
                {cell}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} tabIndex={0}>
              {row.map((cell, ci) => (
                <td key={ci} className={alignAt(ci)}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
