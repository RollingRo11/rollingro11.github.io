"use client";

import * as React from "react";
import Link from "next/link";
import styles from "./ActionListItem.module.css";

type Props = {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  role?: string;
  /* Remove the inter-item gap so stacked items read as one continuous list
     (used by the dropdown menu — no lines between options). */
  flush?: boolean;
};

export default function ActionListItem({ icon = "▸", children, href, target, rel, onClick, role, flush }: Props) {
  const itemClass = [styles.item, flush ? styles.flush : null].filter(Boolean).join(" ");
  const inner = (
    <>
      <figure className={styles.icon}>{icon}</figure>
      <span className={styles.text}>
        <span className={styles.label}>{children}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div className={itemClass} tabIndex={0} role={role ?? "button"} onClick={onClick}>
        {inner}
      </div>
    );
  }

  const isExternal = /^https?:/.test(href);
  if (isExternal) {
    return (
      <a
        className={itemClass}
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        tabIndex={0}
        role={role}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={itemClass} tabIndex={0} role={role} onClick={onClick}>
      {inner}
    </Link>
  );
}
