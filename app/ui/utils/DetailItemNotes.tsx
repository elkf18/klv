import Fonts from "libs/assets/fonts";
import { Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ label, value, style, children }: any) => {
  return (
    <View
      style={{
        marginBottom: 15,
        ...style,
      }}
    >
      {!!label && (
        <Text
          style={{
            fontSize: 14,
            fontFamily:Fonts.Roboto,
            color: "#808080"
          }}
        >
          {label}
        </Text>
      )}
      <Text
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "justify",
          fontFamily:Fonts.Roboto,
          color: "#333333",
          borderColor:"#CCCCCC",
          borderWidth:1,
          padding:10,
          borderRadius:10,
          marginTop:10

        }}
      >
        {children || value || "-"}
      </Text>
    </View>
  );
});
