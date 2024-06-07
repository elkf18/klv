import Fonts from "libs/assets/fonts";

import { Button, Icon, Screen, ScrollView, View, Text } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import SalesStore from "app/model/sales";
import DetailDivider from "app/ui/utils/DetailDivider";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import DetailTopBar from "../utils/DetailTopBar";
import ListDelivery from "./ListDelivery";
import { ITheme } from "libs/config/theme";
import DetailItem from "../utils/DetailItemHorizontal";
import DeliveryStore from "app/model/delivery";
import SessionStore from "app/model/session";
import OutletStore from "app/model/outlet";
import { dateFormat } from "libs/utils/date";
import fonts from "app/assets/fonts";
import colors from "app/config/colors";
import DetailItemStretch from "../utils/DetailItemStretch";



export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  let { id }: any = route.params || {};
  const detailso = SalesStore.detail;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!detailso.tab) runInAction(() => (SalesStore.detail.tab = "penjualan"));
    // SalesStore.detail.init();
    SalesStore.detail.load(id);

    return () => {
      SalesStore.detail.init();
    };
  }, [isFocused]);

  const tabs = [
    {
      title: "Penjualan",
      value: "penjualan",
    },
    {
      title: "Pengiriman",
      value: "pengiriman",
    },
  ];



  // {!!SessionStore.user.id_outlet && 
  const editable = detailso.grand_total - detailso.total_payment > 0 && detailso.status !== "cancelled" && !!SessionStore.user.id_outlet;
  //detailso.sub_total - detailso.total_payment > 0 && detailso.status!=="cancelled" && !!SessionStore.user.id_outlet;
  //detailso.status!=="paid" && detailso.status!=="cancelled" && !!SessionStore.user.id_outlet;
  const printable = detailso.sub_total - detailso.total_payment <= 0 && detailso.status !== "cancelled";

  const deleteable = detailso.total_payment === 0 && detailso.status !== "cancelled" && !!SessionStore.user.id_outlet

  return (
    <Screen
      style={{
        backgroundColor: "#fff"
      }}>
      <DetailTopBar
        title="Detail Penjualan"
        loading={SalesStore.detail.loading}
        onEdit={
          editable
            ? () => {
              nav.navigate("user/so/Form", {
                id: detailso.id,
              });
            }
            : undefined
        }

        onDelete={
          deleteable
            ? () => {
              if (SalesStore.detail.delete()) {
                nav.goBack();
              }
            } : undefined
        }

        onPrint={
          printable ?
            async () => {
              OutletStore.detail.load(SessionStore.user.id_outlet);
              SessionStore.loadClientInfo()
              SalesStore.print(SalesStore.detail.id);
            } : undefined
        }
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 10
        }}
      >
        {/* {tabs.map((t, i) => (
          <Button
            key={i}
            style={{
              flex: 1,
              borderRadius: 10,
              margin: 0,
              paddingVertical: 15,
              marginHorizontal:10,
              backgroundColor:
                detailso.tab === t.value
                  ? "#1ACBDA33"
                  : "#fff",
              borderWidth:1,
              borderColor:
                detailso.tab === t.value
                  ? "#1ACBDA"
                  : "#cccccc", 
            }}
            onPress={action(() => {
              detailso.tab = t.value;
            })}
          >
            <Text
              style={{
                color: detailso.tab === t.value
                ? "#000"
                : "#000",
              }}
            >
              {t.title}
            </Text>
          </Button>
        ))} */}
      </View>

      {
        ({
          penjualan: <DetailComponent sales_order={id}/>,
          pengiriman: <ListDelivery sales_order={id} />,
        } as any)[detailso.tab]
      }
    </Screen>
  );
});

const DetailComponent = observer((props:any) => {
  const { sales_order } = props;
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const detailso = SalesStore.detail;

  const nav = useNavigation();
  const printable = detailso.sub_total - detailso.total_payment <= 0;
  const pallete = {
    "status": {
      "cancelled": "#808080",
      "paid": "#008FCC",
      "submitted": "#FF7A00",
      "complete": "#408042"

    }
  }
  return (
    <ScrollView>
      <View
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 15,
        }}
      >


        <View
          style={{
            // marginBottom: 10,
          }}
        >
          {/* <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            No. PO :
          </Text>
          <Text>{detailso.purchase_order_number || "-"}</Text> */}

          {/* <DetailItem label={"No. PO"} value={detailso.purchase_order_number || "-"} /> */}

        </View>
        <View
          style={{
            // marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.poppinsmedium,
                fontSize: 14,
                flexGrow: 1
              }}>
              Dibuat Oleh: {detailso.fullname}
            </Text>
            {printable &&
              <Button
                style={{
                  padding: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  backgroundColor: "transparent"
                }}

                onPress={async () => {
                  OutletStore.detail.load(SessionStore.user.id_outlet);
                  SessionStore.loadClientInfo()
                  SalesStore.print(SalesStore.detail.id);
                }}>
                <Icon name="print" />

              </Button>
            }
          </View>
          <Text
            style={{
              fontFamily: Fonts.poppins,
              fontSize: 14,
              color: "#808080",
              marginTop: 4
            }}>
            {dateFormat(detailso.sales_order_date)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4


            }}>
            <Icon name="info" source="Feather" />
            <Text
              style={{
                fontFamily: Fonts.poppins,
                fontSize: 14,
                color: pallete["status"][detailso.status],
                textAlignVertical: "center",
                marginLeft: 4
              }}>
              {detailso.status}
            </Text>
            <View
            style={{
              flexGrow:1
            }}/>
            {detailso.status!="cancelled" &&
            <Button
            style={{
              borderWidth:1,
              backgroundColor:"#fff",
              borderColor:colors.black
            }}
            onPress={async ()=>{
              let confirm = await new Promise((resolve) => {
                Alert.alert("Batalkan Penjualan", "Apakah Anda yakin?", [
                  {
                    text: "Cancel",
                    onPress: () => resolve(false),
                  },
                  {
                    text: "OK",
                    onPress: () => resolve(true),
                  },
                ]);
              });
              if (confirm) {
                SalesStore.detail.loading=true
                SalesStore.detail.status = "cancelled"
                SalesStore.detail.save().then((res) => {
                  if (!!res) {
                    SalesStore.load()
                    nav.goBack();

                    SalesStore.detail.loading=false
                  }
                });
              }

              
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins,
                color:colors.black,
                fontSize: 14,
                alignSelf:"flex-end",
              }}>
              Batalkan
            </Text>
            </Button>
            }

          </View>

          <View
            style={{
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}>
            <DetailItem label={"No. SO"} value={detailso.sales_order_number || "-"} />
            <DetailItem label={"Nama Pelanggan"} value={detailso.customer_name || "-"} last={true} />
          </View>

          <Text
            style={{
              fontFamily: Fonts.poppins,
              fontSize: 14,
              color: "#808080",
              marginTop: 4
            }}>
            Pembayaran
          </Text>


          <View
            style={{
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}>
            <DetailItem label={"Metode Pembayaran"} value={detailso.payment_method || "-"} />
            <View
              style={{
                marginHorizontal: -10,
                paddingHorizontal: 10,

              }}
            >
              <DetailItemStretch label={"Sub total"} value={moneyFormat(detailso.sub_total, "Rp. ") || "-"} />
              <DetailItemStretch label={"Disc"} value={moneyFormat(detailso.amount_discount, "Rp. ") || "-"} />
              <DetailItemStretch label={"Total"} value={moneyFormat(detailso.grand_total, "Rp. ") || "-"} bold={true} />

            </View>

          </View>

        </View>
      </View>


      {/* <DetailDivider>Summary</DetailDivider> */}
      {/* <Text
          style={{
            fontFamily:Fonts.poppinsbold,
            marginBottom:10,
            paddingLeft: 15,
          }}
        >
        Summary
        </Text> */}
      <View
        style={{
          // padding: 15,
        }}
      >
        <View
          style={{
            // marginBottom: 10,
          }}
        >
          {/* <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Total Penjualan :
          </Text>
          <Text>{moneyFormat(detailso.grand_total || 0, "Rp. ")}</Text> */}
          {/* <DetailItem label={"Total Penjualan"} value={moneyFormat(detailso.grand_total || 0, "Rp. ")} /> */}
        </View>
        <View
          style={{
            // marginBottom: 10,
          }}
        >
          {/* <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Total Pembayaran :
          </Text>
          <Text>{moneyFormat(detailso.total_payment || 0, "Rp. ")}</Text> */}
          {/* <DetailItem label={"Total Pembayaran"} value={moneyFormat(detailso.total_payment || 0, "Rp. ")} /> */}
        </View>
        <View
          style={{
            // marginBottom: 10,
          }}
        >
          {/* <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
            }}
          >
            Sisa Tagihan :
          </Text>
          <Text>
            {moneyFormat(
              detailso.grand_total - detailso.total_payment || 0,
              "Rp. "
            )}
          </Text> */}
          {/* <DetailItem label={"Sisa Tagihan"} value={moneyFormat(
              detailso.grand_total - detailso.total_payment || 0,
              "Rp. "
            )} /> */}
        </View>
      </View>
      {/* <DetailDivider>Daftar Produk</DetailDivider> */}
      <Text
        style={{
          fontFamily: Fonts.poppins,
          fontSize: 14,
          color: "#808080",
          marginTop: 4,
          marginHorizontal: 16
        }}>
        Daftar Produk
      </Text>

      <View>
        {!detailso.loading && detailso.t_sales_order_lines.length === 0 && (
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
            padding: 10,

            borderRadius: 8,
            borderColor: colors.cardBorder,
            borderWidth: 1,
            marginHorizontal: 16
          }}
        >
          {detailso.t_sales_order_lines.map((item, key: number) => {
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
                  key={key}
                  style={{
                    backgroundColor: "white",

                    width: "20%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.poppins,
                      fontSize: 12,
                      paddingHorizontal: 6,
                      backgroundColor: "#F3F3F3",
                      flexShrink: 1,
                      textAlign: "center",
                      borderRadius: 4

                    }}>
                    {item.qty}x
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins,
                      fontSize: 12,
                      paddingHorizontal: 6,
                      textAlign: "center",

                    }}>
                    ({item.unit})
                  </Text>
                </View>



                <View
                  key={key}
                  style={{
                    backgroundColor: "white",
                    flex: 1,
                    marginHorizontal: 10
                  }}
                >


                  <View
                    style={{
                      flexGrow: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.poppins,
                        color: "#808080"
                      }}
                    >
                      {item.product_name}
                    </Text>

                    {/* {!!item.discount && Number(item.discount) > 0 && ( */}
                    {/* <Text>Diskon: {item.discount}%</Text> */}
                    {/*})} */}

                  </View>
                </View>

                <Text
                  style={{
                    backgroundColor: "white",
                    flex: 1,
                    width: "45%",
                    fontFamily: Fonts.poppins,
                    fontSize: 14,
                    color: colors.black,
                    textAlign: "right"
                  }}>{moneyFormat(item.total, "Rp. ")}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
});
