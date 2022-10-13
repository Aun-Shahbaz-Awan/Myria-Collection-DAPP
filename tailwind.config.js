module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#050F15",
        primary_card: "#1B2E3B",
        secondary: "#00B074",
        back: "#38434E",
        bord: "#C4983Bcc",
        bg_button: "#F5B841",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
