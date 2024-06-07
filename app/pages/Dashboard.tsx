import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import DashboardStore from "app/model/dashboard";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import ContentItem from "app/ui/dashboard/ContentItem";
import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { ITheme } from "libs/config/theme";
import { BarCodeScanner, Button, Icon, ImageBackground, ScrollView, Text, View } from "libs/ui";
import { capitalizeFLetter } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions, RefreshControl, useWindowDimensions } from "react-native";
import FunnelSales from "../ui/dashboard/FunnelSales";
import OpportunityCustomer from "../ui/dashboard/OpportunityCustomer";
import OpportunitySales from "../ui/dashboard/OpportunitySales";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const refresh = () => {
    DashboardStore.load();
  };

  const refreshControl = (
    <RefreshControl refreshing={DashboardStore.loading} onRefresh={refresh} />
  );

  useEffect(() => {
    DashboardStore.load();
  }, [isFocused]);

  const { height, width } = useWindowDimensions();

  let heightx = (735 * width) / 1440;

  return (
    <>
      <ImageBackground
        source={require("app/assets/images/bg_1flip.png")}
        resizeMode={"contain"}
        imageStyle={{
          top: 0,
          left: 0,
          width: width,
          height: heightx,

        }}>




        <ScrollView
          refreshControl={refreshControl}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        >
          <View
            style={{
              alignContent: "flex-end",
              alignItems: "flex-end",
              flexDirection: "row",
              marginTop: 40
            }}
          >
            <View style={{
              flexGrow: 1
            }} />
            <Button
              style={{
                backgroundColor: Theme.colors.primary + "00",
                minWidth: 44,
                margin: 0,
                paddingHorizontal: 0,
              }}
              onPress={() => nav.navigate("Inbox")}
            >
              <Icon
                name={"notifications"}
                size={24}
                color={"#000"}
              ></Icon>
            </Button>
            {/* <BarCodeScanner onBarCodeScanned={(e:any)=>{
              alert(e.data);

            }}/> */}
            {/* <Button
              style={{
                backgroundColor: Theme.colors.primary + "00",
                minWidth: 44,
                margin: 0,
                paddingHorizontal: 0,
              }}
              onPress={() => nav.navigate("Setting")}
            >
              <Icon
                name={"md-settings"}
                size={24}
                color={"#000"}
              ></Icon>
            </Button>  */}

          </View>


          <View
            style={{
              padding: 15,
              borderRadius: 8,
              backgroundColor: "#fff7",
              margin: 15,
              marginVertical: 10,
              zIndex: 9
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#393939",
              }}
            >
              Hi,{" "}
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 20,
                  color: "#393939",
                }}
              >
                {SessionStore.user.fullname} 👋
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#393939",
              }}
            >
              {capitalizeFLetter(
                SessionStore.role.role_desc || SessionStore.role.role_name
              )}
            </Text>
          </View>

          <ContentItem item={DashboardStore.so} modul={"Penjualan"} />

          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.poppinsmedium,
              color: "#8E8E8E",
              marginHorizontal: 15,
              marginBottom: 12,
              marginTop: 32

            }}
          >
            {"Prospek (Bulan ini)"}
          </Text>
          <ContentItem item={DashboardStore.opportunity.new} modul={"New"} />
          <View
            style={{
              marginTop: 12
            }}
          />
          <ContentItem item={DashboardStore.opportunity.won} modul={"Won"} />
          <View
            style={{
              marginTop: 12
            }} />
          <ContentItem item={DashboardStore.opportunity.lose} modul={"Lose"} />







        </ScrollView>
      </ImageBackground>
    </>
  );
});
