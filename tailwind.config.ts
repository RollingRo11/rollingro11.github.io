import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'sm': '0.6125rem',   // ~9.8px at 16px root
        'base': '0.7rem',    // ~11.2px
        'lg': '0.7875rem',   // ~12.6px
        'xl': '0.875rem',    // 14px (your target)
        '2xl': '1.05rem',    // ~16.8px
        '3xl': '1.3125rem',  // 21px
        '4xl': '1.575rem',   // ~25.2px
        '5xl': '2.1rem',     // ~33.6px
        '6xl': '2.625rem',   // 42px
      },
      typography: {
        xs: {
          css: {
            fontSize: "8px",
            h1: {
              fontSize: "16px",
            },
            h2: {
              fontSize: "13px",
            },
            h3: {
              fontSize: "11px",
            },
            h4: {
              fontSize: "10px",
            },
            h5: {
              fontSize: "8px",
            },
            h6: {
              fontSize: "8px",
            },
            p: {
              fontSize: "8px",
            },
            li: {
              fontSize: "8px",
            },
            blockquote: {
              fontSize: "8px",
            },
            code: {
              fontSize: "7px",
            },
          },
        },
        DEFAULT: {
          css: {
            fontSize: "10px",
            h1: {
              fontSize: "16px",
            },
            h2: {
              fontSize: "13px",
            },
            h3: {
              fontSize: "11px",
            },
            h4: {
              fontSize: "10px",
            },
            h5: {
              fontSize: "8px",
            },
            h6: {
              fontSize: "8px",
            },
            p: {
              fontSize: "10px",
            },
            li: {
              fontSize: "10px",
            },
            blockquote: {
              fontSize: "10px",
            },
            code: {
              fontSize: "8px",
            },
          },
        },
        sm: {
          css: {
            fontSize: "11px",
            h1: {
              fontSize: "19px",
            },
            h2: {
              fontSize: "16px",
            },
            h3: {
              fontSize: "13px",
            },
            h4: {
              fontSize: "11px",
            },
            p: {
              fontSize: "11px",
            },
            li: {
              fontSize: "11px",
            },
          },
        },
        lg: {
          css: {
            fontSize: "13px",
            h1: {
              fontSize: "22px",
            },
            h2: {
              fontSize: "19px",
            },
            h3: {
              fontSize: "16px",
            },
            h4: {
              fontSize: "13px",
            },
            p: {
              fontSize: "13px",
            },
            li: {
              fontSize: "13px",
            },
          },
        },
        xl: {
          css: {
            fontSize: "16px",
            h1: {
              fontSize: "26px",
            },
            h2: {
              fontSize: "22px",
            },
            h3: {
              fontSize: "19px",
            },
            h4: {
              fontSize: "16px",
            },
            p: {
              fontSize: "16px",
            },
            li: {
              fontSize: "16px",
            },
          },
        },
      },
      colors: {
        "sea-breeze": "#8ca397",
        coral: "#E8A598",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
