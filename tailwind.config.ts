import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  theme: {
    screens: {
      sm: { min: "390em", max: "819em" },
      md: { min: "820em", max: "1023em" },
      lg: { min: "1080em" },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;

