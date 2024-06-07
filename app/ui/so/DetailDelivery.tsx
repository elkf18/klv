import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import DeliveryStore from "app/model/delivery";
import PaymentStore from "app/model/payment";
import SalesStore from "app/model/sales";
import DetailDivider from "app/ui/utils/DetailDivider";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { Button, Icon, Modal, Screen, ScrollView, TopBar, View } from "libs/ui";
import { dateFormat } from "libs/utils/date";
import { moneyFormat } from "libs/utils/string-format";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions, Text } from "react-native";
import CustomSpinner from "../utils/CustomSpinner";
import FormInvoice from "./FormInvoice";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  let { id, sales_order }: any = route.params || {};
  const isFocused = useIsFocused();

  const handlePay = async () => {
    let res = PaymentStore.detail.save();
    if (!!res) {
      nav.goBack();
    }
  };

  useEffect(() => {
    runInAction(() => (DeliveryStore.isPrint = false));
    DeliveryStore.detail.load(id, sales_order);

    return () => {
      DeliveryStore.detail.init();
    };
  }, [isFocused]);

  const detailDeliver = DeliveryStore.detail;

  return (
    <Screen>
      <TopBar
        backButton
        actionBackButton={() => {
          nav.goBack();
        }}
        rightAction={
          !!DeliveryStore.detail.loading ? (
            <CustomSpinner loading={DeliveryStore.detail.loading} />
          ) : (
            <>
              <Button
                style={{
                  padding: 0,
                  margin: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  minWidth: 44,
                  backgroundColor: "rgba(256,256,256,0.5)",
                  marginRight: 10,
                }}
                disabled={DeliveryStore.isPrint}
                onPress={async () => {
                  DeliveryStore.print(id);
                }}
              >
                <Icon name={"md-print"} color={"white"} />
              </Button>
              {Number(PaymentStore.detail.total_paid) === 0 && (
                <Button
                  style={{
                    padding: 0,
                    margin: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    minWidth: 44,
                    backgroundColor: "rgba(256,256,256,0.5)",
                  }}
                  onPress={() => {
                    nav.navigate("user/so/FormDelivery", {
                      id: detailDeliver.id,
                      sales_order: detailDeliver.id_sales_order,
                    });
                  }}
                >
                  <Icon name={"ios-create"} color={"white"} />
                </Button>
              )}
            </>
          )
        }
        styles={{
          title:{
            paddingTop:3
          }
        }}
      >
        Detail Pengiriman
      </TopBar>
      <DetailComponent />
      <ModalInvoice handleSave={handlePay} />
    </Screen>
  );
});

const ModalInvoice = observer((props: any) => {
  const { handleSave } = props;
  return (
    <Modal
      visible={SalesStore.detail.openPayment}
      onDismiss={action(() => {
        SalesStore.detail.openPayment = false;
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
              id_delivery: DeliveryStore.detail.id,
              total_payment: DeliveryStore.detail.grand_total,
              grand_total: DeliveryStore.detail.grand_total,
            }}
            onBack={action(() => {
              SalesStore.detail.openPayment = !SalesStore.detail.openPayment;
            })}
            handleSave={handleSave}
          />
        </View>
      </View>
    </Modal>
  );
});

const DetailComponent = observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const summary = PaymentStore.detail;
  const detailso = DeliveryStore.detail;
  const product_items = DeliveryStore.detail.items;
  return (
    <ScrollView>
      <View
        style={{
          padding: 15,
        }}
      >
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            #{detailso.invoice_code}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Tanggal Pengiriman :
          </Text>
          <Text>{dateFormat(detailso.deliver_date, "dd MMMM yyyy")}</Text>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Sub Total :
          </Text>
          <Text>{moneyFormat(detailso.sub_total || 0, "Rp. ")}</Text>
        </View>

        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Diskon :
          </Text>
          <Text>{moneyFormat(detailso.amount_discount || 0, "Rp. ")}</Text>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            PPN :
          </Text>
          <Text>{moneyFormat(detailso.amount_ppn || 0, "Rp. ")}</Text>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Grand Total :
          </Text>
          <Text>{moneyFormat(detailso.grand_total || 0, "Rp. ")}</Text>
        </View>
      </View>
      <DetailDivider>Summary</DetailDivider>
      <View
        style={{
          padding: 15,
        }}
      >
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Total Pembayaran :
          </Text>
          <Text>{moneyFormat(summary.total_paid || 0, "Rp. ")}</Text>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Kekurangan :
          </Text>
          <Text>{moneyFormat(summary.total_unpaid || 0, "Rp. ")}</Text>
        </View>
        {Number(summary.total_unpaid) > 0 && (
          <Button
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
            // disabled={meta.saving}
            // onPress={() => {
            //   meta.invoice.total_payment = Number(summary.total_unpaid);
            //   meta.invoice.grand_total = Number(summary.total_unpaid);
            //   meta.openInvoice = true;
            // }}
            onPress={action(() => {
              SalesStore.detail.openPayment = true;
            })}
          >
            <Icon
              name={"ios-cash"}
              size={20}
              color={"#ffffff"}
              style={{
                marginRight: 5,
              }}
            ></Icon>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              Bayar
            </Text>
          </Button>
        )}
      </View>
      <DetailDivider>Daftar Produk</DetailDivider>
      <View>
        {!DeliveryStore.detail.loading && product_items.length === 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              source={"Ionicons"}
              name={"ios-alert"}
              size={18}
              color={"#505052"}
              style={{
                margin: 5,
              }}
            ></Icon>
            <Text
              style={{
                color: "#505052",
                lineHeight: 100,
              }}
            >
              Data is empty
            </Text>
          </View>
        )}
        <View
          style={{
            padding: 15,
          }}
        >
          {product_items.map((item: any, key: number) => {
            return (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  flex: 1,
                  marginBottom: 10,
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
                      flexGrow: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: Fonts.NunitoBold,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text>Qty: {item.qty}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
});
