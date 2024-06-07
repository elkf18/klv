import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import colors from "./colors";

export const DefaultTheme: Partial<ITheme> = {
  colors: {
    primary: colors.primary,
    secondary: "#E5F7FF",
    background: "#fff",
    card: "#ffffff",
    text: "#333333",
    textSecondary: "#555555",
    textLight: "#ffffff",
    border: "#ccc",
    notification: "rgb(255, 69, 58)",
    fontFamily: Fonts.poppinsmedium,
  },
  statusBar: {
    barStyle: "dark-content",
    backgroundColor: "white",
  },
  fontStyle: {
    light: Fonts.poppinslight,
    lightItalic: Fonts.poppinslightitalic,
    regular: Fonts.poppins,
    regularItalic: Fonts.poppinsitalic,
    bold: Fonts.poppinsbold,
    boldItalic: Fonts.poppinsbolditalic,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  splashImage: require("app/assets/images/splash.png"),
  styles: {
    input: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderRadius: 10,
    },
    button: {
      borderRadius: 10,
    },
    
  },
};

export const DarkTheme: Partial<ITheme> = {};
