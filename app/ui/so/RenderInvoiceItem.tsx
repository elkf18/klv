import { View, Button, Text, Icon, moneyFormat } from "app/libs";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import Theme from "app/libs/theme";
import { dateFormat } from "app/libs/utils/date";
import _ from "lodash";
import { toJS } from "mobx";
import Fonts from "app/libs/fonts";
import { ITheme } from "libs/config/theme";

export default observer(({ item, index, refresh }: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const meta = useLocalObservable({});

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
          nav.navigate("user/so/FormInvoice", {
            item: item,
            onGoBack: refresh,
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
            {dateFormat(item.created_date, "dd MMMM yyyy")}
          </Text>
        </View>
        <Text
          style={{
            color: "#8c8c8c",
            marginTop: 5,
          }}
        >
          {String(item.payment_method).toUpperCase()}
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontFamily: Fonts.NunitoBold,
          }}
        >
          {moneyFormat(item.total_payment, "Rp. ")}
        </Text>
      </Button>
    </View>
  );
});
