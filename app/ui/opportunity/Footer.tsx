import Fonts from "libs/assets/fonts";

import { Button, Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import OpportunityStore from "app/model/opportunity";
import { observer } from "mobx-react";
import React from "react";
import { ITheme } from "libs/config/theme";
import { useTheme } from "@react-navigation/native";

export default observer(({ tab }: any) => {
  const Theme: ITheme = useTheme() as any;
  if (OpportunityStore.getListStage(tab.value).length > 0)
    return (
      <Button
        style={{
          backgroundColor: "#E5F7FF",
          flexDirection:"row",
          flexGrow:1,
          justifyContent: 'space-between',
          marginBottom: 10,
          display: "flex",
          flexShrink: 1,
          borderRadius: 8,
          paddingVertical: 10,
          margin: 5,
        }}
      >
        <Text
          style={{
            color: '#000',
            marginTop: 4,
            fontFamily: Fonts.poppins,
          }}
          // Subtotal:
        >
          Prospek
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppinsmedium,
            fontSize: 18,
            color: Theme.colors.primary,
          }}
        >
          {moneyFormat(OpportunityStore.subtotal(tab.value), "Rp. ")}
        </Text>

        {/* <View
        style={{
          backgroundColor: Theme.colors.primary,
          flex:1,
          height:1,
          marginVertical:5,
          marginHorizontal:-15
        }}
        >

        </View>

        <Text
          style={{
            color: Theme.colors.primary,
          }}
        >
          Total:
        </Text>
        <Text
          style={{
            fontFamily: Fonts.NunitoBold,
            fontSize: 18,
            color: Theme.colors.primary,
          }}
        >
          {moneyFormat(OpportunityStore.total, "Rp. ")}
        </Text> */}
      </Button>
    );
  return null;
});
