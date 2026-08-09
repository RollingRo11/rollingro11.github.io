import type { Config } from "tailwindcss";

// The design system lives in app/globals.css as plain CSS custom properties.
// Tailwind stays wired up for its base reset only.
const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};
export default config;
