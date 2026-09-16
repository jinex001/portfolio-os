import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#FAFAF8",
        line: "#E5E1D8",
        muted: "#6F6A61",
        panel: "#FFFFFF",
      },
      fontFamily: {
        title: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        input: "0 -1px 0 rgba(17, 17, 17, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
