import * as React from "react";
import styles from "./Card.module.css";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
};

// Title is always left-aligned: a short corner bracket on the left, then the
// title, then an extending bracket filling the rest of the top edge.
export default function Card({ children, title, style, ...rest }: CardProps) {
  return (
    <article className={styles.card} style={style} {...rest}>
      <header className={styles.action}>
        <div className={styles.leftCorner} aria-hidden="true" />
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        <div className={styles.right} aria-hidden="true" />
      </header>
      <section className={styles.children}>{children}</section>
    </article>
  );
}
