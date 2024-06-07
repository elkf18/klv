import Fonts from "libs/assets/fonts";

import {
  Button,

  Field,
  Form,
  Icon,
  TextInput,
  Modal,
  Screen,
  ScrollView,
  Select,
  Text,
  TopBar,
  View,
  BarCodeScanner,
} from "libs/ui";
import DateTime from "../utils/DateTime";
import { useIsFocused, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import ProductStore from "app/model/product";
import SalesStore from "app/model/sales";
import DetailDivider from "app/ui/utils/DetailDivider";
import { action, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ToastAndroid } from "react-native";
import Loading from "../utils/Loading";
import DetailHeaderSO from "./DetailHeaderSO";
import DetailItemProduct from "./DetailItemProduct";
import FormInvoice from "./FormInvoice";
import { ITheme } from "libs/config/theme";
import * as Yup from "yup";
import ModalProduct from "./ModalProduct";
import PaymentMethodStore from "app/model/payment_method";
import PromoStore from "app/model/promo";
import AdditionalField from "../utils/AdditionalField";
import styles from "app/config/styles";
import colors from "app/config/colors";
import { moneyFormat } from "libs/utils/string-format";
import { Data } from "app/model/notification";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  let { id,id_customer, id_product }: any = route.params || {};

  const Theme: ITheme = useTheme() as any;
  const isFocus = useIsFocused()
  

  let couldSubmit:any = false
  const meta = useLocalObservable(() => ({
    visible: false,
    couldSubmit:couldSubmit,
  }));

  useEffect(() => {
    SalesStore.form.initForm()

    ProductStore.loadCategory()
    PaymentMethodStore.reload();
    PromoStore.reload();
    if (!!id) {
      //SalesStore.form.init()
      SalesStore.form.load(id, true);
    }
    if(!!id_customer){
      SalesStore.form.id_customer = id_customer
    }
    if(!!id_product){

      SalesStore.form.addProductById(id_product);
    }
  }, [isFocus]);

  const handleSave = async () => {
    SalesStore.form.save().then((res) => {
      if (!!res) {
        SalesStore.load();
        nav.goBack();
        SalesStore.form.init();
      }
    });
  };

  const handleSaveAndPay = async () => {
    SalesStore.form.saveAndPay().then((res) => {
      if (!!res) {
        SalesStore.load();
        nav.goBack();
        SalesStore.form.init();
      }
    });
  };
  //One Time Customer
  const changeable = (CustomerStore.detail.name)

  const handleBarcodeData = (barcodeProps: any) => {
    for (const data of CustomerStore.list) {
      if(barcodeProps.data === data.phone1) {
        SalesStore.form.id_customer = data.id;
      }
    }
  }

  const barcodeComponentProps = () => {
    return(
      <>
        <Icon 
          source={"AntDesign"}
          name={"qrcode"}
          size={20}
          color={colors.textPrimary}
        />
        <Text style={{
            color: colors.textPrimary
        }}>
          Scan QR code
        </Text>
      </>
    )
  }

  return (
    <Screen
      style={{
        backgroundColor: "#fff",
      }}
      statusBar={{
        barStyle: "dark-content",
      backgroundColor: "transparent",

      }}
      >
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await SalesStore.form.reset();
          if (res !== null) {
            nav.goBack();
          }
        }}
        // rightAction={<CustomSpinner loading={SalesStore.form.loading} />}
        style={{
          backgroundColor:"white"
        }}
        styles={{
          title: {
            paddingTop: 3,
            color:colors.black,
          },
        
        }}
      >
        {!id ? "Tambah Penjualan" : "Ubah data Penjualan"}
      </TopBar>
      <Loading loading={SalesStore.form.loading} />
      <ScrollView
      style={{
        paddingBottom:200
      }}
      >
        <View
          style={{
            padding: 15,
          }}
        >
          <Form
            values={SalesStore.form}
            onSubmit={handleSave}
            validationSchema={{
              id_customer: Yup.string().nullable().required("Harus di isi."),
              sales_order_date: Yup.string().required("Harus di isi."),
              // ppn: Yup.string().required("Harus di isi."),
              t_sales_order_lines: Yup.array().of(
                Yup.object().shape({
                  id_product: Yup.string().nullable().required("Harus di isi."),
                  price: Yup.number().required("Harus di isi."),
                  qty: Yup.number()
                    .required("Harus di isi.")
                    .min(1, "Kuantitas minimum 1."),
                })
              ),
            }}
            
            Submit={(handleSubmit, canSubmit) => 
              
              <>
              {meta.couldSubmit=canSubmit}
              </>
              
              //  <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
              
            }
            
          // onError={(fields) => {
          //   let error = fields.map((f) => f.label);
          //   Alert.alert(
          //     "Terjadi Kesalahan",
          //     `Mohon Anda lengkapi dahulu kolom ${error.join(", ")}.`
          //   );
          // }}
          >
            {(props) => (
              <>
                <Field
                  initializeField={props}
                  label={"Pelanggan *"}
                  path={"id_customer"}
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
                    items={CustomerStore.list}
                    labelPath={"name"}
                    valuePath={"id"}
                    onChange={changeable?() => {
                      SalesStore.form.t_sales_order_lines = []
                      ProductStore.loadCategory(SalesStore.form.id_customer!!)
                      SalesStore.tempForm.init()
                      SalesStore.form.sub_total = 0
                      SalesStore.tempForm.t_sales_order_lines = SalesStore.form.t_sales_order_lines
                      SalesStore.tempForm.sub_total = SalesStore.form.sub_total
                    }:undefined}
                  ></Select>
                </Field>

                {/* <BarCodeScanner 
                styles={{button: {
                    ...styles.field,
                    margin: 0,
                    flexGrow: 1,
                    padding: 8,
                    width: "100%",
                    alignSelf: "center",
                }}}
                children={barcodeComponentProps()}
                handleBarcodeData={handleBarcodeData}
                /> */}

                <Text
                  style={{
                    fontFamily: Fonts.poppinsmedium,
                    marginVertical: 15,
                  }}
                >
                  Daftar Produk *
                </Text>
                {SalesStore.form.t_sales_order_lines.map(
                  (item: any, key: number) => {
                    return (
                      <DetailProduct
                        key={key}
                        index={key}
                        item={item}
                        initializeField={props}
                      />
                    );
                  }
                )}
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
                      // SalesStore.form.addProduct();
                      runInAction(() => {
                        SalesStore.tempForm = SalesStore.form
                        meta.visible = true;
                      });
                    }}
                  >
                    <Icon size={20} name={"ios-add"}
                      color={colors.textPrimary} />
                    <Text
                      style={{
                        color: colors.textPrimary
                      }}
                    >
                      Tambah Produk
                    </Text>
                  </Button>
                </View>
                {/* <DetailHeaderSO state={SalesStore.form} /> */}


                {
                  SalesStore.form.additional_data.length > 0 &&
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
                      SalesStore.form.additional_data.map(
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
              </>
            )}
          </Form>
        </View>
      </ScrollView>
      <RenderSubmit handleSubmit={handleSave} canSubmit={meta.couldSubmit} 
      />
      <ModalInvoice handleSave={handleSaveAndPay} />
      <ModalProduct meta={meta} />
    </Screen>
  );
});

function useForceUpdate() {

  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const DetailProduct = observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const { index: key, item, initializeField } = props;

  const forceUpdate = useForceUpdate();
  const check = () => {
    if (key == -1) {
      SalesStore.form.changeToNumber(key);
      SalesStore.form.calculate(key);
    } else {
      SalesStore.form.changeToNumber(key);
      SalesStore.form.calculate(key);
    }
    forceUpdate()
  };

  const minus = () => {

    runInAction(() => {
      SalesStore.form.t_sales_order_lines[key].qty -= 1;
    })

    if (SalesStore.form.t_sales_order_lines[key].qty <= 0) {
      SalesStore.form.deleteProduct(key);
    } else {
      runInAction(
        () => (SalesStore.form.t_sales_order_lines[key] = SalesStore.form.t_sales_order_lines[key])
      );
    }
    check();
  };
  const plus = () => {

    if (key > -1) {
      runInAction(() => {
        SalesStore.form.t_sales_order_lines[key].qty += 1;
      })
      runInAction(
        () => (SalesStore.form.t_sales_order_lines[key] = SalesStore.form.t_sales_order_lines[key])
      );

    }

    check();
  };


  const onChange = (e: any) => {

    const value = Number(e.nativeEvent.text);
    ToastAndroid.show(String(key), ToastAndroid.SHORT)

    runInAction(
      () => {
        SalesStore.form.t_sales_order_lines[key].qty = value
      }
    );


    check();
  };

  return (
    <View
      key={key}
      style={{
        flexDirection: "row",
        marginBottom: 10,
        flex:1
        
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

          <View
            style={{
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "space-between",
              flex:1
            }}
          >
            <Text style={{
              fontFamily: Fonts.poppinsmedium,
              color: colors.black,
              fontSize: 16
            }}>
              {SalesStore.form.t_sales_order_lines[key].product_name}
            </Text>
            <Text style={{
              fontFamily: Fonts.poppinsmedium,
              color: colors.grey,
              fontSize: 16
            }}>
              {moneyFormat(SalesStore.form.t_sales_order_lines[key].price || 0, "Rp. ")}
            </Text>
          </View>
          <Text style={{
            fontFamily: Fonts.poppinsmedium,
            color: colors.textPrimary,
            fontSize: 16
          }}>
            {moneyFormat(SalesStore.form.t_sales_order_lines[key].total || 0, "Rp. ")}
          </Text>


        </View>
        <View style={{
          flexGrow: 1,
          height: 1,
          backgroundColor: "#cccccc",
          marginVertical: 10

        }} />
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button
            style={{
              paddingHorizontal: 5,
              paddingVertical: 0,
              margin: 0,
              height: 35,
              backgroundColor: "transparent"
            }}

            onPress={() => {
              SalesStore.form.deleteProduct(key);
            }}
          >
            <Icon name="trash-bin" color="black" />
          </Button>
          <View style={{ flexGrow: 1 }} />

          <Button
            style={{
              paddingHorizontal: 5,
              paddingVertical: 0,
              margin: 0,
              height: 35,
              borderRadius: 4,
            }}

            onPress={minus}
          >
            <Icon name="remove" color="white" />
          </Button>
          <RenderInput onChange={onChange} selected={key} />
          <Button
            style={{
              paddingHorizontal: 5,
              paddingVertical: 0,
              margin: 0,
              height: 35,
              borderRadius: 4,
            }}
            onPress={plus}
          >
            <Icon name="add" color="white" />
          </Button>
        </View>

      </View>
    </View>
  );
});


const RenderInput = observer((props: any) => {
  const { selected, onChange, item } = props;

  return (
    <View>
      <TextInput
        type={"decimal"}
        value={String(
          SalesStore.form.t_sales_order_lines[selected].qty || 0
        )}
        onChange={onChange}
        style={{
          height: 35,
          width: 35,
          borderWidth: 1,
          borderColor: colors.textPrimary,
          textAlign: "center",
          marginHorizontal: 5,
          borderRadius: 4,
          color: colors.textPrimary,
        }}
      />
    </View>
  );
});

const ModalInvoice = observer((props: any) => {
  const { handleSave } = props;
  return (
    <Modal
      visible={SalesStore.form.openPayment}
      onDismiss={() => {
        runInAction(() => (SalesStore.form.openPayment = false));
      }}
    >
      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.3)",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <FormInvoice
            data={{
              total_payment: SalesStore.form.sub_total,
              grand_total: SalesStore.form.sub_total,
            }}
            onBack={() => {
              runInAction(
                () =>
                (SalesStore.form.openPayment = !SalesStore.form
                  .openPayment)
              );
            }}
            handleSave={handleSave}
          />
        </View>
      </View>
    </Modal>
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
          
          flex:1,
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 10,
          position:"absolute",
          bottom:0,
          zIndex:20,
          borderTopColor:"#cccccc",
          borderTopWidth:1,
          backgroundColor:"#ffffff",
          
          right:0,
           
          width:"100%"
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
          <Text
            style={{
              color: colors.textBlack,
              fontSize: 16,
            }}
          >
            Subtotal:
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.poppinsmedium,
              color: colors.textPrimary
            }}
          >
            {moneyFormat(SalesStore.form.sub_total || 0, "Rp. ")}
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          flex: 1,
          flexGrow: 1,
          marginTop: 16

        }}>
          {(SalesStore.form.t_sales_order_lines.length) > 0 && (
          <Button
            style={{
              margin: 0,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              flexGrow: 1,
              flexBasis: 0,
              borderWidth: 1,
              borderColor: colors.primary,
              backgroundColor: "white"
            }}
            onPress={handleSubmit}
            disabled={!canSubmit || SalesStore.form.saving}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontFamily: Fonts.poppinsbold,
              }}
            >
              {SalesStore.form.saving ? "Menyimpan..." : "Simpan"}
            </Text>
          </Button>)}
          {(SalesStore.form.sub_total - SalesStore.form.total_payment) > 0 && (
            <Button
              style={{
                margin: 0,
                paddingVertical: 12,
                flexGrow: 1,
                flexBasis: 0,
                marginStart: 16,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: colors.primary,
              }}
              disabled={!canSubmit || SalesStore.form.saving}
              onPress={action(() => {
                SalesStore.form.openPayment = true;
              })}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: Fonts.poppinsbold,
                }}
              >
                Simpan {"&"} Bayar
              </Text>
            </Button>
          )}
        </View>

      </View>




    </>
  );
});
