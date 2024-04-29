import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        "cornflower-blue": {
          "50": "#eff5fe",
          "100": "#e1eefe",
          "200": "#c9ddfc",
          "300": "#a8c6f9",
          "400": "#86a5f3",
          "500": "#758fed",
          "600": "#4c60df",
          "700": "#3e4ec4",
          "800": "#35449e",
          "900": "#313d7e",
          "950": "#1d2349",
        },
      },
    },
  },
};
