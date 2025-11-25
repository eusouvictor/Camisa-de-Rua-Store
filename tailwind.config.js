/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        15: "60px",
      },
      colors: {
        "verde-rua": "#1A3627",
        "verde-neon": "#D0C81C",
        "azul-gelo": "#CAD3E2",
        "dark-theme": "#202124",

        // Cores derivadas
        "verde-claro": "#8FD968",
        "verde-escuro": "#103D20",
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
