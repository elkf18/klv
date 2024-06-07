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
  Image,
  Camera,

} from "libs/ui";
import DateTime from "../utils/DateTime";
import { useIsFocused, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import ProductStore, { ProductPrice } from "app/model/product";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { ITheme } from "libs/config/theme";
import SessionStore from "app/model/session";

import ProductCategoryStore from "app/model/product_category";
import ProductTypeStore from "app/model/product_type";

import { runInAction } from "mobx";

import AreaStore from "app/model/area";
import ContractStore from "app/model/contract";
import * as Yup from "yup";
import AppConfig from "libs/config/app";
import { StyleSheet } from "react-native";
import styles from "app/config/styles";
import colors from "app/config/colors";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  let { id }: any = route.params || {};
  const isFocus = useIsFocused()



  //   const refreshControl = (
  //     <RefreshControl
  //       refreshing={CustomerStore.loading}
  //       onRefresh={() => {
  //         CustomerStore.load();
  //       }}
  //     />
  //   );

  useEffect(() => {
    ProductStore.form.load(id, true)
    ProductCategoryStore.load();
    ProductTypeStore.load();
    // AreaStore.load();
    // ContractStore.load();
  }, [isFocus]);

  const handleSave = async () => {

    ProductStore.form.save().then((res) => {
      if (!!res) {
        ProductStore.load();

        nav.goBack();
      }
    });


  };

  return (
    <Screen
      style={{
        backgroundColor: "#fff"
      }}>
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await ProductStore.form.reset();
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
        {!ProductStore.form.id ? "Tambah Produk" : "Ubah data Produk"}
      </TopBar>



      <View style={{ flex: 1 }} >
        <Form
          values={ProductStore.form}
          onSubmit={handleSave}

          validationSchema={{
            name: Yup.string().required("Harus di isi."),
            code: Yup.string().required("Harus di isi."),
            unit_1: Yup.string().required("Harus di isi."),
            id_product_type: Yup.number().required("Harus di isi.").nullable(),
            id_category: Yup.number().required("Harus di isi.").nullable(),

            product_prices: Yup.array(
              Yup.object({
                valid_from: Yup.string().required("Wajib diisi."),

                price: Yup.string().required("Wajib diisi.")
              })
            ).min(1)
            // product_prices.valid_from: Yup.string().required("Harus di isi."),
            // product_prices.price: Yup.number().required("Harus di isi."),
          }}

          Submit={(handleSave, canSubmit) => (
            <RenderSubmit handleSubmit={handleSave} canSubmit={canSubmit} />
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
                  path="url_pic"
                  hiddenLabel
                  styles={{
                    input: {
                      width: 120,
                      height: 120,
                      borderRadius: 999,
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

                {SessionStore.package.id != 1 && SessionStore.package.id != 6 &&
                  <Field
                    initializeField={props}
                    label={"Tipe Produk *"}
                    path={"id_product_type"}
                    styles={{
                      label: {
                        fontFamily: Fonts.poppinsmedium,
                        color: "#333333",
                        fontSize: 14
                      },
                      input: {
                        ...styles.field
                      },
                    }}

                  >
                    <Select
                      placeholder={"Select"}
                      items={ProductTypeStore.getList}
                      labelPath={"type"}
                      valuePath={"id"}

                      onChange={(val) => {
                        //ProductStore.load(_.get(val, "value", null));
                      }}
                    ></Select>
                  </Field>
                }


                <Field
                  initializeField={props}
                  label={"Nama Produk *"}
                  path={"name"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333",
                      fontSize: 14
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    type={"text"}
                    placeholder="Nama Produk"
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Kode Produk *"}
                  path={"code"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333",
                      fontSize: 14
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    type={"text"}
                    placeholder="Kode Produk"
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>




                <Field
                  initializeField={props}
                  label={"Kategori Produk"}
                  path={"id_category"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333",
                      fontSize: 14
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <Select
                    placeholder={"Select"}
                    items={ProductCategoryStore.getList}
                    labelPath={"category"}
                    valuePath={"id"}
                    onChange={(val) => {
                      //ProductStore.load(_.get(val, "value", null));
                    }}
                  ></Select>
                </Field>

                <Field
                  initializeField={props}
                  label={"Satuan Produk *"}
                  path={"unit_1"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333",
                      fontSize: 14
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    type={"text"}
                    placeholder="Porsi"
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>

                <Field
                  initializeField={props}
                  label={"Deskripsi Produk"}
                  path={"description"}
                  styles={{
                    label: {
                      fontFamily: Fonts.poppinsmedium,
                      color: "#333333",
                      fontSize: 14
                    },
                    input: {
                      ...styles.field
                    },
                  }}

                >
                  <TextInput
                    type={"multiline"}
                    placeholder="Deskripsi Produk"
                    style={{
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  />
                </Field>


                {/* <DetailDivider
                style={{
                  marginLeft: -15,
                  marginRight: -15,
                  margin: 15,
                  backgroundColor: Theme.colors.secondary + "20",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                Harga Produk
              </DetailDivider> */}
                <Text
                  style={{
                    fontFamily: Fonts.poppins,
                    fontSize: 14,
                    marginHorizontal: -15,
                    marginBottom: 8,
                    paddingTop: 8,
                    paddingHorizontal: 15,
                    color: colors.grey,
                    borderTopWidth: 1,
                    borderColor: colors.cardBorder
                  }}
                >
                  Harga
                </Text>

                <View>
                  {ProductStore.form.product_prices
                    .map((item: ProductPrice, key: number) => {
                      return (
                        <DetailProduct
                          key={key}
                          index={key}
                          item={item}
                          initialize={props}
                        />
                      );
                    })}
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "stretch",
                      marginBottom: 30,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: "center",
                      }}
                    >

                    </View>

                    <Button
                      style={{
                        padding: 8,
                        margin: 0,
                        flexGrow: 1,
                        width: "100%",
                        alignSelf: "center",
                        ...styles.field
                      }}
                      onPress={() => {
                        ProductStore.form.addPrices();
                      }}
                    >
                      <Icon size={20} name={"ios-add"}
                        color={colors.textPrimary} />
                      <Text
                        style={{
                          color: colors.textPrimary
                        }}
                      >
                        Harga Baru
                      </Text>
                    </Button>
                  </View>
                </View>
              </ScrollView>
            </>
          )}

        </Form>

      </View>
      {ProductStore.form.saving && (
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


const DetailProduct = observer((props: any) => {
  const data = useLocalObservable(() => ({
    now: new Date()
  }))

  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const { index: key, item, initialize } = props;
  return (
    <View
      key={key}
      style={{
        flexDirection: "row",
        marginBottom: 10,
        flex: 1,
      }}
    >
      <View
        key={key}
        style={{
          padding: 10,
          backgroundColor: "white",
          flex: 1,
          borderRadius: 8,
          borderColor: "#ccc",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Field
            initializeField={initialize}
            label={"Belaku Mulai *"}
            path={`product_prices[${key}].valid_from`}

            style={{
              flexGrow: 1,
            }}
            styles={{
              label: {
                fontFamily: Fonts.RobotoBold,
                color: "#333333"
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

            <DateTime
              value={data.now.toString()}
              // format={"dd MMM yyyy"}
              type={"date"}
              onChange={(value) => {
                runInAction(() => {
                  data.now = value
                })
              }}
            ></DateTime>
          </Field>
          {ProductStore.form.product_prices.length > 1 && (
            <Button
              style={{
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: 46,
                paddingHorizontal: 10,
                marginTop: 20,
                marginLeft: 10,
                margin: 0,
                backgroundColor: Theme.colors.primary + "30",
              }}
              onPress={() => {
                ProductStore.form.deletePrices(key);
              }}
            >
              <Icon
                source={"Entypo"}
                name={"trash"}
                size={16}
                color={Theme.colors.primary}
              ></Icon>
            </Button>
          )}
        </View>

        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
            <Field
              initializeField={initialize}
              label={"Harga *"}
              path={`product_prices[${key}].price`}
              Prefix={
                <Text>
                  Rp
                </Text>
              }
              style={{ flexGrow: 1 }}
              styles={{
                label: {
                  fontFamily: Fonts.RobotoBold,
                  color: "#333333"
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
              <TextInput placeholder={"0"} type={"currency"}></TextInput>
            </Field>
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
          <Field
                    initializeField={initialize}
                    label={"Area"}
                    path={`product_prices[${key}].id_area`}
                  >
                    <Select
                  placeholder={"Select"}
                  items={AreaStore.getList}
                  labelPath={"name"}
                  valuePath={"id"}
                ></Select>
          </Field>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
          <Field
                    initializeField={initialize}
                    label={"Nomor Kontrak"}
                    path={`product_prices[${key}].id_contract`}
                  >
                    <Select
                  placeholder={"Select"}
                  items={ContractStore.getList}
                  labelPath={"contract_number"}
                  valuePath={"id"}
                ></Select>
          </Field>
          </View> */}


          <View
            style={{
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
            {/* <Field
                    initializeField={initialize}
                    label={"Status"}
                    path={`product_prices[${key}].status`}
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
                    <Select
                  placeholder={"Select"}
                  items={ProductStore.getStatus}
                  labelPath={"label"}
                  valuePath={"value"}
                    
                ></Select>
          </Field> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >

          </View>
        </>
      </View>
    </View>
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
            disabled={!canSubmit || ProductStore.form.saving}
          >
            <Text
              style={{
                color: Theme.colors.textLight,
                fontSize: 16,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              {ProductStore.form.saving ? "Menyimpan..." : "Simpan"}
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
  let s = source;
  //console.log(JSON.stringify(source))
  if (!!s && !!s.uri && s.uri.includes("file://")) {
    s.uri = s.uri;
  } else if (!!s && !!s.uri && s.uri === ProductStore.detail.url_pic) {
    s.uri = AppConfig.serverUrl + s.uri;
  }else{
    s=null;
  }

  return (
    <>
      <View
        style={{
          alignItems: "center",
          width: 120,
          height: 120,
          overflow: "hidden",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 10,
          backgroundColor: "white",
          borderColor: "#ddd",
        }}
      >
        {!s && (
          <Text
            style={{
              fontFamily: Fonts.poppinsbold,
              color: "#AAAAAA",
              fontSize: 48,
              paddingTop: 3,
              position: "absolute"
            }}
          > {!!ProductStore.form.name.charAt(0) ? ProductStore.form.name.charAt(0) : "A"} </Text>
        )}
        {!!s && (
          <Image source={s} resizeMode="cover" style={cstyle} />
        )}

      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: -10,
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