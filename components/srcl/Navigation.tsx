"use client";

import * as React from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

type NavigationProps = {
  logoHref?: string;
  logo: React.ReactNode;
  right?: React.ReactNode;
};

export default function Navigation({ logoHref, logo, right }: NavigationProps) {
  const inner = <span>{logo}</span>;
  const logoEl = logoHref ? (
    <Link href={logoHref} className={styles.logo}>
      {inner}
    </Link>
  ) : (
    <button className={styles.logo} type="button">
      {inner}
    </button>
  );

  return (
    <nav className={styles.root}>
      {logoEl}
      <div className={styles.right}>{right}</div>
    </nav>
  );
}
