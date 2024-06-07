import { Screen, ScrollView, Text, View } from "libs/ui";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import ActivityStore from "app/model/activity";
import DetailDivider from "app/ui/utils/DetailDivider";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import CustomDetailItem from "../utils/DetailItemHorizontal";
import NoteDetailItem from "../utils/DetailItemNotes";
import DetailTopBar from "../utils/DetailTopBar";
import Fonts from "libs/assets/fonts";
import { Alert } from "react-native";
import AdditionalView from "../utils/AdditionalView";
import colors from "app/config/colors";
import { dateFormat } from "libs/utils/date";
import { StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();
  const meta = ActivityStore.detail;
  let { id }: any = route.params || {};
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!!isFocused) {
      ActivityStore.detail.load(id);
    }
  }, [isFocused]);



  const deleteable = (ActivityStore.detail.status != "Selesai")
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


      ActivityStore.detail
      ActivityStore.detail.delete().then((res: any) => {
        if (!!res) {
          //ActivityStore.load();
          nav.goBack();
        }
      });
    }
  };


  return (
    <Screen
      style={{
        backgroundColor: "#fff"
      }}
    >
      <DetailTopBar
        title="Detail Aktivitas"
        loading={meta.loading}
        onEdit={() => {
          nav.navigate("user/activity/Form");
        }}
        onDelete={deleteable ? handleDelete : undefined}
        onBack={() => {
          nav.goBack();
          ActivityStore.detail.init();
        }}

      />
      <ScrollView
        style={{

        }}
      >
        {/* <DetailDivider>Aktivitas {meta.status}</DetailDivider> */}

        <View
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 0,
          }}
        >

          <Text
            style={{
              fontFamily: Fonts.poppinsmedium,
              fontSize: 14,
            }}>
            Dibuat Oleh: {meta.sales_name}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins,
              fontSize: 14,
              color: "#808080",
              marginTop: 4
            }}>
            {dateFormat(meta.visit_date)}
          </Text>

          <View
            style={{
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}>
            <CustomDetailItem label={"Nama Aktivitas"} value={meta.title} />
            <CustomDetailItem label={"Pelanggan"} value={meta.customer_name} />
            <CustomDetailItem label={"Tanggal / Waktu"} value={dateFormat(meta.date_visit)} />
            <CustomDetailItem label={"Tipe"} value={meta.type} />
            <CustomDetailItem label={"Status"} value={"Aktivitas " + meta.status} />
            <CustomDetailItem label={"Catatan"} value={meta.remarks} last={true} />
          </View>

          <Text
            style={{
              fontFamily: Fonts.poppins,
              fontSize: 14,
              color: "#808080",
              marginTop: 4
            }}>
            Realisasi
          </Text>

          <View
            style={{
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}>
            <CustomDetailItem
              label={"Tanggal/Waktu"}
              value={meta.result_realization_date}
            />

            <CustomDetailItem label={"Catatan"} value={meta.result_remarks} last={false} />

            <CustomDetailItem label={"Dokumen"} value={meta.attachment} last={true} />
          </View>


          {/* <CustomDetailItem label={""} value={meta.contact_person_name} />
          <CustomDetailItem label={""} value={meta.contact_person_phone} /> */}

          {/* <NoteDetailItem label={"Catatan"} value={meta.remarks} /> */}
        </View>
        {/* <DetailDivider>Realisasi</DetailDivider> */}
        <View
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 0,
          }}
        >
          {/* <Text
            style={{
              fontFamily: Fonts.poppinsbold,
              marginBottom: 10
            }}
          >
            Realisasi Aktivitas
          </Text> */}



          {/* <CustomDetailItem
            label={"Tanggal"}
            value={meta.result_realization_date}
          />
          <NoteDetailItem label={"Catatan"} value={meta.result_remarks} /> */}
        </View>
        <View
          style={{
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 0,
            marginBottom:15
          }}
        >
          {ActivityStore.detail.additional_data.length > 0 &&
            <Text
              style={{
                fontFamily: Fonts.poppins,
                fontSize: 14,
                color: "#808080",
                marginBottom: 10,
              }}
            >
              Custom Field
            </Text>
          }
          <View
            style={{
              marginTop: 4,
              padding: ActivityStore.detail.additional_data.length > 0?16:undefined,
              borderRadius: ActivityStore.detail.additional_data.length > 0?10:undefined,
              borderWidth: ActivityStore.detail.additional_data.length > 0?1:undefined,
              borderColor: ActivityStore.detail.additional_data.length > 0?colors.cardBorder:undefined
            }}>

            {
              ActivityStore.detail.additional_data.map(
                (item: any, key: number) => {

                  return (
                    <AdditionalView
                      key={key}
                      index={key}
                      item={item}
                      last={ActivityStore.detail.additional_data.length-1==key}
                    />
                  )
                }
              )
            }
          </View>
        </View>

        {((meta.latitude !== 0 && meta.latitude !== null) && (meta.longitude !== 0 && meta.longitude !== null)) &&
        <View
        style={{
          width: '100%',
          flex: 1,
          paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 0,
        marginBottom:15
        }}
      >
        <Text
          style={{
            fontFamily:Fonts.poppins,
            color:"#808080",
            fontSize: 14
          }}
        >Peta</Text>
        <View style={styles.container}>
          <MapView
            // provider={PROVIDER_GOOGLE}
            style={{
              height: '100%',
              width: '100%',
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}
            region={{
              latitude: meta.latitude,
              longitude: meta.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker 
              coordinate={{latitude: meta.latitude, longitude: meta.longitude}}
              title={'point'}
            />
          </MapView>
        </View>
      </View>}
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: '100%'
  }
 });
