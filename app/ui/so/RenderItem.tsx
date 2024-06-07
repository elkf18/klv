import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import colors from "app/config/colors";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { Button, Icon, Text, View } from "libs/ui";
import { dateFormat } from "libs/utils/date";
import { moneyFormat } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";

export default observer(({ item }: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();

  const pallete = {
    "status": {
      "cancelled": "#E7E7E7",
      "paid": "#E5F7FF",
      "submitted": "#FFE7C2",
      "complete": "#C8FFCA"

    }
  }

  return (
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
        borderWidth: 1,
        borderColor: colors.cardBorder,

      }}
      onPress={() => {
        nav.navigate("user/so/Detail", {
          id: item.id,
        });
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row"
          }}>
          <Text
            style={{
              color: "#333333",
              fontSize: 14,
              fontFamily: Fonts.poppinsmedium,
              textAlignVertical: "center",

              paddingHorizontal: 4,
              paddingVertical: 2
            }}
          >
            {item.sales_order_number}
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: Fonts.poppins,
              backgroundColor: pallete["status"][item.status],
              marginStart: 4,
              paddingHorizontal: 4,
              paddingVertical: 2,
              borderRadius: 3
            }}
          >
            {item.status}

          </Text>
          <View style={{ flexGrow: 1 }} />

          <Text
            style={{
              color: "#808080",
              fontSize: 14,
              fontFamily: Fonts.poppins,
              alignContent: "flex-end",
              alignItems: "flex-end",
              alignSelf: "flex-end",
              textAlign: "right",
              paddingHorizontal: 4,
              paddingVertical: 2

            }}
          >
            {dateFormat(item.sales_order_date)}

          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            color: colors.textPrimary,
            marginRight: 40,
            fontFamily: Fonts.poppinsmedium,
            marginTop: 5
          }}
        >

          {"Rp. " + moneyFormat(item.grand_total)}
        </Text>

      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          alignContent: "center"
        }}
      >

        <Icon name="person-outline" source="MaterialIcons"
          style={{
            marginEnd: 4,
            color: colors.black
          }} />
        <Text
          style={{
            color: colors.black,
            fontSize: 12,
            marginEnd: 10,
            fontFamily: Fonts.poppins,
            textAlignVertical: "center",

          }}
        >
          {item.customer_name}
        </Text>
        <Icon name="work-outline" source="MaterialIcons"
          style={{
            marginEnd: 4,
            color: colors.black
          }} />
        <Text
          style={{
            color: "#333333",
            fontSize: 12,
            fontFamily: Fonts.poppins,
            textAlignVertical: "center",
            flexGrow: 1,
            flexBasis: 0
          }}
        >
          {item.fullname}
        </Text>
      </View>

      {/* <Icon
        name="ios-cart"
        size={40}
        color={"#ddd"}
        style={{
          position: "absolute",
          right: 5,
          bottom: 5,
        }}
      /> */}
    </Button>
  );
});
