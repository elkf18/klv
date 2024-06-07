import Fonts from "libs/assets/fonts";

import { Icon, Image, Screen, ScrollView, Text, View } from "libs/ui";
import { dateFormat } from "libs/utils/date";
import { moneyFormat } from "libs/utils/string-format";
import { useIsFocused, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Alert, Dimensions, RefreshControl, StyleSheet } from "react-native";
import DetailDivider from "../utils/DetailDivider";
import DetailItem from "../utils/DetailItemHorizontal";
import DetailTopBar from "../utils/DetailTopBar";
import { ITheme } from "libs/config/theme";
import SessionStore from "app/model/session";
import OutletStore from "app/model/outlet";
import { toJS } from "mobx";
import colors from "app/config/colors";
import AppConfig from "libs/config/app";


export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const meta = OutletStore.detail;
  const isFocus = useIsFocused()
  let { id }: any = route.params || {};
  const deleteable = false
  const cstyle = StyleSheet.flatten([
    {
      height: 120,
      width: "100%",
    },
  ]);

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


      OutletStore.detail
      OutletStore.detail.delete().then((res: any) => {
        if (!!res) {
          OutletStore.load();
          nav.goBack();
        }
      });
    }
  };

  const editable = SessionStore.role.role_name.toLowerCase() !== "sales";

  let isFocused = useIsFocused()
  
  useEffect(() => {
    OutletStore.detail.init();
    OutletStore.detail.load(id);

  }, [isFocused]);

  const refreshControl = (
    <RefreshControl
      refreshing={OutletStore.detail.loading}
      onRefresh={()=>{OutletStore.detail.load(id)}}
    />
  );


  return (
    <Screen
      style={{
        backgroundColor: "#fff"
      }}>
      <DetailTopBar loading={meta.loading} title="Detail Cabang"
        onDelete={deleteable ? handleDelete : undefined}

        onEdit={
          editable
            ? () => {
              nav.navigate("user/outlet/Form", {
                id: id,
              });
            }
            : undefined
        }
      />
      <ScrollView
      refreshControl={refreshControl}>
        <View
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 0,
            marginBottom: 8,
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
              borderColor: "#ddd",
              alignSelf: "center",
              marginBottom:24
            }}
          >
            {console.log(meta.img_url)}
            {!!meta.img_url ? (
              
              <Image
                source={{ uri: AppConfig.serverUrl + meta.img_url }}
                resizeMode="cover"
                style={cstyle}
              />
            ) : (
              <Icon name="image" source="Ionicons" size={60} color={"#ccc"} />
            )}
          </View>
          <View
            style={{
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}>
            <DetailItem label={"Nama Cabang"} value={meta.nama} />
            <DetailItem label={"Area"} value={meta.kodearea} />
            <DetailItem label={"Kode Cabang"} value={meta.code} />
            <DetailItem label={"Telepon"} value={meta.telpon} />
            <DetailItem label={"Alamat"} value={meta.alamat} />
            <DetailItem label={"Kota"} value={meta.kota} />
            <DetailItem label={"Provinsi"} value={meta.provinsi} />
            <DetailItem label={"Negara"} value={meta.negara} />
            <DetailItem label={"Catatan Struk"} value={meta.catatan_struk} last={true} />
          </View>

        </View>
        {/* <DetailDivider>Business Hour</DetailDivider> */}


        {!!SessionStore.package.id && SessionStore.package.id > 2 && SessionStore.package.id != 6 &&
          <>
            <Text
              style={{
                fontFamily: Fonts.poppins,
                marginBottom: 8,
                paddingLeft: 16,
              }}
            >
              Jam Kerja
            </Text>
            <View
              style={{
                marginTop: 4,
                padding: 16,
                borderRadius: 10,
                borderWidth: 1,
                marginHorizontal: 16,
                borderColor: colors.cardBorder
              }}>
              <DetailItem label={"Senin"} value={meta.mon_start + " - " + meta.mon_end} />


              <DetailItem label={"Selasa"} value={meta.tue_start + " - " + meta.tue_end} />

              <DetailItem label={"Rabu"} value={meta.wed_start + " - " + meta.wed_end} />

              <DetailItem label={"Kamis"} value={meta.thu_start + " - " + meta.thu_end} />

              <DetailItem label={"Jumat"} value={meta.fri_start + " - " + meta.fri_end} />

              <DetailItem label={"Sabtu"} value={meta.sat_start + " - " + meta.sat_end} />

              <DetailItem label={"Minggu"} value={meta.sun_start + " - " + meta.sun_end} />
            </View>

          </>
        }
      </ScrollView>



    </Screen>
  )
});