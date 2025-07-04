/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
       colors: {
        primary: {
          100: "#e5f2f2",
          200: "#b1e2e2",
          300: "#7fcece",
          400: "#34a2b1",
          500: "#2c8a97",
          600: "#22727c",
          700: "#0d383e",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
        },
        orange: {
          100: "#ffedd5",
          600: "#ea580c",
          800: "#9a3412",
        },
        blue: {
          100: "#dbeafe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        white: "#ffffff",
        black: "#000000",
      }
    },
  },
  plugins: [],
};
