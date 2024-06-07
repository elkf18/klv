import SessionStore from "app/model/session";
import Fonts from "libs/assets/fonts";
import { Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";

export default observer((props: any) => {
  const { value, length } = props;
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push(
      <View
        key={i}
        style={{
          borderWidth: 1,
          borderRadius: 4,
          // borderBottomColor: i + 1 <= value.length ? "#1ACBDA" : "#E6E6E6",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          paddingTop: 7,
          marginHorizontal: 12,
        }}
      >
        <Text
          style={{
            height: 35,
            width: 35,
            justifyContent: "center",
            textAlign: "center",
            fontFamily: Fonts.poppins,
            fontSize: 20,
            alignItems: "center",
            color: '#404040',
          }}
        >
          {i + 1 <= value.length ? SessionStore.formRegist.otp.charAt(i) : "-"}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 0,
      }}
    >
      {items}
    </View>
  );
});
