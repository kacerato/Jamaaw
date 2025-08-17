/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        // Reinterpreta "blue" como a cor principal da marca (laranja Parceiros)
        blue: {
          50: "#fff1e6",
          100: "#ffe3cc",
          200: "#ffc7a3",
          300: "#ffab7a",
          400: "#ff8f52",
          500: "#ff6f26",
          600: "#ff4f00",
          700: "#e64400",
          800: "#cc3c00",
          900: "#a33200",
        },
        // Ajusta o verde para o tom da marca
        green: {
          50: "#e6f7ef",
          100: "#ccf0de",
          200: "#99e1be",
          300: "#66d39d",
          400: "#33c47d",
          500: "#21b873",
          600: "#00a859",
          700: "#00924e",
          800: "#007b41",
          900: "#005d31",
        },
        accent: {
          50: "#e6f7ef",
          100: "#ccf0de",
          200: "#99e1be",
          300: "#66d39d",
          400: "#33c47d",
          500: "#21b873",
          600: "#00a859",
          700: "#00924e",
          800: "#007b41",
          900: "#005d31",
        },
        gold: {
          400: "#ffcf40",
          500: "#ffc107",
          600: "#e6b100",
        },
        dark: {
          DEFAULT: "#1d1d1d",
        },
      },
    },
  },
  plugins: [],
};
