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
  Checkbox,
  Image,
} from "libs/ui";
import ScrollView from "libs/ui/ScrollView";
import { useNavigation } from "@react-navigation/native";
import SessionStore from "app/model/session";

import { observer, useLocalObservable } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  useWindowDimensions,
  BackHandler,
} from "react-native";
import * as Yup from "yup";
import { runInAction } from "mobx";
import colors from "app/config/colors";

export default observer(() => {
  // HOOKS menyimpan value input
  const [name, setName] = useState("")
  const [namePerusahaan, setNamePerusahaan] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  // HOOKS validation error output
  const [errorName, setErrorName] = useState(false)
  const [errorPerusahaan, setErrorPerusahaan] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorEmailValidation, setErrorEmailValidation] = useState(false)
  // HOOKS validation page 2
  const [errorUsername, setErrorUsername] = useState(false)
  const [errorPassword, setErrorPassword] = useState(false)
  const [errorPasswordValidation, setErrorPasswordValidation] = useState(false)
  const [errorConfPassword, setErrorConfPassword] = useState(false)
  const [errorConfPasswordValidation, setErrorConfPasswordValidation] = useState(false)




  const dim = Dimensions.get("window");
  const nav = useNavigation();

  const handlePress = async (value: any) => {
    SessionStore.formRegist.isAgee = value;
  };

  const containsSpecialCharacters = (str: string) => {
    var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    return regex.test(str);
  }

  const handleSave = async () => {
    // validation Form Page 2 (dev - rajih)
    if (username === '') {
      setErrorUsername(true)
    } else {
      setErrorUsername(false)
    }

    if (containsSpecialCharacters(username)) {
      runInAction(()=>{
        setErrorUsername(true)
        setErrorUsername(true)
        setErrorUsername(true)
        setErrorUsername(true)
      })
    } else {
      runInAction(()=>{
        setErrorUsername(false)
        setErrorUsername(false)
        setErrorUsername(false)
      })
      
    }

    if (password === '') {
      setErrorPassword(true)
    } else if (password.length < 5) {
      setErrorPasswordValidation(true)
    } else {
      setErrorPassword(false)
      setErrorPasswordValidation(false)
    }
    if (confPassword === '') {
      setErrorConfPassword(true)
    } else {
      setErrorConfPassword(false)
    }
    if (confPassword === '') {
      setErrorConfPassword(true)
    } else if (password !== confPassword) {
      setErrorConfPasswordValidation(true)
    } else {
      setErrorConfPassword(false)
      setErrorConfPasswordValidation(false)
    }


    if (SessionStore.formRegist.isValid()
    ) {
      
      //  console.log("sudah tinggal running ke database");
      SessionStore.register().then((res) => {
        if (res.status == true) {
          //
          // SessionStore.loginCore(res.data)
          nav.reset;
          nav.navigate("PostRegist");
          // nav.goBack();
        }
      });
    } else {

      if (!SessionStore.formRegist.isAgee) {
        alert("Harap menyetujui syarat & ketentuan yang berlaku");
      } else {
        console.log( 
          "errorConfPassword: "+errorConfPassword +"\n"+
          "errorConfPasswordValidation: "+errorConfPasswordValidation +"\n"+
          "errorPasswordValidation: "+errorPasswordValidation +"\n"+
          "errorPassword: "+errorPassword +"\n"+
          "errorUsername: "+errorUsername
        )
      }
    }
    

  };

  const { height, width } = useWindowDimensions();

  const meta = useLocalObservable(() => ({
    visibleKeyboard: false,
    showAlert: false,
    page: 1,
  }));

  let heightx = (364 * (width / 2)) / 734;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        //setKeyboardVisible(true); // or some other action
        runInAction(() => (meta.visibleKeyboard = true));
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // setKeyboardVisible(false); // or some other action
        runInAction(() => (meta.visibleKeyboard = false));
      }
    );

    const backAction = () => {
      if (meta.page <= 1) {
        Alert.alert(
          "Keluar Registrasi",
          "Apakah anda yakin ingin keluar dari laman registrasi?",
          [
            {
              text: "Batal",
              onPress: () => null,
              style: "cancel",
            },
            { text: "Ya", onPress: () => nav.goBack() },
          ]
        );
      } else {
        meta.page = 1;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      backHandler.remove();
    };
  }, []);

  // Function Validation Form Register page 1 (dev-rajih)
  const onSubmitFormProfilBisnisValidation = () => {
    console.log(errorEmailValidation)
    if (name === '') {
      setErrorName(true)
    } else {
      setErrorName(false)
    }
    if (namePerusahaan === '') {
      setErrorPerusahaan(true)
    } else {
      setErrorPerusahaan(false)
    }
    if (email === '') {
      setErrorEmail(true)
    } else if (email !== '') {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (email.toLowerCase().match(regex)) {
        setErrorEmailValidation(false)
        setErrorEmail(false)
        meta.page++;
      } else {
        setErrorEmailValidation(true)
      }
    }

  }


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
        actionBackButton={() => {
          if (meta.page <= 1) {
            nav.goBack();
          } else {
            meta.page = 1;
          }
        }}
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
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexGrow: 1,
            paddingTop: 15,
            paddingBottom: 26,
            paddingHorizontal: 16,
          }}
        >
          {!meta.visibleKeyboard && (
            <>
              <Image
                source={require("app/assets/images/human1.png")}
                style={{
                  height: 160,
                  width: 182.94,
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  // resizeMode: "contain",
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
                Lengkapi Data Kamu
              </Text>
            </>
          )}

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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.poppinsbold,
                  textAlign: "left",
                  marginBottom: 20,
                  fontSize: 14,
                  flexGrow: 1
                }}
              >
                Isi profil bisnis kamu
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.poppins,
                  textAlign: "right",
                  color: colors.textPrimary,
                  marginBottom: 20,
                  fontSize: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 99,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  backgroundColor: colors.secondary
                }}
              >
                Paket POS
              </Text>
            </View>

            {/* <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.Roboto,
                textAlign: "left",
                marginBottom: 10,
                color: "#999999",
              }}
            >
              Lengkapi data diri anda
            </Text> */}
            <Form
              values={SessionStore.formRegist}
              onSubmit={() => {
                if (meta.page == 1) {
                  onSubmitFormProfilBisnisValidation()
                } else {
                  handleSave();
                }
              }}
              // validationSchema={{
              //   password: Yup.string().required("Harus diisi"),
              //   pic_name: Yup.string().required("Harus diisi"),
              //   client_name: Yup.string().required("Harus diisi"),
              //   username: Yup.string().required("Harus diisi"),
              //   phone: Yup.string()
              //     .required("Harus diisi")
              //     .min(6, "Minimal 8 angka."),
              //   name: Yup.string().required("Harus diisi"),
              //   email: Yup.string()
              //     .required("Harus diisi")
              //     .email("Email tidak sesuai"),
              //   confpassword: Yup.string()
              //     .oneOf([Yup.ref("password"), null], "Kata sandi tidak sama")
              //     .required("Harus diisi"),
              //   isAgree: Yup.string().required("Harus diisi"),
              // }}
              Submit={(submit, canSubmit) => (
                <Button
                  style={{
                    marginTop: 24,
                    paddingVertical: 10,
                    borderRadius: 10,
                    margin: 0,
                    backgroundColor: "#00B3FF",
                    // justifyContent: "center",
                    // alignItems: "center",
                    padding: 10,
                    height: 41,
                  }}
                  onPress={submit}
                >
                  {SessionStore.loading ? (
                    <Spinner color="#fff"></Spinner>
                  ) : (
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: Fonts.poppinsbold,
                        fontSize: 14,
                        height: 21,
                      }}
                    >
                      {meta.page == 1 ? "Lanjut" : "Selesai"}
                    </Text>
                  )}
                </Button>
              )}
            >
              {(props) => (
                <>
                  {meta.page == 1 && (
                    <>
                      <Field
                        initializeField={props}
                        label={"Nama Lengkap*"}
                        path={"pic_name"}
                        onChange={newText => setName(newText)}
                        styles={{
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="Nama Lengkap"
                          type={"text"}
                          style={{
                            textAlign: "left",
                            fontSize: 14,
                            padding: 10,
                            width: 328,
                            height: 41,
                            borderColor: "#E6E6E6",
                            fontFamily: Fonts.poppins,
                            borderWidth: 1,
                            borderRadius: 4,
                          }}
                        />
                      </Field>
                      {errorName === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Harus Diisi .
                        </Text>
                      ) : (
                        null
                      )}
                      <Field
                        initializeField={props}
                        label={"Nama Perusahaan*"}
                        path={"client_name"}
                        onChange={perusahaanText => setNamePerusahaan(perusahaanText)}
                        styles={{
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="PT.Jaya"
                          type={"text"}
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
                        />
                      </Field>
                      {errorPerusahaan === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Harus Diisi .
                        </Text>
                      ) : (
                        null
                      )}
                      <Field
                        initializeField={props}
                        label={"Telepon"}
                        path={"phone"}
                        editable={false}
                        styles={{
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="No. Telepon*"
                          type={"number"}
                          defaultValue={SessionStore.formRegist.phone}
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
                        />
                      </Field>
                      <Field
                        initializeField={props}
                        label={"Alamat E-mail Pribadi/Perusahaan*"}
                        path={"email"}
                        onChange={(email) => setEmail(email)}
                        styles={{
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="contoh@gmail.com"
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
                        />
                      </Field>
                      {errorEmailValidation === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Email Tidak Sesuai.
                        </Text>
                      ) : errorEmail === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Harus Diisi .
                        </Text>
                      ) : (
                        null
                      )}
                    </>
                  )}
                  {meta.page == 2 && (
                    <>
                      <Field
                        initializeField={props}
                        onChange={username => setUsername(username)}
                        label={"Username"}
                        path={"username"}
                        styles={{
                          input: {
                            borderRadius: 0,
                            borderWidth: 0,
                            borderColor: "#E6E6E6",
                            backgroundColor: "transparent",
                          },
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="Username"
                          type={"text"}
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
                        />
                      </Field>
                      {errorUsername === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          {username==''?"* Harus Diisi.":""}
                          {containsSpecialCharacters(username)?"* Tidak boleh ada karakter spesial.":""}
                          
                        </Text>
                      ) : (
                        null
                      )}
                      <Field
                        initializeField={props}
                        onChange={password => setPassword(password)}
                        label={"Password *"}
                        path={"password"}
                        styles={{
                          input: {
                            borderWidth: 1,
                            height: 41,
                            borderRadius: 4,
                            borderColor: "#E6E6E6",
                          },
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="Kata sandi"
                          type={"password"}
                          style={{
                            textAlign: "left",
                            fontSize: 14,
                            padding: 10,
                            height: 41,
                            borderColor: "#E6E6E6",
                            fontFamily: Fonts.poppins,
                          }}
                        />
                      </Field>
                      {errorPasswordValidation === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Password Minimal 5 Karakter.
                        </Text>
                      ) : errorPassword === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Harus Diisi .
                        </Text>
                      ) : (
                        null
                      )}
                      <Field
                        initializeField={props}
                        label={"Konfirmasi Password *"}
                        onChange={confPassword => setConfPassword(confPassword)}
                        path={"confpassword"}
                        styles={{
                          input: {
                            borderWidth: 1,
                            height: 41,
                            borderRadius: 4,
                            borderColor: "#E6E6E6",
                          },
                          label: {
                            height: 18,
                            fontFamily: Fonts.poppins,
                            fontWeight: "400",
                            fontSize: 12,
                            color: "#808080",
                            marginBottom: 5,
                          },
                        }}
                      >
                        <TextInput
                          placeholder="Ulangi kata sandi"
                          type={"password"}
                          style={{
                            textAlign: "left",
                            fontSize: 14,
                            padding: 10,
                            height: 41,
                            borderColor: "#E6E6E6",
                            fontFamily: Fonts.poppins,
                          }}
                        />
                      </Field>
                      {errorConfPassword === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Harus Diisi .
                        </Text>
                      ) : errorConfPasswordValidation === true ? (
                        <Text style={{ color: 'red', marginTop: -10, marginBottom: 10 }}>
                          * Password Tidak Sama.
                        </Text>
                      ) : (
                        null
                      )}

                      <Checkbox
                        editable={false}
                        isChecked={SessionStore.formRegist.isAgee}
                        label={`Saya menyetujui syarat & ketentuan yang\nberlaku`}
                        styles={{
                          label: {
                            fontFamily: Fonts.poppins,
                            fontSize: 12,
                            color: "#808080",
                            width: 328,
                          },
                        }}
                        onChangeValue={(value) => {
                          handlePress(value);
                        }}
                      />
                    </>
                  )}

                  {/* ///////////////////////////////////////////////////////////////////////////////////////////// */}

                  {/* 

                  

                   */}
                </>
              )}
            </Form>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});
