import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // important: "#__next",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {},
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
