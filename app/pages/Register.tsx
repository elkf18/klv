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
} from "libs/ui";
import ScrollView from "libs/ui/ScrollView";
import { useNavigation } from "@react-navigation/native";
import SessionStore from "app/model/session";

import { observer } from "mobx-react-lite";
import React from "react";
import { Dimensions } from "react-native";
import * as Yup from "yup";
import { action } from "mobx";

export default observer(() => {
    const dim = Dimensions.get("window");
    const nav = useNavigation();
    
    const requestOTP = async () => {
      
      SessionStore.requestOTP();
      nav.navigate("guest/OTP");
    };
    //const dismiss = action(() => (showAlert = false));
    return (
      <Screen
        style={{
          backgroundColor: "white",
        }}
        statusBar={{
          backgroundColor: "#00000000",
        }}
      >
        <ScrollView>
          {/* <ImageBackground
            source={require("app/assets/images/icon.jpg")}
            resizeMode={"cover"}
          > */}
            
            <View
              style={{
                backgroundColor: "#EFEFEF",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                flexGrow: 1,
                paddingVertical: 40,
                paddingHorizontal: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppinsbold,
                  textAlign: "center",
                  paddingHorizontal: 20,
                  marginVertical: 10,
                }}
              >
                Register
              </Text>
              <Form
                values={SessionStore.form}
                onSubmit={() => {
                  nav.navigate("guest/OTP");
                }}
                validationSchema={{
                  name: Yup.string().required("Harus diisi"),
                  // email: Yup.string()
                  //   .required("Harus diisi")
                  //   .email("Email tidak sesuai"),
                }}
                Submit={(submit, canSubmit) => (
                  <Button
                    style={{
                      marginTop: 30,
                      paddingVertical: 10,
                      borderRadius: 99,
                      margin: 0,
                      backgroundColor: "#000",
                    }}
                    onPress={requestOTP}
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
                        Berikutnya
                      </Text>
                    )}
                  </Button>
                )}
              >
                {(props) => (
                  <>
                    <Field
                      initializeField={props}
                      label={"Nama"}
                      path={"name"}
                      styles={{
                        label: {
                          color: "#333",
                          textAlign: "center",
                          fontStyle: "italic",
                        },
                        input: {
                          borderRadius: 0,
                          borderWidth: 0,
                          borderColor: "#000",
                          backgroundColor: "transparent",
                          borderBottomWidth: 1,
                        },
                      }}
                    >
                      <TextInput
                        type={"text"}
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                        }}
                      />
                    </Field>
                    <Field
                      initializeField={props}
                      label={"E-mail"}
                      path={"email"}
                      styles={{
                        label: {
                          color: "#000",
                          textAlign: "center",
                          fontStyle: "italic",
                        },
                        input: {
                          borderRadius: 0,
                          borderWidth: 0,
                          borderColor: "#333",
                          backgroundColor: "transparent",
                          borderBottomWidth: 1,
                        },
                      }}
                    >
                      <TextInput
                        type={"email"}
                        style={{
                          textAlign: "center",
                          fontSize: 18,
                        }}
                      />
                    </Field>
                  </>
                )}
              </Form>
            </View>
          {/* </ImageBackground> */}
        </ScrollView>
      </Screen>
    );
  });
  