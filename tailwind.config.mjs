/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // This is an example for the 'Beige' color swatch.
        // You can add more custom colors here if needed.
        'beige-200': '#F5F5DC',
      },
      animation: {
        carousel: 'carousel 30s linear infinite'
      },
      keyframes: {
        carousel: {
          '0%': { transform: 'translateX(0)' },
          '100%': {
            transform: 'translateX(calc(-250px * 9))'
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ]
};
