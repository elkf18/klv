import { Button, Icon, Image, Text, View } from "libs/ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Customer } from "app/model/customer";
import { observer } from "mobx-react";
import React from "react";
import { Linking, Platform } from "react-native";
import { ITheme } from "libs/config/theme";
import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import UsersStore, { UsersForm } from "app/model/users";
import colors from "app/config/colors";


export default observer((props: { item: UsersForm; outlet?: any }) => {
  const Theme: ITheme = useTheme() as any;
  const { item, outlet } = props;
  const nav = useNavigation();

  const cstyle = StyleSheet.flatten([
    {
      height: 120,
      width: "100%",
    },
  ]);

  const telp = () => {
    let url = "tel:" + item.phone;
    if (Platform.OS === "ios") {
      url = "tel://" + item.phone;
    }
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Oops can't open phone.");
      }
    });
  };


  const email = () => {
    let url = "mailto:" + item.email;
    if (Platform.OS === "ios") {
      url = "mailto://" + item.email;
    }
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Oops can't open email.");
      }
    });
  };

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
      overflow: "hidden",
      padding: 10,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    }}
      onPress={() => {

        //UsersStore.detailUser = item
        nav.navigate("user/users/Detail", {
          id: item.id,
          name: item.fullname,
        });

      }}
    >

      <View
        style={{
          flexDirection: "row"
        }}>

        <View
          style={{
          }}>
          {!!item.role_description &&
            <Text
              style={{
                color: colors.black,
                marginTop: 0,
                fontSize: 12,
                fontFamily: Fonts.poppins
              }}
            >
              {!!item.role_description ? item.role_description : "-"}
            </Text>
          }
          <View
            style={{
              flexDirection: "row",
              flexGrow: 1,
              alignItems: "center"
            }}>

            <Text
              style={{
                color: colors.black,
                fontSize: 16,
                fontFamily: Fonts.poppinsmedium,
                marginTop: 5
              }}

              numberOfLines={1}
            >
              {item.fullname}
            </Text>

          </View>



          {!!item.phone && (
            <>
              <Text
                style={{
                  color: colors.grey,
                  marginTop: 5,
                  fontFamily: Fonts.poppins,
                }}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {item.phone}
                {" | "}
                {item.email}

              </Text>
            </>
          )}

        </View>
      </View>

    </Button>
  );
});
