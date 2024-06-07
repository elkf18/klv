import Fonts from "libs/assets/fonts";
import {
  Button,
  Field,
  Form,
  ImageBackground,
  TextInput,
  Screen,
  Spinner,
  Text,
  View,
  TopBar,
  Image,
} from "libs/ui";
import ScrollView from "libs/ui/ScrollView";
import { useNavigation } from "@react-navigation/native";
import SessionStore from "app/model/session";

import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import * as Yup from "yup";
import { action } from "mobx";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();

  const requestOTP = async () => {
    dismiss();
    SessionStore.requestOTP();
    nav.navigate("guest/OTP");
  };
  const meta = useLocalObservable(() => ({
    visibleKeyboard: false,
    showAlert: false,
  }));

  const dismiss = action(() => (meta.showAlert = false));

  const onSubmit = async () => {
    // let exist = await SessionStore.isRegistered();

    // console.log(exist);

    // if (exist) {
    //   alert("Nomor Sudah Terdaftar.")
    // } else {
    let res = await SessionStore.requesMailtOTP();
    if (!!res) {
      nav.navigate("guest/OTP");
    }
    // }
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
            width: 84.91,
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginLeft: 85,
          }}
        />
      </TopBar>
      <ScrollView>
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
            Verifikasi Email
          </Text>

          <View
            style={{
              backgroundColor: "#ffffff",
              marginHorizontal: -15,
              padding: 15,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              height: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.poppinsbold,
                textAlign: "left",
                marginBottom: 10,
                color: '#404040',
                height: 21,
              }}
            >
              Daftar Email
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.poppins,
                textAlign: "left",
                marginBottom: 10,
                color: "#999999",
              }}
            >
              Pastikan email yang dimasukkan valid
            </Text>
            <Form
              values={SessionStore.formRegist}
              onSubmit={onSubmit}
              validationSchema={{
                email: Yup.string()
                  .required("Harus diisi")
                  .email("Email tidak valid"),
              }}
              Submit={(submit, canSubmit) => (
                <Button
                  style={{
                    marginTop: 30,
                    padding: 10,
                    borderRadius: 10,
                    margin: 0,
                    backgroundColor: "#00B3FF",
                  }}
                  onPress={submit}
                  disabled={!canSubmit || SessionStore.loading}
                >
                  {SessionStore.loading ? (
                    <Spinner color="#fff"></Spinner>
                  ) : (
                    <Text
                      style={{
                        color: "#fafafa",
                        fontFamily: Fonts.poppinsbold,
                        fontSize: 16,
                      }}
                    >
                      Kirim Kode OTP
                    </Text>
                  )}
                </Button>
              )}
            >
              {(props) => (
                <>
                  <Field
                    initializeField={props}
                    label={"Email"}
                    path={"email"}
                    styles={{
                      label: {
                        color: "#333",
                        textAlign: "left",
                        fontStyle: "italic",
                        fontSize: 0,
                      },
                    }}
                  >
                    <TextInput
                      type={"email"}
                      style={{
                        textAlign: "left",
                        fontSize: 14,
                        borderWidth: 1,
                        padding: 10,
                        width: 328,
                        height: 41,
                        borderRadius: 4,
                        borderColor: "#E6E6E6",
                        fontFamily: Fonts.poppins,
                      }}
                      placeholder="Masukkan Email"
                    />
                  </Field>
                </>
              )}
            </Form>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});
