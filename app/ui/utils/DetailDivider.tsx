import colors from "app/config/colors";
import Fonts from "libs/assets/fonts";
import { Text, View } from "libs/ui";
import React from "react";

export default ({ children, style }: any) => {
  return (
    <View
      style={{
        padding: 15,
        paddingVertical: 10,
        backgroundColor: "transparent",
        borderTopColor: colors.cardBorder,
        borderTopWidth: 1,
        ...(style || {}),
      }}
    >
      <Text
        style={{
          fontFamily: Fonts.poppins,
          color: colors.grey,
          fontSize: 14,
          flex: 1,
        }}
      >
        {children}
      </Text>
    </View>
  );
};
