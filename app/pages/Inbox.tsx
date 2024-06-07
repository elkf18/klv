import {  FlatList,Button, Icon, Screen, ScrollView, Text, TopBar, View } from "libs/ui";
import { observer } from "mobx-react-lite";
import React from "react";
import { Dimensions } from "react-native";
import { ITheme } from "libs/config/theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import List from "app/ui/inbox/List";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;
  return (
    <Screen
      statusBar={{
        backgroundColor: Theme.colors.primary,
        barStyle: "light-content",
      }}
    >
      <TopBar backButton styles={{
          title:{
            paddingTop:3
          }
        }}>Notifikasi</TopBar>
      <List />
    </Screen>
  );
});