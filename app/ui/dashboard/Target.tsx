import Fonts from "libs/assets/fonts";
import { Text } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions, View } from "react-native";

export default observer(({ state }: any) => {
  const dim = Dimensions.get("window");
  const baseWidth = dim.width - 30 || 0;
  const achievement = (baseWidth / state.target) * state.achievement || 0;
  const achievementPerc = (
    (state.achievement / state.target) * 100 || 0
  ).toFixed(2);
  return (
    <View style={{ padding: 15, paddingVertical: 5 }}>
      <View
        style={{
          marginBottom: 15,
        }}
      >
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Dashboard Pencapaian Sales
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            {achievementPerc}%
          </Text>
        </View>
        <View
          style={{
            marginBottom: 20,
            borderRadius: 99,
            height: 10,
            width: baseWidth,
            backgroundColor: "#dadada",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              borderRadius: 99,
              backgroundColor: "#4caf50",
              height: 10,
              width: !Number.isFinite(achievement) ? 0 : achievement,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                backgroundColor: "#dadada",
                marginRight: 10,
              }}
            />
            <Text>Target</Text>
          </View>
          <Text
            style={{
              alignSelf: "flex-end",
              fontFamily: Fonts.NunitoBold,
            }}
          >
            {moneyFormat(state.target || 0, "Rp. ")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                backgroundColor: "#4caf50",
                marginRight: 10,
              }}
            />
            <Text>Pencapaian</Text>
          </View>
          <Text
            style={{
              alignSelf: "flex-end",
              fontFamily: Fonts.NunitoBold,
            }}
          >
            {moneyFormat(state.achievement || 0, "Rp. ")}
          </Text>
        </View>
      </View>
    </View>
  );
});
