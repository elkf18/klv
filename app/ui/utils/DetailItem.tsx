import Fonts from "libs/assets/fonts";
import { Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ label, value, style, children }: any) => {
  return (
    <View
    style={{
      flexDirection:"column",
      flexGrow:1,
      ...style,
    }}
    >
      {!!label && (
        <Text
          style={{
            fontSize: 14,
            flex:1,
            fontFamily:Fonts.poppins,
            color:"#808080"
          }}
        >
          {label}
        </Text>
      )}
      <Text
        style={{
          flexDirection: "row",
          flex:1,
          alignItems: "center",
          justifyContent: "flex-end",
          fontFamily:Fonts.poppinsmedium,
            color:"#333333"
        }}
      >
        {children || value || "-"}
      </Text>
      <View
        style={{
          marginVertical: 10,
          borderBottomColor: '#E6E6E6',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
});
