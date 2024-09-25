/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // primary: {
        //   DEFAULT: '#0c7bca',
        //   button: '#0196FF',
        //   block: '#0D3C6F',
        //   heading: '#00001F',
        // },
        meromai: {
          dark: '#00121f',
          blue: '#0096fe',
          teal: '#55e7e3',
        },
      },
    },
  },
  plugins: [],
}
