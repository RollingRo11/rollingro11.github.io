import * as React from "react";
import styles from "./Badge.module.css";

export default function Badge({ children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={styles.badge} {...rest}>
      {children}
    </span>
  );
}
