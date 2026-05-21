import * as React from "react";
import styles from "./Row.module.css";

type RowProps = React.HTMLAttributes<HTMLElement>;

export const Row = React.forwardRef<HTMLElement, RowProps>(({ children, className, ...rest }, ref) => (
  <section className={[styles.row, className].filter(Boolean).join(" ")} ref={ref} {...rest}>
    {children}
  </section>
));
Row.displayName = "Row";

export const RowSpaceBetween = React.forwardRef<HTMLElement, RowProps>(({ children, className, ...rest }, ref) => (
  <section className={[styles.spaceBetween, className].filter(Boolean).join(" ")} ref={ref} {...rest}>
    {children}
  </section>
));
RowSpaceBetween.displayName = "RowSpaceBetween";
