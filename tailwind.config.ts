import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👈 THIS is important
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
