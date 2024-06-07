import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import DashboardStore from "app/model/dashboard";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { ITheme } from "libs/config/theme";
import { Button, Icon, ScrollView, Text, TopBar, View } from "libs/ui";
import { capitalizeFLetter } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions, RefreshControl } from "react-native";
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

  return (
    <>
      <TopBar
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 10
        }}
        rightAction={
          <Button
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
          </Button>
        }
      >
        <>
          {/* {!!GlobalStore.activeMenu.icon && (
            <Icon
              {...(GlobalStore.activeMenu.icon as any)}
              color={"#000"}
              size={28}
              style={{
                marginRight: 15,
              }}
            />
          )} */}
          <Text
            style={{
              color: "#000",
              fontSize: 20,
              fontFamily: Fonts.poppinsbold,
              flexGrow: 1,
              paddingTop:5,
            }}
          >
            {GlobalStore.activeMenu.label || ""}
          </Text>
        </>
      </TopBar>
      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View
          style={{
            padding: 15,
            borderRadius: 8,
            backgroundColor: "#03A9F4",
            margin: 15,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: "white",
            }}
          >
            Hi,{" "}
            <Text
              style={{
                fontWeight: "500",
                fontSize: 24,
                color: "white",
              }}
            >
              {SessionStore.user.fullname}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "white",
            }}
          >
            {capitalizeFLetter(
              SessionStore.role.role_desc || SessionStore.role.role_name
            )}
          </Text>
        </View>
        {/* <FunnelSales meta={DashboardStore} /> */}

        {/* {AppConfig.mode=="dev" &&
        <OpportunitySales meta={DashboardStore} />
        } */}
        
        <OpportunityCustomer meta={DashboardStore} />
      </ScrollView>
    </>
  );
});
