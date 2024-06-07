import { Spinner, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";

export default observer(({ loading, label }: any) => {
  const dim = Dimensions.get("window");

  if (!!loading)
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,.4)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <Spinner size="small"></Spinner>
          <Text
            style={{
              fontSize: 18,
              marginLeft: 15,
            }}
          >
            {!!label ? label : "Memuat..."}
          </Text>
        </View>
      </View>
    );

  return null;
});
