// Small helpers ported from SRCL's common/utilities.ts — only what the
// components below actually use.

export function classNames(...names: Array<string | null | undefined | false>): string {
  return names.filter(Boolean).join(" ");
}

export function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
}

// Left-pad with spaces (SRCL's leftPad uses zeros; spaces read better for
// code line numbers while keeping the right-aligned gutter).
export function leftPad(input: string, length: number): string {
  const needed = length - input.length;
  return needed <= 0 ? input : " ".repeat(needed) + input;
}
