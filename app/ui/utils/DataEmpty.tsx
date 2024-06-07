import React from "react";
import { View, Icon, Text } from "libs/ui";

export default () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon
        source={"Ionicons"}
        name={"ios-alert"}
        size={18}
        color={"#505052"}
        style={{
          margin: 5,
        }}
      ></Icon>
      <Text
        style={{
          color: "#505052",
          lineHeight: 40,
        }}
      >
        Data is empty
      </Text>
    </View>
  );
};
