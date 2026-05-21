import * as React from "react";
import styles from "./Block.module.css";

export default function Block({ children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={styles.block} {...rest}>
      {children}
    </span>
  );
}
