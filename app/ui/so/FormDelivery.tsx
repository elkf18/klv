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
} from "libs/ui";
import DateTime from "../utils/DateTime";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import SalesAPI from "app/api/so";
import DeliveryStore from "app/model/delivery";
import GlobalStore from "app/model/global";
import SalesStore from "app/model/sales";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Alert, Dimensions } from "react-native";
import DetailDivider from "../utils/DetailDivider";
import Loading from "../utils/Loading";
import FormInvoice from "./FormInvoice";
import { ITheme } from "libs/config/theme";
import * as Yup from "yup";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  let { id, sales_order }: any = route.params || {};

  useEffect(() => {
    DeliveryStore.detail.load(id, sales_order, true);
    
  }, []);

  const handleSave = async () => {
    await DeliveryStore.detail.save().then((res) => {
      if (!!res) {
        nav.goBack();
      }
    });
  };

  const handleSaveAndPay = async () => {
    SalesStore.form.saveAndPay().then(async (res) => {
      if (!!res) {
        if (!!GlobalStore.connectedDV) {
          const print = async () => {
            let data = await SalesAPI.getReceipt(id);
          };
          await Alert.alert(
            "Cetak",
            "Apakah anda ingin mencetak bukti pembayaran?",
            [
              {
                text: "Tidak",
              },
              {
                text: "Iya",
                onPress: print,
              },
            ]
          );
        }
        SalesStore.load();
        nav.goBack();
      }
    });
  };

  return (
    <Screen>
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await DeliveryStore.detail.reset();
          if (res !== null) {
            nav.goBack();
          }
        }}
        styles={{
          title:{
            paddingTop:3
          }
        }}
        // rightAction={<CustomSpinner loading={DeliveryStore.detail.loading} />}
      >
        {!id ? "Tambah Pengiriman" : "Ubah data Pengiriman"}
      </TopBar>
      <Loading loading={DeliveryStore.detail.loading} />
      <ScrollView>
        <View
          style={{
            padding: 15,
          }}
        >
          <Form
            values={DeliveryStore.detail}
            onSubmit={handleSave}
            validationSchema={{
              deliver_date: Yup.string().required("Harus di isi."),
              items: Yup.array().of(
                Yup.object().shape({
                  qty: Yup.number()
                    .required("Harus di isi.")
                    .min(1, "Kuantitas minimum 1."),
                })
              ),
            }}
            Submit={(handleSubmit, canSubmit) => (
              <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
            )}
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
                  label={"Tanggal Pengiriman *"}
                  path={"deliver_date"}
                >
                  <DateTime minimumDate={new Date()}></DateTime>
                </Field>
                <View>
                  <DetailDivider
                    style={{
                      marginLeft: -15,
                      marginRight: -15,
                      margin: 15,
                      backgroundColor: "#dfe6ec",
                    }}
                  >
                    Daftar Produk
                  </DetailDivider>
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                      top: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      style={{
                        backgroundColor: "#4caf50",
                        height: 35,
                      }}
                      styles={{
                        label: {
                          color: "#fff",
                        },
                        labelWrapper: {
                          width: 130,
                        },
                        icon: {
                          color: "#fff",
                        },
                      }}
                      placeholder={"Pilih Produk"}
                      items={DeliveryStore.detail.getProductUndeliver}
                      labelPath={"name"}
                      valuePath={"id"}
                      onChange={(item) => {
                        DeliveryStore.detail.addItem(item.selected);
                      }}
                      // customProps={{
                      //   icon: {
                      //     color: "white",
                      //   },
                      // }}
                      // value={0}
                    ></Select>
                  </View>
                </View>
                {DeliveryStore.detail.items.map((item: any, key: number) => {
                  return (
                    <Product
                      key={key}
                      index={key}
                      item={item}
                      initializeField={props}
                    />
                  );
                })}
              </>
            )}
          </Form>
        </View>
      </ScrollView>
      <ModalInvoice handleSave={handleSaveAndPay} />
    </Screen>
  );
});

const Product = observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const { index: key, item, initializeField } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 10,
        flex: 1,
      }}
    >
      <View
        shadow
        style={{
          width: 35,
          height: 35,
          borderRadius: 99,
          backgroundColor: Theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: Fonts.Nunito,
          }}
        >
          {key + 1}
        </Text>
      </View>
      <View
        style={{
          padding: 10,
          backgroundColor: "white",
          flex: 1,
          borderRadius: 8,
          borderColor: "#ccc",
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.NunitoBold,
            marginBottom: 10,
            fontSize: 18,
          }}
        >
          {!!item.group_name ? item.group_name + " - " : ""}
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Field
            initializeField={initializeField}
            label={"Qty *"}
            path={`items[${key}].qty`}
            style={{ flexGrow: 1 }}
            onChange={(value) => {
              DeliveryStore.detail.checkQty(key, value);
            }}
          >
            <TextInput type={"decimal"}></TextInput>
          </Field>
          {DeliveryStore.detail.items.length > 1 && (
            <Button
              style={{
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Theme.colors.primary + "30",
                marginTop: 12,
                height: 48,
                width: 48,
              }}
              onPress={action(() => {
                DeliveryStore.detail.items.splice(key, 1);
              })}
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
      </View>
    </View>
  );
});

const ModalInvoice = observer((props: any) => {
  const { handleSave } = props;
  return (
    <Modal
      visible={SalesStore.form.openPayment}
      onDismiss={action(() => {
        SalesStore.form.openPayment = false;
      })}
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
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
          }}
        >
          <FormInvoice
            values={{
              id_delivery: SalesStore.form.id,
              total_payment: SalesStore.form.grand_total,
              grand_total: SalesStore.form.grand_total,
            }}
            onBack={action(() => {
              SalesStore.form.openPayment = !SalesStore.form.openPayment;
            })}
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
    <Button
      style={{
        margin: 0,
        marginTop: 15,
        paddingVertical: 12,
      }}
      onPress={handleSubmit}
      disabled={!canSubmit || DeliveryStore.detail.saving}
    >
      <Text
        style={{
          color: Theme.colors.textLight,
          fontSize: 16,
          fontFamily: Fonts.NunitoBold,
        }}
      >
        {DeliveryStore.detail.saving ? "Menyimpan..." : "Simpan"}
      </Text>
    </Button>
  );
});
