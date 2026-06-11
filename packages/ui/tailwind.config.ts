import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: "#111827",
        card: "#1F2937",
        primary: "#00E5FF",
        secondary: "#7C3AED",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        heading: ["Inter Tight", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        md: "18px",
        lg: "24px",
      },
      transitionDuration: {
        page: "300ms",
        card: "150ms",
        sidebar: "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
