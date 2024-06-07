import Fonts from "libs/assets/fonts";
import { Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ item }: any) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          Total:
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: Fonts.NunitoBold,
            marginBottom: 10,
          }}
        >
          {moneyFormat(item.total || 0, "Rp. ")}
        </Text>
      </View>
    </View>
  );
});
