import { DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
  borderRadius: "5px",

  colors: {
    point: "#7a7a7a",
    bg: "#F4F6FB",
    green: "#3cb46e",
    blue: "#000080",
  },

  flexCenter: `
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  flexCenterColumn: `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};

export { theme };
