/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "verde-rua": "#1A3627",
        "verde-neon": "#D0C81C",
        "azul-gelo": "#CAD3E2",

        // Cores derivadas
        "verde-claro": "#2A4A38",
        "verde-escuro": "#0F2419",
        "ouro-claro": "#E8E04A",
        "ouro-escuro": "#A89C16",
        "azul-gelo-escuro": "#A8B4CC",

        // Cores neutras
        "cinza-claro": "#F8FAFC",
        "cinza-medio": "#E2E8F0",
        "cinza-escuro": "#4A5568",
      },
      fontFamily: {
        advent: ["Advent Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
};
