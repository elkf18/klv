import Fonts from "libs/assets/fonts";

import { Button, Icon, Image, ImageBackground, Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { ITheme } from "libs/config/theme";
import AppConfig from "libs/config/app";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import SessionStore from "app/model/session";
import colors from "app/config/colors";
import { color } from "react-native-reanimated";

export default observer(({ item }: any) => {
  const nav = useNavigation();
  const cstyle = StyleSheet.flatten([
    {
      height: 120,
      width: "100%",
    },
  ]);

  return (
    <Button
      style={{
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        display: "flex",
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 6,
        overflow: "hidden",
        paddingHorizontal: 8,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: colors.cardBorder,
      }}
      onPress={() => {
        nav.navigate("user/product/Detail", {
          id: item.id,
        });
      }}
    >
      <View
        style={{
          flexDirection: "row"
        }}>
        <View
          style={{
            borderRadius: 99,
            paddingHorizontal: 0,
            paddingVertical: 0,

          }}
        >

          <View
            style={{
              alignItems: "center",
              width: 52,
              height: 52,
              overflow: "hidden",
              justifyContent: "center",
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "#E6E6E6",
              marginEnd: 15
            }}
          ><Text
          style={{
            fontFamily: Fonts.poppinsbold,
            color: "#AAAAAA",
            fontSize: 24,
            paddingTop: 3,
            position:"absolute"
          }}
        > {item.product_name.charAt(0)} </Text>
              <Image
                source={{ uri: AppConfig.serverUrl + item.url_pic }}
                resizeMode="center"
                style={{
                  ...cstyle,
                  zIndex:5
                }}
              />
            
            
          </View>
        </View>
        <View
          style={{
            alignContent:"center",
            alignSelf:"center"
          }}>

          <View>
            <Text
              style={{
                fontSize: 14,
                color: "#333333",
                fontFamily: Fonts.poppinsmedium,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.product_name}
            </Text>
          </View>
          {/* <Text
            style={{
              color: "#AAAAAA",
              flex: 1,
              fontSize: 14,
              fontFamily: Fonts.Roboto
            }}
          >
            {item.code}
          </Text> */}
          {/* {item.product_group && (
            <Text
              style={{
                color: "#8c8c8c",
              }}
            >
              {item.product_group}
            </Text>
          )} */}


          {!!SessionStore.user.id_outlet && !!item.normal_price &&
            <Text
              style={{
                fontFamily: Fonts.poppins,
                fontSize: 14,
                color: colors.grey
              }}
            >
              {moneyFormat(item.normal_price, "Rp. ")}
            </Text>
          }

          {/* <Icon
        name="layers"
        size={40}
        color={"#ddd"}
        style={{
          position: "absolute",
          right: 5,
          bottom: 5,
        }}
      /> */}
        </View>
      </View>
    </Button>
  );
});
