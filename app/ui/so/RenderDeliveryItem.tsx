import Fonts from "libs/assets/fonts";

import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { Button, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";
import { dateFormat } from "libs/utils/date";
import { ITheme } from "libs/config/theme";

export default observer(({ item, index }: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();

  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        marginBottom: 10,
      }}
    >
      <View
        shadow
        style={{
          width: 35,
          height: 35,
          borderRadius: 99,
          backgroundColor: Theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: Fonts.Nunito,
          }}
        >
          {index + 1}
        </Text>
      </View>
      <Button
        style={{
          backgroundColor: "#fff",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          marginBottom: 10,
          display: "flex",
          flexGrow: 1,
          flexShrink: 1,
          borderRadius: 6,
          padding: 10,
          borderColor: "#ccc",
          borderWidth: 1,
        }}
        onPress={() => {
          nav.navigate("user/so/DetailDelivery", {
            id: item.id,
            sales_order: item.id_sales_order,
          });
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              color: Theme.colors.primary,
              marginRight: 10,
            }}
          >
            #{item.invoice_code}
          </Text>
        </View>
        <Text
          style={{
            color: "#8c8c8c",
            marginTop: 5,
          }}
        >
          {dateFormat(item.deliver_date, "dd MMMM yyyy")}
        </Text>
        <Text
          style={{
            color: "#8c8c8c",
            marginTop: 5,
          }}
        >
          Total Item: {item.total_item}
        </Text>
        <Text
          style={{
            color: "#8c8c8c",
            marginTop: 5,
          }}
        >
          Total Qty: {item.total_qty}
        </Text>
      </Button>
    </View>
  );
});
