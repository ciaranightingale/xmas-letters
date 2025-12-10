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
          cream: '#F5F5F0',
          sage: '#8B9D83',
          forest: '#2F4538',
          burgundy: '#8B3A3A',
          gold: '#B8956A',
          silver: '#C0C5C1',
          charcoal: '#3A3A3A',
        },
      },
      fontFamily: {
        serif: ['Crimson Pro', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        handwriting: ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;
