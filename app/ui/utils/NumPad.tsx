import Fonts from "libs/assets/fonts";
import { Button, Icon, Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";

export default observer((props: any) => {
  const { setValue } = props;
  const dim = Dimensions.get("window");
  const w = dim.width / 3 - 20;
  const h = w / 2;
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "delete"];
  const setAction = (item: any) => {
    if (typeof item === "number") {
      if (!!setValue) {
        setValue(`${props.value}${item}`);
      }
    } else {
      if (!!setValue) {
        setValue(`${props.value}`.slice(0, props.value.length - 1));
      }
    }
  };

  return (
    <View
      style={{
        alignSelf: "flex-end",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 20,
        marginBottom: 25,
      }}
    >
      {keys.map((item, key) => {
        if (item === null)
          return (
            <View
              key={key}
              style={{
                width: w,
                height: h,
              }}
            />
          );
        return (
          <Button
            key={key}
            onPress={() => {
              setAction(item);
            }}
            style={{
              width: w,
              height: h,
              margin: 2,
              backgroundColor: "#0001",
              alignSelf: "flex-end",
              borderRadius: 8,
            }}
          >
            {typeof item === "number" ? (
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: Fonts.poppinsbold,
                }}
              >
                {item}
              </Text>
            ) : (
              <Icon name="ios-backspace" size={24} color={"red"} />
            )}
          </Button>
        );
      })}
    </View>
  );
});
