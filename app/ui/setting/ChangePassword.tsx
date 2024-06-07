import { useNavigation, useTheme } from "@react-navigation/native";
import SessionStore from "app/model/session";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  Field,
  Form,
  Screen,
  ScrollView,
  Text,
  TextInput,
  TopBar,
  View,
} from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import * as Yup from "yup";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  const submit = async () => {
    SessionStore.changePass().then((res: any) => {
      console.log("result: "+res)
        if (res==true) {
          
         nav.goBack();
        }
      });
    
    
  
  };

  const onChangeValid = () => {
    if (
      !!SessionStore.form.password &&
      !!SessionStore.form.repassword &&
      SessionStore.form.password === SessionStore.form.repassword
    ) {
      SessionStore.form.canSubmit = true;
    } else {
      SessionStore.form.canSubmit = false;
    }
  };
  SessionStore.initForm();
  
  return (
    <Screen
      statusBar={{
        backgroundColor: Theme.colors.primary,
        barStyle: "light-content",
      }}
    >
      <TopBar backButton
        styles={{
          title:{
            paddingTop:3
          }
        }}>Ubah Sandi</TopBar>
      <ScrollView>
      <View
          style={{
            padding: 15,
          }}
        >
        <Form
          values={SessionStore.form}
          onSubmit={submit}
          validationSchema={{
            password: Yup.string()
              .required("Harus di isi.")
              .min(6, "Minimal 6 huruf.")
              .max(16, "Maksimal 16 huruf")
              .matches(
                /^[a-zA-Z0-9]+$/,
                "Format salah, harap gunakan kombinasi (a-z, A-Z, 0-9)"
              ),
            repassword: Yup.string().oneOf(
              [Yup.ref("password"), null],
              "Kata sandi tidak sama."
            ),
          }}
          Submit={(handleSubmit, canSubmit) => (
            <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
          )}
          // validate={(data) => {
          //   let error = [];
          //   if ((data.password || "").length < 6) {
          //     error.push({
          //       path: "password",
          //       message: "Minimal password 6 huruf.",
          //     });
          //   }
          //   if (data.password !== data.repassword) {
          //     error.push({
          //       path: "repassword",
          //       message: "Verifikasi password salah.",
          //     });
          //   }
          //   return error;
          // }}
          // disableSubmitComponent
        >
          {(props) => (
            <>
            <Field
                initializeField={props}
                label={"Password Lama *"}
                path={"oldPassword"}
              >
                <TextInput type={"password"}></TextInput>
              </Field>
              <Field
                initializeField={props}
                label={"Password Baru *"}
                path={"password"}
              >
                <TextInput type={"password"}></TextInput>
              </Field>
              <Field
                initializeField={props}
                label={"Verifikasi Password Baru *"}
                path={"repassword"}
                 onChange={onChangeValid}
              >
                <TextInput type={"password"}></TextInput>
              </Field>
            </>
          )}
        </Form>
     
        </View>
       </ScrollView>
    </Screen>
  );
});

const RenderSubmit = observer((props: any) => {
  const { handleSubmit, canSubmit } = props;
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  return (
    <Button
      style={{
        margin: 0,
        marginTop: 15,
        paddingVertical: 12,
      }}
      onPress={handleSubmit}
      disabled={!canSubmit || SessionStore.form.saving}
    >
      <Text
        style={{
          color: Theme.colors.textLight,
          fontSize: 16,
          fontFamily: Fonts.NunitoBold,
        }}
      >
        {SessionStore.form.saving ? "Menyimpan..." : "Simpan"}
      </Text>
    </Button>
  );
});
