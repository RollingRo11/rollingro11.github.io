// p5.brush ships no type declarations. The standalone build is imported
// dynamically in the browser only, so a loose module shape is enough.
declare module "p5.brush/standalone" {
  const brush: Record<string, any>;
  export = brush;
}
