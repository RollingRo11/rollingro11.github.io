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
      typography: {
        xs: {
          css: {
            fontSize: "10px",
            h1: {
              fontSize: "20px",
            },
            h2: {
              fontSize: "17px",
            },
            h3: {
              fontSize: "14px",
            },
            h4: {
              fontSize: "12px",
            },
            h5: {
              fontSize: "10px",
            },
            h6: {
              fontSize: "10px",
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
              fontSize: "9px",
            },
          },
        },
        DEFAULT: {
          css: {
            fontSize: "12px",
            h1: {
              fontSize: "20px",
            },
            h2: {
              fontSize: "17px",
            },
            h3: {
              fontSize: "14px",
            },
            h4: {
              fontSize: "12px",
            },
            h5: {
              fontSize: "10px",
            },
            h6: {
              fontSize: "10px",
            },
            p: {
              fontSize: "12px",
            },
            li: {
              fontSize: "12px",
            },
            blockquote: {
              fontSize: "12px",
            },
            code: {
              fontSize: "10px",
            },
          },
        },
        sm: {
          css: {
            fontSize: "14px",
            h1: {
              fontSize: "24px",
            },
            h2: {
              fontSize: "20px",
            },
            h3: {
              fontSize: "17px",
            },
            h4: {
              fontSize: "14px",
            },
            p: {
              fontSize: "14px",
            },
            li: {
              fontSize: "14px",
            },
          },
        },
        lg: {
          css: {
            fontSize: "17px",
            h1: {
              fontSize: "27px",
            },
            h2: {
              fontSize: "24px",
            },
            h3: {
              fontSize: "20px",
            },
            h4: {
              fontSize: "17px",
            },
            p: {
              fontSize: "17px",
            },
            li: {
              fontSize: "17px",
            },
          },
        },
        xl: {
          css: {
            fontSize: "20px",
            h1: {
              fontSize: "31px",
            },
            h2: {
              fontSize: "27px",
            },
            h3: {
              fontSize: "24px",
            },
            h4: {
              fontSize: "20px",
            },
            p: {
              fontSize: "20px",
            },
            li: {
              fontSize: "20px",
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
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
