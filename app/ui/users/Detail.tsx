import { Screen, ScrollView, Text, View } from "libs/ui";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import CustomDetailItem from "app/ui/utils/DetailItemHorizontal";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect, useState } from "react";
import { RefreshControl, ToastAndroid } from "react-native";
import DetailTopBar from "../utils/DetailTopBar";
import UsersStore, { UsersForm } from "app/model/users";
import colors from "app/config/colors";
import DetailItem from "../utils/DetailItem";
import DetailItemHorizontal from "app/ui/utils/DetailItemHorizontal";
import Fonts from "libs/assets/fonts";
import { dateFormat } from "libs/utils/date";


function useForceUpdate() {

  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();
  const forceUpdate = useForceUpdate();
  //let meta: UsersForm = UsersStore.detailUser;
  const isFocused = useIsFocused();
  const meta = useLocalObservable(() => ({
    data:UsersStore.detailUser
  }));

  let { id }: any = route.params || {};
  useEffect(()=>{
    UsersStore.detailUser.id=id
  },[id])

  const onRefresh = async () => {
    //ToastAndroid.show("Refresh: "+(typeof UsersStore.detailUser.loadDetail),ToastAndroid.SHORT)
    let status = await UsersStore.detailUser.loadDetail();
    
    meta.data=UsersStore.detailUser;
    if (!status) {
      alert("Terjadi kesalahan saat mengambil data.");
      nav.goBack();
    }
    forceUpdate();
  };
  const refreshControl = (
    <RefreshControl refreshing={UsersStore.detailUser.loading} onRefresh={onRefresh} />
  );

  useEffect(() => {
    if (isFocused) {
      
      onRefresh();
    }
  }, [isFocused]);

  return (
    <Screen>
      <DetailTopBar
        title="Detail User"
        loading={UsersStore.detailUser.loading}
        onEdit={() => {
          UsersStore.formUser._loadJSON({
            ...UsersStore.detailUser
          })
          nav.navigate("user/users/Form");
        }}
        onBack={() => {
          UsersStore.detailUser = new UsersForm();
          nav.goBack();
        }}
        onDelete={undefined}
      />
      <ScrollView
        style={{
          backgroundColor: "#fff",
        }}
        refreshControl={refreshControl}
      >
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
              fontFamily: Fonts.poppins,
              fontSize: 14,
              color: "#808080",
              marginTop: 4
            }}>
            {"Dibuat pada: "}{dateFormat(UsersStore.detailUser.reg_date)}
          </Text>

          <View
            style={{
              marginTop: 4,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder
            }}>
            <DetailItemHorizontal label={"Nama"} value={meta.data.fullname} />

            <DetailItemHorizontal label={"Username"} value={meta.data.username} />
            <DetailItemHorizontal label={"Role"} value={meta.data.role_description} />
            <DetailItemHorizontal label={"Email"} value={meta.data.email} />

            <DetailItemHorizontal label={"Telpon"} value={meta.data.phone} />

            <DetailItemHorizontal label={"Cabang"} value={meta.data.outlet_name} last={true}/>
          </View>
        </View>
        {/* <DetailDivider>Kontak</DetailDivider> */}
        {/* <View
          style={{
            paddingTop: 15,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 0,
          }}
        >
        <Text
          style={{
            fontFamily:Fonts.poppinsbold,
            marginBottom:10
          }}
        >
        Kontak
        </Text>
          <CustomDetailItem label={"Nama"} value={meta.contact_person_name} />
          <CustomDetailItem label={"KTP / Identitas"} value={meta.identity} />

          <CustomDetailItem
            label={"Telpon"}
            value={meta.contact_person_phone}
          />

          <CustomDetailItem label={"Email"} value={meta.email} />
        </View> */}
      </ScrollView>
    </Screen>
  );
});
