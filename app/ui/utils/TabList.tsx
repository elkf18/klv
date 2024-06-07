import React, { useEffect } from "react";
import { View, Button, Text, ScrollView } from "libs/ui";

import { observer } from "mobx-react";
import { action, runInAction } from "mobx";
import { Dimensions } from "react-native";
import { ITheme } from "libs/config/theme";
import { useTheme } from "@react-navigation/native";

export default observer(({ state, tabs }: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  useEffect(() => {
    if (!state.tab && tabs.length > 0)
      runInAction(() => {
        state.tab = tabs[0].value;
      });
  }, [tabs]);
  return (
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
                borderRadius: 6,
                paddingHorizontal: 15,
                paddingVertical: 10,
                minWidth: 60,
                alignItems: "center",
                position: "relative",
                backgroundColor:
                  state.tab === item.value
                    ? Theme.colors.secondary
                    : Theme.colors.primary,
              }}
              onPress={action(() => {
                state.tab = item.value;
              })}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "400",
                  fontSize: 13,
                  flexWrap: "nowrap",
                  flexDirection: "column",
                  alignItems: "center",
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
  );
});
