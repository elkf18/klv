import { observer } from "mobx-react";
import React from "react";
import { View, Text } from "libs/ui";
import { ITheme } from "libs/config/theme";
import { useTheme } from "@react-navigation/native";

export default observer(({ label, style }: any) => {
  const Theme: ITheme = useTheme() as any;
  return (
    <View
      style={{
        backgroundColor: Theme.colors.background,
        padding: 15,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          ...style,
        }}
      >
        {label}
      </Text>
    </View>
  );
});
