import { useTheme } from "@react-navigation/native";
import colors from "app/config/colors";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";

import { Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ state }: any) => {
  const Theme: ITheme = useTheme() as any;
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 10
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <Text
          style={{
            color: colors.textBlack,
            fontSize: 16,
          }}
        >
          Subtotal:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.poppinsmedium,
            color:colors.textPrimary
          }}
        >
          {moneyFormat(state.sub_total || 0, "Rp. ")}
        </Text>
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <Text
          style={{
            color: Theme.colors.primary,
            fontSize: 16,
          }}
        >
          PPN:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.NunitoBold,
          }}
        >
          {moneyFormat(state.amount_ppn || 0, "Rp. ")}
        </Text>
      </View> */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <Text
          style={{
            color: Theme.colors.primary,
            fontSize: 16,
          }}
        >
          Grand Total:
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.NunitoBold,
          }}
        >
          {moneyFormat(state.grand_total || 0, "Rp. ")}
        </Text>
      </View> */}
    </View>
  );
});
