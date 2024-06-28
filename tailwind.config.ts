import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        background: colors.zinc["950"],
        dark: colors.black,
        foreground: colors.white,
        muted: {
          foreground: colors.zinc["500"],
        },
        border: colors.zinc["800"],
      },
    },
  },
  plugins: [],
} satisfies Config;
