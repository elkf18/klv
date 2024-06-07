import { Image, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
const image = require("app/assets/images/emptydashboard.png");

export default observer(({ text }: any) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Image
        source={image}
        style={{
          height: 220,
          width: 220,
          margin: 0,
        }}
        resizeMode={"contain"}
      />
      <Text
        style={{
          color: "#909090",
          padding: 10,
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </View>
  );
});
