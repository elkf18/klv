import { useTheme } from "@react-navigation/native";
import OpportunityStore from "app/model/opportunity";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { Button, ScrollView, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import Filter from "../utils/Filter";
import MainTopBar from "../utils/MainTopBar";
import { getPath } from "./getPath";

export default observer(({ state, tabs, navigation }: any) => {
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      <MainTopBar filter={OpportunityStore.filter} disableDate />
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
            flex: 1,
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
                  getPath(tabs[state.index]) === getPath(item)
                      ? "#00B3FF"
                      : "#CCCCCC",
                  backgroundColor:
                  getPath(tabs[state.index]) === getPath(item)
                      ? "#fff"
                      : "#fff",
                      borderWidth:1,
                }}
                onPress={() => {
                  navigation.navigate(getPath(item));
                }}
              >
                <Text
                  style={{
                    color:
                    getPath(tabs[state.index]) === getPath(item)
                        ? "#00B3FF"
                        : "#CCCCCC",
                    fontWeight: "400",
                    fontSize: 13,
                    flexWrap: "nowrap",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop:2,
                    textAlignVertical:"center",
                    alignContent:"center",
                    
                    fontFamily:Fonts.poppins
                  }}
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                >
                  {item.label}
                </Text>
              </Button>
            );
          })}
        </View>
      </ScrollView>
      <Filter filter={OpportunityStore.filter} />
    </>
  );
});
