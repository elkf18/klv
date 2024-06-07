import { Button, Icon, TextInput, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ state, placeholder }: any) => {
  return (
    <>
      <View
        type={"View"}
        style={{
          borderColor: "#f0f0f0",
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 4,
          padding: 5,
          backgroundColor: "#fbfbfb",
          paddingLeft: 10,
          paddingRight: 10,
          flexDirection: "row",
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "flex-start",
          minHeight: 50,
          height: 50,
        }}
      >
        <Icon
          source={"AntDesign"}
          name={"search1"}
          size={20}
          style={{
            marginRight: 8,
          }}
          color={"#818181"}
        ></Icon>
        <TextInput
          placeholder={placeholder}
          type={"text"}
          style={{
            flexGrow: 1,
          }}
          value={state.search}
          onChangeText={(value) => {
            state.search = value;
          }}
        ></TextInput>
      </View>
      <Button
        style={{
          backgroundColor: "rgba(245,166,35,0.14)",
          minWidth: 45,
          minHeight: 45,
          padding: 5,
          marginLeft: 10,
          paddingLeft: 5,
          paddingRight: 5,
          margin: 0,
        }}
        onPress={() => (state.showPicker = true)}
      >
        <Icon
          source={"Ionicons"}
          name={"md-calendar"}
          size={30}
          color={"#f5a623"}
        />
      </Button>
    </>
  );
});
