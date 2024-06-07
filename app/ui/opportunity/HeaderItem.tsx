import React from "react";
import { observer } from "mobx-react";
import { View, Text } from "libs/ui";

import { moneyFormat } from "libs/utils/string-format";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { useTheme } from "@react-navigation/native";

export default observer(({ item }: any) => {
  const Theme: ITheme = useTheme() as any;
  if (!!item && !!item.total) {
    return (
      <View
        shadow
        style={{
          padding: 15,
          paddingHorizontal: 10,
          backgroundColor: Theme.colors.primary,
          marginVertical: 10,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          Total:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.NunitoBold,
            color: "white",
          }}
        >
          {moneyFormat(item.total, "Rp. ")}
        </Text>
      </View>
    );
  }

  if (item.data.length === 0) return null;

  return (
    <View
      shadow
      style={{
        padding: 15,
        paddingHorizontal: 10,
        backgroundColor: Theme.colors.primary,
        marginVertical: 10,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: Fonts.NunitoBold,
          color: "white",
        }}
      >
        {item.stage}
      </Text>
    </View>
  );
});
