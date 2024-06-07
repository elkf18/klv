import { useNavigation } from "@react-navigation/native";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import NumPad from "app/ui/utils/NumPad";
import { ImageBackground, Screen, Text, TopBar, View, Image } from "libs/ui";
import ScrollView from "libs/ui/ScrollView";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useWindowDimensions } from "react-native";
import Form from "./Form";

export default observer(() => {
  const nav = useNavigation();
  const length = 4;
  let interval: any;

  const setTimer = () => {
    if (GlobalStore.timer === 0) {
      let minute = 1;
      runInAction(() => (GlobalStore.timer = minute * 60));
    }

    interval = setInterval(() => {
      if (GlobalStore.timer > 0) {
        runInAction(() => (GlobalStore.timer -= 1));
      } else {
        if (!!interval) clearInterval(interval);
      }
    }, 999);
  };

  const checkUser = async () => {
    if (SessionStore.formRegist.otp.length === length) {
      let valid = await SessionStore.validationOTP();
      // let valid = await SessionStore.validationMailOTP();
      if (!!valid) {
        // if (!!SessionStore.form.isRegister) {
        runInAction(() => (GlobalStore.timer = 0));
        if (!!interval) clearInterval(interval);
        nav.navigate("guest/Register");
        // } else {
        //   runInAction(() => (GlobalStore.timer = 0));
        //   if (!!interval) clearInterval(interval);
        //   nav.navigate("guest/Pin");
        // }
      }
    }
  };

  const change = (value: string) => {
    runInAction(() => (SessionStore.formRegist.otp = value.slice(0, 6)));
    checkUser();
  };
  const { height, width } = useWindowDimensions();

  let heightx = (364 * (width / 2)) / 734;
  return (
    <Screen
      style={{
        backgroundColor: "#F3F6F7",
      }}
      statusBar={{
        barStyle: "dark-content",
        backgroundColor: "#00000000",
      }}
    >
      <TopBar
        style={{
          backgroundColor: "transparent",
        }}
        enableShadow={false}
        backButton={true}
        iconProps={{
          color: '#404040',
          name: "arrowleft",
          source: "AntDesign",
        }}
        styles={{
          title: {
            paddingTop: 3,
          },
        }}
      >
        <Image
          source={require("app/assets/images/logo.png")}
          style={{
            height: 20,
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        />
      </TopBar>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Form setTimer={setTimer} interval={interval} />
        {/* <KeyBoard change={change} /> */}
      </ScrollView>
    </Screen>
  );
});

const KeyBoard = observer(({ change }: any) => {
  return (
    <View
      style={{
        backgroundColor: "#fff0",
      }}
    >
      <NumPad value={SessionStore.formRegist.otp} setValue={change} />
    </View>
  );
});
