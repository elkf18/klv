import { Button, Icon, Text, View } from "libs/ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import SessionStore from "app/model/session";
import { observer } from "mobx-react";
import React from "react";
import { DefaultTheme, ITheme } from "libs/config/theme";
import { dateFormat } from "libs/utils/date";
import Fonts from "libs/assets/fonts";
import { Colors } from "react-native/Libraries/NewAppScreen";
import colors from "app/config/colors";

export default observer(({ item }: any) => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  if (!item) return null;
  let color = "#ed6663";
  switch (item.type) {
    case "Kunjungan":
      color = "#035aa6";
      break;
    case "Tlp":
      color = "#ffb677";
      break;
  }

  let date = "";
  let time = "";
  if (!!item.visit_date) {
    date = item.visit_date.slice(0, item.visit_date.length - 6);
    time = item.visit_date.slice(
      item.visit_date.length - 5,
      item.visit_date.length
    );
  }
  const isTime = time[0] !== "0" || time[1] !== "0";

  return (
    <Button
      style={{
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        margin: 5,
        marginTop: 0,
        marginBottom:16,
        display: "flex",
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 8,
        padding: 15,

        borderWidth: 1,
        borderColor: Theme.colors.border,
      }}
      onPress={() => {
        nav.navigate("user/activity/Detail", {
          id: item.id,
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",

        }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.primary,
            fontFamily: Fonts.poppinsmedium,
          }}
        >
          {item.type}
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

          }}
        >
          {/* {dateFormat(date, "dd MMM yyyy")} */}
           {isTime && " " + time}


        </Text>
      </View>


      <Text
        style={{
          fontSize: 16,
          color: "#333333",
          marginRight: 40,
          fontFamily: Fonts.poppinsmedium,
          marginTop:5


        }}
        lineBreakMode="tail"
        numberOfLines={2}
      >
        {item.title}
      </Text>

      

      {/* {["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) >
        -1 && ( */}
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
          {item.name}
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
          {item.sales_name}
        </Text>
      </View>


      {/* ) */}
      {/* } */}


    </Button>
  );
});
