/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'autofill': 'repeat(auto-fill, minmax(180px, 1fr))',
      },
      keyframes: {
        loader: {
          '0%': {
            'background-position': '-800px 0px',
          },
          '100%': {
            'background-position': '800px 0px',
          },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        },
        blink: {
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "white"
          }
        },
      },
      animation: {
        typing: "typing 2s steps(20) alternate, blink .7s infinite"
      }
    },
  },
  plugins: [],
}