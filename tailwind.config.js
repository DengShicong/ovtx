/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#6C49F7',
        brand2: '#7d60ff',
        ov: '#14B8A6'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}