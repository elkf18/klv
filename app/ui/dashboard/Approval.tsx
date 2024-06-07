import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Icon, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import Fonts from "libs/assets/fonts";

export default observer(({ state }: any) => {
  const nav = useNavigation();
  const route = useRoute();
  return (
    <View
      style={{
        padding: 15,
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Button
        style={{
          borderRadius: 8,
          backgroundColor: "#8BC34A",
          flexGrow: 1,
          width: 100,
          height: 120,
          margin: 5,
          overflow: "hidden",
          justifyContent: "space-between",
          flexDirection: "column",
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: "flex-start",
        }}
        onPress={() => {
          nav.navigate("ApprovalRoadPlan");
        }}
      >
        <Text
          style={{
            padding: 10,
            paddingBottom: 0,
            fontSize: 16,
            fontFamily: Fonts.NunitoBold,
            color: "#fff",
          }}
        >
          Aktivitas
        </Text>
        <Icon
          name={"ios-walk"}
          size={70}
          color={"#fff"}
          style={{
            margin: 0,
            position: "absolute",
            bottom: 0,
            left: 20,
            opacity: 0.6,
          }}
        />
        <View
          style={{
            alignSelf: "flex-end",
            alignItems: "flex-start",
            padding: 15,
            minWidth: 100,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Icon name={"md-time"} size={22} color={"#fff"} />
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                fontSize: 24,
                color: "#fff",
              }}
            >
              {state.roadPlan?.pending || 0}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Icon
              name={"ios-checkmark-circle-outline"}
              size={22}
              color={"#fff"}
            />
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                fontSize: 24,
                color: "#fff",
              }}
            >
              {state.roadPlan?.approved || 0}
            </Text>
          </View>
        </View>
      </Button>
      <Button
        style={{
          borderRadius: 8,
          backgroundColor: "#03A9F4",
          flexGrow: 1,
          width: 100,
          height: 120,
          margin: 5,
          overflow: "hidden",
          justifyContent: "space-between",
          flexDirection: "column",
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: "flex-start",
        }}
        onPress={() => {
          nav.navigate("ApprovalContract");
        }}
      >
        <Text
          style={{
            padding: 10,
            paddingBottom: 0,
            fontSize: 16,
            fontFamily: Fonts.NunitoBold,
            color: "#fff",
          }}
        >
          Ini diganti apa mas?
        </Text>
        <Icon
          name={"ios-copy"}
          size={60}
          color={"#fff"}
          style={{
            margin: 0,
            position: "absolute",
            bottom: 10,
            left: 20,
            opacity: 0.6,
          }}
        />
        <View
          style={{
            alignSelf: "flex-end",
            alignItems: "flex-start",
            padding: 15,
            minWidth: 100,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Icon name={"md-time"} size={22} color={"#fff"} />
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                fontSize: 24,
                color: "#fff",
              }}
            >
              {state.contract?.pending || 0}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Icon
              name={"ios-checkmark-circle-outline"}
              size={22}
              color={"#fff"}
            />
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                fontSize: 24,
                color: "#fff",
              }}
            >
              {state.contract?.approved || 0}
            </Text>
          </View>
        </View>
      </Button>
    </View>
  );
});
