import Fonts from "libs/assets/fonts";

import {
  Button,
  Field,
  Form,
  Icon,
  Screen,
  ScrollView,
  Select,
  TextInput,
  Spinner,
  Text,
  TopBar,
  View,
  Camera,
  Image,

} from "libs/ui";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";

import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Alert, Dimensions, StyleSheet } from "react-native";
import DetailDivider from "../utils/DetailDivider";
import { ITheme } from "libs/config/theme";
import SessionStore from "app/model/session";
import OutletStore from "app/model/outlet";
import AreaStore from "app/model/area";
import AppConfig from "libs/config/app";
import styles from "app/config/styles";
import colors from "app/config/colors";
import * as Yup from "yup";


export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const meta = OutletStore.form;
  let { id }: any = route.params || {};

  const handleSave = async () => {

    OutletStore.form.savePhoto().then((res) => {
      if (res) {
        OutletStore.load();
        nav.goBack();
      }
    });


  };

  useEffect(() => {
    OutletStore.form.load(id)
    AreaStore.load();
  });
  return (
    <Screen
      style={{
        backgroundColor: "#fff"
      }}>
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await OutletStore.form.reset();
          if (res !== null) {
            nav.goBack();
          }
        }}

        styles={{
          title: {
            paddingTop: 3
          }
        }}
      >
        {!OutletStore.form.id ? "Tambah Outlet" : "Ubah data Outlet"}
      </TopBar>

      <View style={{ flex: 1 }} >
        <Form
          values={OutletStore.form}
          validationSchema={{
            nama: Yup.string().required("Harus di isi."),
            m_area: Yup.number().required("Harus di isi.").nullable(),
          }}
          onSubmit={handleSave}
          Submit={(handleSubmit, canSubmit) => (
            <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
          )}
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
                  path="img_url"
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

                <Field
                  initializeField={props}
                  label={"Nama Cabang *"}
                  path={"nama"}

                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Nama cabang"
                    type={"text"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>
                <Field
                  initializeField={props}
                  label={"Kode Area *"}
                  path={"m_area"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <Select
                    placeholder={"Select"}
                    items={AreaStore.getList}
                    labelPath={"code"}
                    valuePath={"id"}
                    onChange={(val) => {
                      //ProductStore.load(_.get(val, "value", null));
                    }}
                  ></Select>
                </Field>

                <Field
                  initializeField={props}
                  label={"Kode Cabang"}
                  path={"code"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Kode cabang"
                    type={"text"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Telepon"}
                  path={"telpon"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Nomer telepon"
                    type={"text"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Alamat"}
                  path={"alamat"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Alamat cabang"
                    type={"multiline"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Kota"}
                  path={"kota"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Kota"
                    type={"text"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Provinsi"}
                  path={"provinsi"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Provinsi"
                    type={"text"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Negara"}
                  path={"negara"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Negara"
                    type={"text"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Catatan Struk"}
                  path={"catatan_struk"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    placeholder="Catatan Struk"
                    type={"multiline"}
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>




                {!!SessionStore.package.id && SessionStore.package.id > 2 &&
                  <>
                    {/* <Field
                      initializeField={props}
                      label={"Melayani Pembelian"}
                      path={"is_live"}
                      styles={{
                        label: {
                          fontFamily: Fonts.poppinsbold,
                          color: "#333333"
                        },
                        input: {
                          ...styles.field
                        },
                      }}

                    >
                      <Select
                        placeholder={"Select"}
                        items={[
                          {
                            name: "Ya",
                            value: 1
                          },
                          {
                            name: "Tidak",
                            value: 0
                          }
                        ]}
                        labelPath={"name"}
                        valuePath={"value"}
                        onChange={(val) => {
                          //ProductStore.load(_.get(val, "value", null));
                        }}
                      ></Select>
                    </Field>
                    <Field
                      initializeField={props}
                      label={"Latitude"}
                      path={"latitude"}
                      styles={{
                        label: {
                          fontFamily: Fonts.poppinsbold,
                          color: "#333333"
                        },
                        input: {
                          ...styles.field
                        },
                      }}

                    >
                      <TextInput
                        type={"text"}
                        style={{
                          textAlign: "left",
                          fontSize: 18,
                        }}
                      />
                    </Field>

                    <Field
                      initializeField={props}
                      label={"Longitude"}
                      path={"longitude"}
                      styles={{
                        label: {
                          fontFamily: Fonts.poppinsbold,
                          color: "#333333"
                        },
                        input: {
                          ...styles.field
                        },
                      }}

                    >
                      <TextInput
                        type={"text"}
                        style={{
                          textAlign: "left",
                          fontSize: 18,
                        }}
                      />
                    </Field>

                    <Field
                      initializeField={props}
                      label={"Info"}
                      path={"info"}
                      styles={{
                        label: {
                          fontFamily: Fonts.poppinsbold,
                          color: "#333333"
                        },
                        input: {
                          ...styles.field
                        },
                      }}

                    >
                      <TextInput
                        type={"text"}
                        style={{
                          textAlign: "left",
                          fontSize: 18,
                        }}
                      />
                    </Field> */}
                    {SessionStore.package.id != 6 &&
                      <>
                        <Text
                          style={{
                            fontFamily: Fonts.poppins,
                            marginVertical: 8,
                            color: colors.grey
                          }}
                        >
                          Jam Kerja
                        </Text>

                        <Text
                          style={{
                            fontFamily: Fonts.poppinsmedium,
                            marginVertical: 8,
                            color: colors.black
                          }}
                        >
                          Senin
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"mon_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"mon_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>

                        <Text style={{
                          color: "#333",
                          textAlign: "left",
                          fontFamily: Fonts.poppinsbold,
                          paddingVertical: 4
                        }}>
                          Selasa
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"tue_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"tue_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>

                        <Text style={{
                          color: "#333",
                          textAlign: "left",
                          fontFamily: Fonts.poppinsbold,
                          paddingVertical: 4
                        }}>
                          Rabu
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"wed_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"wed_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>

                        <Text style={{
                          color: "#333",
                          textAlign: "left",
                          fontFamily: Fonts.poppinsbold,
                          paddingVertical: 4
                        }}>
                          Kamis
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"thu_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"thu_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>

                        <Text style={{
                          color: "#333",
                          textAlign: "left",
                          fontFamily: Fonts.poppinsbold,
                          paddingVertical: 4
                        }}>
                          Jumat
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"fri_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"fri_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>

                        <Text style={{
                          color: "#333",
                          textAlign: "left",
                          fontFamily: Fonts.poppinsbold,
                          paddingVertical: 4
                        }}>
                          Sabtu
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"sat_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"sat_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>

                        <Text style={{
                          color: "#333",
                          textAlign: "left",
                          fontFamily: Fonts.poppinsbold,
                          paddingVertical: 4
                        }}>
                          Minggu
                        </Text>
                        <View style={{
                          flexDirection: "row"
                        }}>
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Buka"}
                            path={"sun_start"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>
                          <View
                            style={{
                              width: 8
                            }} />
                          <Field
                            initializeField={props}
                            hiddenLabel={true}
                            label={"Jam Tutup"}
                            path={"sun_end"}
                            styles={{
                              label: {
                                fontFamily: Fonts.poppinsbold,
                                color: "#333333"
                              },
                              input: {
                                ...styles.field
                              },
                            }}

                          >
                            <Select
                              placeholder={"Select"}
                              items={OutletStore.timeList}
                              labelPath={"label"}
                              valuePath={"value"}
                              onChange={(val) => {
                                //ProductStore.load(_.get(val, "value", null));
                              }}
                            ></Select>
                          </Field>

                        </View>
                      </>
                    }

                  </>

                }
              </ScrollView>

              {/* //// */}



            </>
          )}
        </Form>

      </View>
    </Screen>
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
  } else if (!!s && !!s.uri && !s.uri.includes(AppConfig.serverUrl)) {
    s.uri = AppConfig.serverUrl + s.uri;
  }
  console.log(JSON.stringify(s))

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
          <Icon name="image" source="Ionicons" size={60} color={"#ccc"} />
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
            disabled={!canSubmit || OutletStore.detail.saving}
          >
            <Text
              style={{
                color: Theme.colors.textLight,
                fontSize: 16,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              {OutletStore.detail.saving ? "Menyimpan..." : "Simpan Data"}
            </Text>
          </Button>
        </View>

      </View>
    </>
  );
});