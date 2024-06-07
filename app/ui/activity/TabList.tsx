import { useTheme } from "@react-navigation/native";
import colors from "app/config/colors";
import ActivityStore from "app/model/activity";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { Button, ScrollView, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import Filter from "../utils/Filter";
import MainTopBar from "../utils/MainTopBar";

export default observer(({ state, tabs, navigation }: any) => {
  const Theme: ITheme = useTheme() as any;
  let filter = ActivityStore.filter;
  // switch (tabs[state.index].name) {
  //   case "Baru":
  //     filter = ActivityStore.filterBaru;
  //     break;
  //   case "Berjalan":
  //     filter = ActivityStore.filterBerjalan;
  //     break;
  //   case "Selesai":
  //     filter = ActivityStore.filterSelesai;
  //     break;
  // }

  return (
    <>
      <MainTopBar filter={filter} />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardAvoidingProps={{
          style: {
            flexShrink: 1,
          },
        }}
      >
        <View
          style={{
            flexDirection: "row",
            margin: 8,
            
          }}
        >
          {tabs.map((item: any, key: number) => {
            return (
              <Button
                key={key}
                style={{
                  flex: 1,
                  borderRadius: 24,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  minWidth: 60,
                  alignItems: "center",
                  position: "relative",
                  borderColor:
                  tabs[state.index].name === item.name
                      ? colors.primary
                      : colors.inactive,
                  backgroundColor:
                    tabs[state.index].name === item.name
                      ? "transparent"
                      : "transparent",
                      borderWidth:1
                }}
                onPress={() => {
                  navigation.navigate(item.name);
                }}
              >
                <Text
                  style={{
                    color: tabs[state.index].name === item.name
                    ? colors.primary
                    : colors.inactive,
                    fontWeight: "400",
                    fontSize: 13,
                    flexWrap: "nowrap",
                    flexDirection: "column",
                    alignItems: "center",
                    fontFamily:Fonts.poppins,
                    paddingTop:2,
                  }}
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                >
                  {item.name}
                </Text>
              </Button>
            );
          })}
        </View>
      </ScrollView>
      <Filter filter={ActivityStore.filter} />
    </>
  );
});
