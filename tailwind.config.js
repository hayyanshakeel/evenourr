/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Tailwind CSS v4 uses @theme in CSS instead of theme config
  plugins: [
    "@tailwindcss/container-queries",
    "@tailwindcss/typography"
  ],
}
