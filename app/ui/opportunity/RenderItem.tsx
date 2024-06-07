import { Button, Icon, Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import SessionStore from "app/model/session";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";
import { ITheme } from "libs/config/theme";
import Fonts from "libs/assets/fonts";
import { dateFormat, dateParse } from "libs/utils/date";
import { Colors } from "react-native/Libraries/NewAppScreen";
import colors from "app/config/colors";

export default observer(({ item, refresh }: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();

  const today = new Date();
  const date = new Date(dateParse(item.created_date));

  const diffTime = Math.abs(date.getTime() - today.getTime());

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        borderRadius: 8,
        padding: 15,
        margin: 5,
        borderWidth: 1,
        borderColor: '#E6E6E6',
      }}
      onPress={() => {
        nav.navigate("user/opportunity/Detail", {
          id: item.id,
          onGoBack: refresh,
        });
      }}
    >
      <View
        style={{

          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            color: "#333333",
            fontSize: 16,
            fontFamily: Fonts.poppinsmedium,
            flexGrow: 1,
          }}
        >
          {item.name}
        </Text>

      </View>
      {/* <Text
        style={{
          color: "#333",
          marginRight: 40,
        }}
      >
        {item.customer_name}
      </Text> */}
      <Text
        style={{
          color: "#008FCC",
          fontSize: 16,
          fontFamily: Fonts.poppinsmedium,
          flexGrow: 1,
        }}
      >{moneyFormat(Number(item.amount), "Rp. ")}</Text>

      {/* {["Administrator"].indexOf(SessionStore.role.role_name) > -1 && (
          <Text
            style={{
              color: "#8c8c8c",
              marginTop: 5,
            }}
          >
            {item.fullname}
          </Text>
        )} */}

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
            color: Colors.black
          }} />
        <Text
          style={{
            color: "#333333",
            fontSize: 12,
            fontFamily: Fonts.poppins,
            textAlignVertical: "center",
          }}
        >
          {item.fullname}
        </Text>
      </View>

      <Text
        style={{
          position: 'absolute',
          top: 10,
          right: 15,
          color: "#808080",
          fontSize: 14,
          fontFamily: Fonts.poppins
        }}
      >
        {diffDays} hari
      </Text>
    </Button>
  );
});
