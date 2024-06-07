import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  DocumentPicker,
  Field,
  Form,
  Screen,
  ScrollView,
  Select,
  Spinner,
  Text,
  TextInput,
  TopBar,
  View,
} from "libs/ui";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import * as Yup from "yup";
import CustomSpinner from "../utils/CustomSpinner";
import Loading from "../utils/Loading";
import {ToastAndroid } from "react-native";
import OutletStore from "app/model/outlet";
import UsersStore from "app/model/users";
import styles from "app/config/styles";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  const route = useRoute();
  const isEdit = !!UsersStore.formUser.id;
  const id = UsersStore.formUser.id;

  const handleSave = async () => {
    console.log("yy")
    var res = await UsersStore.formUser.saveX();
    if (!!res) {
      nav.goBack();
      if(isEdit){
        
        var s=UsersStore.detailUser.load(id);
        
      }
      UsersStore.loadMore(0);
      
    }
    
  };


  return (
    <Screen
    style={{
      backgroundColor:"#fff"
    }}>
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          
            nav.goBack();
          
        }}
        rightAction={<CustomSpinner loading={UsersStore.formUser.loading} />}
        styles={{
          title:{
            paddingTop:3
          }
        }}
      >
        {!isEdit ? "Buat Pengguna Baru" : "Ubah Data Pengguna"}
      </TopBar>
      <Loading loading={UsersStore.formUser.loading} />
      <View style={{flex: 1}} >
          <Form
            values={UsersStore.formUser}
            validationSchema={{
              fullname: Yup.string().required("Harus di isi."),
              username: Yup.string().required("Harus di isi.")
              .matches(
                /^[a-zA-Z0-9@]+$/,
                "Tidak boleh ada karakter spesial"
              ),
              r: Yup.number().required("Harus di isi.").nullable(),
              email: Yup.string().required("Harus di isi.").email("Format email tidak sesuai."),
              id_outlet: (UsersStore.formUser.r===6 || UsersStore.formUser.r===206) ? Yup.number().required("Harus di isi.").nullable() : Yup.number().nullable(),
              password: !!UsersStore.formUser.id?Yup.string().nullable():Yup.string().required("Harus di isi."),
              //email: Yup.string().email("Format email tidak sesuai."),
            }}
            onSubmit={handleSave}
            Submit={(handleSubmit, canSubmit) => (
              <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
            )}
            // onError={(error) => {
            //   let field = error
            //     .filter((x) => x.status === false)
            //     .map((x) => x.label);
            //   if (field.length > 0) {
            //     Alert.alert(
            //       "Terjadi Kesalahan",
            //       `Mohon Anda lengkapi dahulu kolom ${field.join(", ")}.`
            //     );
            //   }
            // }}
          >
            {(props) => (
              <>
              <ScrollView
                style={{
                  width: "100%",
                }}
                contentContainerStyle={{
                  padding: 10,
                  paddingBottom: 100
                }}
              >
                <Field initializeField={props} label={"Nama *"} path={"fullname"}
                  styles={{
                    label:{
                       fontFamily:Fonts.poppinsmedium ,
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                  >
                  <TextInput type={"text"} 
                    onChangeText={(e:any)=>{
                      ToastAndroid.show(e,ToastAndroid.SHORT)
                    UsersStore.formUser.fullname = e
                  }} 
                  onChangeValue={(e:any)=>{
                    ToastAndroid.show(e,ToastAndroid.SHORT)
                  UsersStore.formUser.fullname = e
                }} 
                  />
                </Field>
                <Field initializeField={props} label={"Username *"} path={"username"}
                  styles={{
                    label:{
                       fontFamily:Fonts.poppinsmedium ,
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}>
                  <TextInput type={"text"} />
                </Field>
                
                <Field
                  initializeField={props}
                  label={"Role"}
                  path={"r"}
                  styles={{
                    label:{
                       fontFamily:Fonts.poppinsmedium ,
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <Select
                    placeholder={"Pilih role"}
                    items={UsersStore.roles}
                    labelPath={"role_description"}
                    valuePath={"id"}
                  />
                </Field>
                
                <Field
                  initializeField={props}
                  label={"Email *"}
                  path={"email"}
                  styles={{
                    label:{
                       fontFamily:Fonts.poppinsmedium ,
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <TextInput type={"email"} />
                </Field>
                
                <Field
                  initializeField={props}
                  label={"Telepon"}
                  path={"phone"}
                  styles={{
                    label:{
                       fontFamily:Fonts.poppinsmedium ,
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <TextInput type={"number"} />
                </Field>
                
                
               {(UsersStore.formUser.r===6 || UsersStore.formUser.r===206)&&
                  <Field
                  initializeField={props}
                  label={"Outlet *"}
                  path={"id_outlet"}
                  styles={{
                    label:{
                        fontFamily:Fonts.poppinsmedium ,
                        color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <Select
                    placeholder={"Pilih Outlet"}
                    items={OutletStore.list}
                    labelPath={"nama"}
                    valuePath={"id"}
                  />
                </Field>
               }
                

                {!isEdit &&
                <Field initializeField={props} label={"Password *"} path={"password"}
                  styles={{
                    label:{
                       fontFamily:Fonts.poppinsmedium ,
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}>
                  <TextInput type={"password"} />
                </Field>
                }
                
              </ScrollView>
              </>
            )}
          </Form>
        </View>
      {UsersStore.formUser.saving && (
        <View
          style={{
            zIndex: 9999,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            shadow
            style={{
              padding: 30,
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: 20,
              backgroundColor: "white",
              width: 200,
              height: 150,
            }}
          >
            <Text
              style={{
                color: Theme.colors.primary,
              }}
            >
              Menyimpan...
            </Text>
            <Spinner />
          </View>
        </View>
      )}
    </Screen>
  );
});

const RenderSubmit = observer((props: any) => {
  const { handleSubmit, canSubmit } = props;
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      <View
        style={{
          borderTopColor: "#cccccc",
          backgroundColor: "#ffffff",
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 16,
          elevation: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
        </View>
        <View style={{
          flexDirection: "row",
          flex: 1,
          flexGrow: 1,

        }}>
          <Button
            style={{
              margin: 0,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              flexGrow: 1,
              flexBasis: 0,
            }}
            onPress={handleSubmit}
            disabled={ !canSubmit ||UsersStore.formUser.saving}//!canSubmit ||
          >
            <Text
              style={{
                color: Theme.colors.textLight,
                fontSize: 16,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              {UsersStore.formUser.saving ? "Menyimpan..." : "Simpan"}
            </Text>
          </Button>
        </View>

      </View>
    </>
  );
});