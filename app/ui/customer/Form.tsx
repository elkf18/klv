import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import DetailDivider from "app/ui/utils/DetailDivider";
import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { ITheme } from "libs/config/theme";
import {
  Button,
  Camera,
  DateTime,
  Field,
  Form,
  Icon,
  Image,
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
import { Dimensions, StyleSheet } from "react-native";
import AdditionalField from "../utils/AdditionalField";
import styles from "app/config/styles";
import UsersStore from "app/model/users";
import SessionStore from "app/model/session";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  const route = useRoute();
  const isEdit = !!CustomerStore.detail.id;

  function submit() {

  }

  if (!isEdit) {
    CustomerStore.detail.initForm()
  }

  useEffect(() => {
    CustomerStore.detail.loadCache();
    UsersStore.loadAssign();
  }, []);

  return (
    <Screen
      style={{
        backgroundColor: "#fff"
      }}>
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await CustomerStore.detail.reset();
          if (res !== null) {
            nav.goBack();
          }
        }}
        rightAction={<CustomSpinner loading={CustomerStore.detail.loading} />}
        styles={{
          title: {
            textAlign: "center",
            marginEnd: 50,
            fontFamily: Fonts.poppinsmedium,
          }
        }}
      >
        {!isEdit ? "Tambah Pelanggan" : "Ubah Data Pelanggan"}
      </TopBar>
      <Loading loading={CustomerStore.detail.loading} />
      <View style={{ flex: 1 }} >
        <Form
          values={CustomerStore.detail}
          validationSchema={{
            name: Yup.string().required("Harus di isi."),
            //id_segment: Yup.string().required("Harus di isi.").nullable(),
            //address: Yup.string().required("Harus di isi."),
            //status: Yup.string().required("Harus di isi."),
            //contact_person_name: Yup.string().required("Harus di isi."),
            email: Yup.string().email("Format email tidak sesuai."),
          }}
          onSubmit={() => {
            CustomerStore.detail.save().then((res) => {
              if (!!res) {
                if (isEdit) {
                  CustomerStore.detail.load(CustomerStore.detail.id!!);
                }

                CustomerStore.load();
                nav.goBack();
              }
            });
          }}
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
                <Field
                  initializeField={props}
                  label="Foto"
                  path="foto"
                  hiddenLabel
                  styles={{
                    input: {
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      overflow: "visible",
                    },
                    field: {
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}
                >
                  <Camera renderPreview={(props) => <Preview {...props} />} />
                </Field>

                <Field initializeField={props} label={"Nama *"} path={"name"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}>
                  <TextInput type={"text"} placeholder={"Nama Lengkap"} />
                </Field>
                {CustomerStore.getCustomerSegment.length > 0 &&

                  <Field
                    initializeField={props}
                    label={"Industri"}
                    path={"id_segment"}
                    styles={{
                      label: {
                        fontFamily: Fonts.poppinsmedium,
                        color: "#333333"
                      },
                      input: {
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: "#CCCCCC",
                        backgroundColor: "transparent",
                        borderBottomWidth: 1,
                      },
                    }}
                  >
                    <Select
                      placeholder={"Pilih industri"}
                      items={CustomerStore.getCustomerSegment}
                      labelPath={"name"}
                      valuePath={"id"}
                    />
                  </Field>
                }
                <Field
                  initializeField={props}
                  label={"Alamat"}
                  path={"address"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <TextInput type={"multiline"} placeholder={"Alamat lengkap"} />
                </Field>
                <Field
                  initializeField={props}
                  label={"Tanggal Lahir"}
                  path={"born_date"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <DateTime type={"date"} />
                </Field>
                <Field initializeField={props} label={"Kota"} path={"new_city"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}>
                  <TextInput type={"text"} placeholder={"Kota domisili"} />
                </Field>
                <Field
                  initializeField={props}
                  label={"Provinsi"}
                  path={"new_province"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"text"} placeholder={"Provinsi domisili"} />
                </Field>
                <Field
                  initializeField={props}
                  label={"Negara"}
                  path={"new_country"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"text"} placeholder={"Negara domisili"} />
                </Field>
                <Field
                  initializeField={props}
                  label={"Telpon 1"}
                  path={"phone1"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"number"} placeholder={"Nomor telepon 1"} />
                </Field>
                <Field
                  initializeField={props}
                  label={"Telpon 2"}
                  path={"phone2"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"number"} placeholder={"Nomor telepon 2"} />
                </Field>
                <Field initializeField={props} label={"Email"} path={"email"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}>
                  <TextInput type={"email"} placeholder={"Alamat Email"} />
                </Field>
                <Field initializeField={props} label={"Fax"} path={"fax"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}>
                  <TextInput type={"number"} placeholder={"Nomor fax"} />
                </Field>
                {SessionStore.package.id != 6 &&
                <Field initializeField={props} label={"Sales"} path={"id_sales"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}>
                  <Select
                    placeholder={"Pilih Sales"}
                    items={UsersStore.listAssign}
                    labelPath={"fullname"}
                    valuePath={"id"}
                  ></Select>
                  </Field>
                  }
                {/* <Field
                  initializeField={props}
                  label={"Status *"}
                  path={"status"}
                >
                  <TextInput type={"text"} />
                </Field> */}
                {/* <DetailDivider
                  style={{
                    marginHorizontal: -15,
                    marginVertical: 15,
                  }}
                >
                  Kontak
                </DetailDivider>
                <Field
                  initializeField={props}
                  label={"Nama *"}
                  path={"contact_person_name"}
                  styles={{
                    label:{
                       fontFamily:Fonts.RobotoBold ,
                       color:"#333333"
                    },
                    input: {
                      borderRadius: 0,
                      borderWidth: 0,
                      borderColor: "#E6E6E6",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"text"} />
                </Field>
                <Field
                  initializeField={props}
                  label={"Telpon 1"}
                  path={"contact_person_phone"}
                  styles={{
                    label:{
                       fontFamily:Fonts.RobotoBold ,
                       color:"#333333"
                    },
                    input: {
                      borderRadius: 0,
                      borderWidth: 0,
                      borderColor: "#E6E6E6",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"number"} />
                </Field> */}
                {/* <Field
                  initializeField={props}
                  label={"Telpon 2"}
                  path={"contact_person_phone"}
                >
                  <TextInput type={"number"} />
                </Field> */}

                {/* <Field
                  initializeField={props}
                  label={"Posisi"}
                  path={"position"}
                >
                  <TextInput type={"text"} />
                </Field> */}
                {
                  CustomerStore.detail.additional_data.length > 0 &&
                  <>
                    <DetailDivider
                      style={{
                        marginHorizontal: -15,
                        marginVertical: 15,
                      }}
                    >
                      Custom Field
                    </DetailDivider>
                    {
                      CustomerStore.detail.additional_data.map(
                        (item: any, key: number) => {

                          return (
                            <AdditionalField
                              key={key}
                              index={key}
                              item={item}
                              initialize={props}
                            />
                          )
                        }
                      )
                    }
                  </>
                }

              </ScrollView>
            </>
          )}
        </Form>
      </View>
      {CustomerStore.detail.saving && (
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
            alignItems: "stretch",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
        </View>
        <View style={{
          flexDirection: "row",
        }}>
          <Button
            style={{
              margin: 0,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              flexGrow: 1,


            }}
            onPress={handleSubmit}
            disabled={!canSubmit || CustomerStore.detail.saving}
          >
            <Text
              style={{
                color: Theme.colors.textLight,
                fontSize: 16,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              {CustomerStore.detail.saving ? "Menyimpan..." : "Simpan"}
            </Text>
          </Button>
        </View>

      </View>
    </>
  );
});


const Preview = observer((props: any) => {
  const { source, styles } = props;
  const Theme = useTheme();
  const cstyle = StyleSheet.flatten([
    {
      height: 120,
      width: "100%",
    },
    styles?.thumbnail,
  ]);
  const s = source;
  if (!!s && !!s.uri && s.uri.includes("file://")) {
    s.uri = s.uri;
  } else if (!!s && !!s.uri && s.uri === CustomerStore.detail.foto) {
    s.uri = AppConfig.serverUrl + s.uri;
  }

  return (
    <>
      <View
        style={{
          alignItems: "center",
          width: 100,
          height: 100,
          overflow: "hidden",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#ddd",
        }}
      >
        {!!s && !!s.uri ? (
          <Image source={s} resizeMode="cover" style={cstyle} />
        ) : (
          <Icon name="person" size={60} color={"#ccc"} />
        )}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: -15,
          backgroundColor: Theme.colors.primary,
          borderWidth: 1,
          borderColor: "#eee",
          padding: 10,
          borderRadius: 99,
        }}
      >
        <Icon source="FontAwesome" name="pencil" size={18} color={"#fff"} />
      </View>
    </>
  );
});
