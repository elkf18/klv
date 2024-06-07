import { useNavigation } from "@react-navigation/native";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import PinInput from "app/ui/utils/PinInput";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import useTheme from "libs/hooks/useTheme";
import { Button, Icon, Text, View, Image } from "libs/ui";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import NumPad from "../utils/NumPad";

export default observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const length = 4;
  const nav = useNavigation();
  const { setTimer, interval } = props;

  useEffect(() => {
    setTimer();

    return () => {
      if (!!interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const change = (value: string) => {
    runInAction(() => (SessionStore.formRegist.otp = value.slice(0, 6)));
    checkUser();
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

  return (
    <View
      style={{
        backgroundColor: "#FFF0",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexGrow: 1,
        paddingTop: 15,
        paddingBottom: 26,
        paddingHorizontal: 16,
      }}
    >
      <Image
        source={require("app/assets/images/HP.png")}
        style={{
          height: 200,
          width: 169.35,
          alignContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: Fonts.poppins,
          textAlign: "center",
          marginTop: 15,
          marginBottom: 16,
          color: "#808080",
        }}
      >
        Verifikasi Nomer Telepon
      </Text>

      <View
        style={{
          backgroundColor: "#ffffff",
          marginHorizontal: -15,
          //paddingHorizontal: 15,
          paddingTop:15,
          paddingBottom:15,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
           marginBottom: -45
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: Fonts.poppinsbold,
            textAlign: "left",
            marginBottom: 10,
            color: '#404040',
            width: 68,
            height: 21,
            paddingHorizontal: 15,
          }}
        >
          Kode OTP
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: Fonts.poppins,
            textAlign: "left",
            marginBottom: 0,
            color: "#808080",
            width: 328,
            height: 20,
            paddingHorizontal: 15,
          }}
        >
          Masukkan 4 digit kode OTP yang kami kirim ke email
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: Fonts.poppinsbold,
            textAlign: "left",
            marginTop: 0,
            marginBottom: 0,
            color: "#808080",
            width: 328,
            height: 20,
            paddingHorizontal: 15,
          }}
        >
          {SessionStore.formRegist.phone}
        </Text>
        <View
          style={{
            paddingVertical: 20,
            backgroundColor: "#fff0",
          }}
        >
          <PinInput value={SessionStore.formRegist.otp} length={length} />
        </View>
        <ResendButton setTimer={setTimer} />
        <KeyBoard change={change} />
      </View>
    </View>
  );
});

const ResendButton = observer((props: any) => {
  const { setTimer } = props;
  const Theme: ITheme = useTheme() as any;
  const resendOTP = async () => {
    const r = await SessionStore.requestOTP();
    // const r = await SessionStore.requesMailtOTP();
    if (r) {
      setTimer();
    }
  };
  const getTime = () => {
    let m = ("0" + Math.floor(GlobalStore.timer / 60)).slice(-2);
    let s = ("0" + (GlobalStore.timer % 60)).slice(-2);
    return `${m}:${s}`;
  };

  return (
    <Button
      style={{
        paddingVertical: 0,
        paddingHorizontal: 20,
        alignSelf: "center",
        backgroundColor: "#fff0",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={resendOTP}
      disabled={GlobalStore.timer > 0}
    >
      <Icon
        name={"refresh"}
        size={14}
        source="SimpleLineIcons"
        color={Theme.colors.primary}
      ></Icon>
      <Text
        style={{
          marginStart: 4,
          color: " #404040",
          fontFamily: Fonts.poppins,
          fontSize: 14,
          justifyContent: "center",
          textAlignVertical: "center",
        }}
      >
        {GlobalStore.timer === 0 ? "Kirim Ulang kode OTP" : getTime()}
      </Text>
    </Button>
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

