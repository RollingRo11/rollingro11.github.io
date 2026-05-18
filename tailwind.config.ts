import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sm: "0.7rem",
        base: "0.775rem",
        lg: "0.85rem",
        xl: "0.95rem",
        "2xl": "1.15rem",
        "3xl": "1.4rem",
        "4xl": "1.7rem",
        "5xl": "2.25rem",
        "6xl": "2.8rem",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
};
export default config;
