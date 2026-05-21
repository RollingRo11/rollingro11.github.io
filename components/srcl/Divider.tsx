import * as React from "react";
import styles from "./Divider.module.css";

type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "default" | "double" | "gradient";
};

export default function Divider({ type = "default", style, ...rest }: DividerProps) {
  if (type === "gradient") {
    return <div className={styles.gradient} style={style} {...rest} />;
  }
  if (type === "double") {
    return (
      <div className={styles.divider} style={style} {...rest}>
        <div className={styles.line} style={{ marginBottom: 2 }} />
        <div className={styles.line} />
      </div>
    );
  }
  return (
    <div className={styles.divider} style={style} {...rest}>
      <div className={styles.line} />
    </div>
  );
}
