import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#C41E3A',
          green: '#165B33',
          gold: '#FFD700',
          snow: '#FFFAFA',
        },
      },
    },
  },
  plugins: [],
};
export default config;
