/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,mdx}",
    "./src/components/**/*.{js,jsx,mdx}",
    "./src/app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00b7aa",
          dark: "#009e93",
          light: "rgba(0, 183, 170, 0.08)",
        },
        secondary: {
          DEFAULT: "#164b77",
          dark: "#0f3556",
        },
        title: "#222c34",
        muted: "#767a7a",
        soft: "#fafbfc",
        mint: "#e6f4f0",
        line: "#ecf1f4",
        iconbox: "#f6faff",
        "price-muted": "#7393ad",
        dash: {
          sidebar: "#2980b9",
          content: "#f4f6f8",
          text: "#2c3e50",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(280deg, rgb(0, 183, 170) 0%, rgb(22, 75, 119) 100%)",
        "brand-gradient-hover":
          "linear-gradient(280deg, rgb(22, 75, 119) 0%, rgb(0, 183, 170) 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,183,170,0.10) 0%, rgba(230,244,240,0.35) 35%, rgba(255,255,255,0) 70%)",
      },
      boxShadow: {
        card: "0 10px 40px rgba(22, 75, 119, 0.08)",
        soft: "0 4px 24px rgba(0, 0, 0, 0.06)",
        nav: "0 8px 30px rgba(22, 75, 119, 0.12)",
        sticky: "rgba(0, 0, 0, 0.06) 0px 4px 30px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        site: "1280px",
      },
    },
  },
  plugins: [],
};
