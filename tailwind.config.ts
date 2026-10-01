import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts,tsx}',
    './nuxt.config.ts',
    './node_modules/@nuxt/ui/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f8ff',
          100: '#dcebfe',
          200: '#c8e0fd',
          300: '#9bc5fe',
          400: '#70acfe',
          500: '#3069c9',
          600: '#1e63ce',
          700: '#1a56b8',
          800: '#164aa0',
          900: '#123c82',
          950: '#0c2a5c',
        },
      },
    },
  },
}
