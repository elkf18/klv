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
import colors from "app/config/colors";


export default observer((props: { item: Customer; outlet?: any }) => {
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
    let url = "tel:" + item.phone1;
    if (Platform.OS === "ios") {
      url = "tel://" + item.phone1;
    }
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        try{
          Linking.openURL(url);
        }catch(e:any){
          alert("Oops can't open phone.");
        }
      }
    });
  };

  const telp2 = () => {
    let url = "tel:" + item.phone2;
    if (Platform.OS === "ios") {
      url = "tel://" + item.phone2;
    }
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        try{
          Linking.openURL(url);
        }catch(e:any){
          alert("Oops can't open phone.");
        }
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
        try{
          Linking.openURL(url);
        }catch(e:any){
          alert("Oops can't open email.");
        }
        
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
        margin: 5,
        display: "flex",
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 6,
        overflow: "hidden",
        padding: 10,
        borderWidth: 1,
        borderColor: '#E6E6E6',
      }}
      onPress={() => {
        if (outlet == true) {
          nav.navigate("user/customer/outlet/Detail", {
            id: item.id,
            name: item.name,
          });
        } else {
          nav.navigate("user/customer/Detail", {
            id: item.id,
            name: item.name,
          });
        }
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
          >
            {!!item.foto ? (
              <Image
                source={{ uri: AppConfig.serverUrl + item.foto }}
                resizeMode="center"
                style={cstyle}
              />
            ) : (
              <Text
                style={{
                  fontFamily: Fonts.poppinsbold,
                  color: "#AAAAAA",
                  fontSize: 24,
                  paddingTop: 3
                }}
              > {item.name.charAt(0)} </Text>
            )}
          </View></View>
        <View
          style={{
            width: "80%",
          }}>
          <View
            style={{
              flexDirection: "row",
              flexGrow: 1,
              alignItems: "center"
            }}>
            <Text
              style={{
                color: "#333333",
                fontSize: 14,
                fontFamily: Fonts.poppinsmedium,
                width: "70%"
              }}

              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontFamily: Fonts.poppinsmedium,
                position: "absolute",
                right: 0
              }}
              numberOfLines={1}
            >
              {item.status == "Leads" ? "Leads" : ""}
            </Text>
          </View>


          {/* {!!item.segment &&
      <Text
        style={{
          color: "#AAAAAA",
          marginTop: 0,
          fontSize: 12,
          fontFamily:Fonts.poppinsmedium
        }}
      >
        {!!item.segment?item.segment:"-"}
      </Text>
      } */}
          {!!item.name && (
            <>
              <Text
                style={{
                  color: "#333333",
                  marginTop: 5,
                  fontSize: 12,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 12,
                  }}
                  onPress={telp}
                >
                  {item.phone1}
                </Text>
                {!!item.phone1 && !!item.phone2 ? " | " : ""}
                <Text
                  style={{
                    color: "#000",
                    fontSize: 12,
                  }}
                  onPress={telp2}
                >
                  {item.phone2}
                </Text>
              </Text>
            </>
          )}
          {/* <Icon
        name="business"
        size={30}
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
