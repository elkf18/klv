import Fonts from "libs/assets/fonts";

import { Icon, Image, Screen, ScrollView, Text, View } from "libs/ui";
import { dateFormat } from "libs/utils/date";
import { moneyFormat } from "libs/utils/string-format";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from "@react-navigation/native";
import ProductStore from "app/model/product";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Alert, Dimensions } from "react-native";

import DetailItemHorizontal from "../utils/DetailItemHorizontal";
import DetailTopBar from "../utils/DetailTopBar";
import { ITheme } from "libs/config/theme";
import SessionStore from "app/model/session";
import AppConfig from "libs/config/app";
import { StyleSheet } from "react-native";
import colors from "app/config/colors";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const meta = ProductStore.detail;
  let Image_User = { uri: AppConfig.serverUrl + ProductStore.detail.url_pic };
  let { id }: any = route.params || {};
  const isFocus = useIsFocused();
  const cstyle = StyleSheet.flatten([
    {
      height: 120,
      width: "100%",
    },
  ]);

  // const deleteable =
  //   SessionStore.role.role_name.toLowerCase() != "sales" &&
  //   !!SessionStore.user.id_outlet;
  const deleteable =SessionStore.package.id == 6;
    //{SessionStore.package.id == 6 && 
  //SessionStore.role.role_name.toLowerCase() == "admin";

  const handleDelete = async () => {
    let confirm = await new Promise((resolve) => {
      Alert.alert("Hapus Data", "Apakah Anda yakin?", [
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
      ProductStore.detail;
      ProductStore.detail.delete().then((res) => {
        if (!!res) {
          ProductStore.loadCategory();
          ProductStore.load();
          nav.goBack();
        }
      });
    }
  };

  const editable =
    SessionStore.role.role_name.toLowerCase() != "sales" &&
    !!SessionStore.user.id_outlet;
  //SessionStore.role.role_name.toLowerCase() == "admin";

  useEffect(() => {
    //ProductStore.detail.init();
    ProductStore.detail.load(id);
  }, [isFocus]);

  return (
    <Screen
      style={{
        backgroundColor: "#fff",
      }}
    >
      <DetailTopBar
        loading={meta.loading}
        title="Detail Produk"
        onDelete={deleteable?handleDelete:undefined} //handleDelete
        onEdit={
          editable
            ? () => {
              nav.navigate("user/product/Form", {
                id: id,
              });
            }
            : undefined
        }
        onBack={() => {
          ProductStore.detail.init();
          nav.goBack();
        }}
      />
      <ScrollView>
        <View
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 0,
          }}
        >
          <View
            style={{
              borderRadius: 99,
              paddingHorizontal: 0,
              paddingVertical: 0,
              marginBottom: 16,
              alignSelf: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                width: 120,
                height: 120,
                overflow: "hidden",
                justifyContent: "center",
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#ddd"
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.poppinsbold,
                  color: "#AAAAAA",
                  fontSize: 48,
                  paddingTop: 3,
                  position: "absolute"
                }}
              > {!!ProductStore.detail.name.charAt(0) ? ProductStore.detail.name.charAt(0) : "A"} </Text>
              {!!ProductStore.detail.url_pic && (
                <Image source={Image_User} resizeMode="cover" style={cstyle} />
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 15,
            marginBottom: 15,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#CCCCCC',
            marginHorizontal: 16
          }}
        >
          <DetailItemHorizontal label={"Nama Produk"} value={meta.name}
          />
          <DetailItemHorizontal label={"Kode Produk"} value={meta.code} />
          {SessionStore.package.id !== 1 && (
            <DetailItemHorizontal
              label={"Kategori Produk"}
              value={meta.product_group}
            />
          )}

          <DetailItemHorizontal
            label={"Satuan Produk"}
            value={String(meta.unit).toUpperCase()}
          />
          <DetailItemHorizontal
            label={"Deskripsi Produk"}
            value={String(meta.description).toUpperCase()}
            last= {SessionStore.package.id == 6}
          />
           {SessionStore.package.id != 6 &&
          <DetailItemHorizontal
            label={"Usia Pakai"}
            value={String(!!meta.usia_pakai?meta.usia_pakai:"-")+" hari"}
            last={true}
          />}
          {/* {!SessionStore.user.id_outlet && (
            
           )} */}
        </View>
        <Text
          style={{
            fontFamily: Fonts.poppins,
            fontSize: 14,
            color: colors.grey,
            marginBottom: 10,
            paddingLeft: 15,
          }}
        >
          Harga
        </Text>

        {!!SessionStore.user.id_outlet ? (
          <>

            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              {meta.product_prices.map((item: any, key) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      padding: 15,
                      borderRadius: 8,
                      backgroundColor: "white",
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor:
                        item.status == "Aktif" ? colors.inactive : "white",
                    }}
                  >

                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.poppinsmedium,
                      }}
                    >
                      Berlaku mulai :
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins,
                        fontSize: 14
                      }}
                    >
                      {dateFormat(item.valid_from, "dd MMMM yyyy") || "-"}
                    </Text>

                    <View
                      style={{
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.poppinsbold,
                          fontSize: 18,
                        }}
                      >
                        {moneyFormat(item.price, "RP. ") || "-"}
                      </Text>
                    </View>
                  </View>
                );
              })}
              {meta.product_prices.length <= 0 ? (
                <Text
                  style={{
                    fontFamily: Fonts.NunitoBold,
                    fontSize: 18,
                    textAlign: "center",
                    color: "#808080",
                  }}
                >
                  {"Tidak ada Data"}
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: Fonts.NunitoBold,
                    fontSize: 18,
                  }}
                >
                  {""}
                </Text>
              )}
            </View>
          </>
        )
          :
          <View
            style={{
              paddingTop: 15,
              paddingLeft: 15,
              paddingRight: 15,
              paddingBottom: 15,
              marginBottom: 15,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#CCCCCC',
              marginHorizontal: 16
            }}
          >
            <View>
              {meta.product_outlet.map((item: any, key) => {
                return (
                  <DetailItemHorizontal
                    label={item.nama}
                    value={moneyFormat(item.price, "RP. ") || "-"}
                    last={key >= meta.product_outlet.length - 1}
                  />
                );
              })}
            </View>
          </View>


        }
      </ScrollView>
    </Screen>
  );
});
