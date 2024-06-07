import { useNavigation } from "@react-navigation/native";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import PinInput from "app/ui/utils/PinInput";
import { ITheme } from "libs/config/theme";
import useTheme from "libs/hooks/useTheme";
import NumPad from "app/ui/utils/NumPad";
import { Button, Text, View } from "libs/ui";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";

export default observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const length = 4;
  const nav = useNavigation();
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

  //const { setTimer, interval } = props;

  useEffect(() => {
    setTimer();

    return () => {
      if (!!interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#EFEFEF",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexGrow: 1,
        padding: 30,
      }}
    >
      <View
        style={{
          marginHorizontal: 30,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontFamily: Theme.fontStyle.bold,
            fontSize: 18,
            color: "#000",
          }}
        >
          Masukkan Kode OTP
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontSize: 16,
          }}
        >
          Kode OTP telah dikirim melalui SMS ke{" "}
          <Text
            style={{
              fontFamily: Theme.fontStyle.bold,
            }}
          >
            {SessionStore.form.phone}
          </Text>
        </Text>
      </View>
      <View
        style={{
          marginVertical: 15,
        }}
      >
        <PinInput value={SessionStore.formRegist.otp} length={length} />
      </View>
      <ResendButton setTimer={setTimer} />
    </View>
  );
});

const ResendButton = observer((props: any) => {
  const { setTimer } = props;
  const Theme: ITheme = useTheme() as any;
  const resendOTP = async () => {
    const r = await SessionStore.requestOTP();
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "center",
      }}
      onPress={resendOTP}
      disabled={GlobalStore.timer > 0}
    >
      <Text
        style={{
          color: "#ffffff",
          fontFamily: Theme.fontStyle.bold,
          fontSize: Theme.fontSize.h4,
        }}
      >
        {GlobalStore.timer === 0 ? "Kirim ulang kode OTP" : getTime()}
      </Text>
    </Button>
  );
});
