import * as React from "react";
import styles from "./CodeBlock.module.css";
import { leftPad } from "./utils";

// Ported from SRCL (internet-development/www-sacred). Renders a code block with
// a right-aligned line-number gutter, terminal-style.
type CodeBlockProps = React.HTMLAttributes<HTMLPreElement>;

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(({ children, ...rest }, ref) => {
  const text = String(children).replace(/\n$/, "");
  return (
    <pre className={styles.root} ref={ref} {...rest}>
      {text.split("\n").map((line, index) => (
        <div key={index} className={styles.line}>
          <span className={styles.number}>{leftPad(String(index + 1), 3)}</span>
          <span className={styles.content}>{line}</span>
        </div>
      ))}
    </pre>
  );
});

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
