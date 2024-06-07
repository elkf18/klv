import { Icon, Image, Screen, ScrollView, Text, View } from "libs/ui";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import CustomerStore, { Customer } from "app/model/customer";
import DetailDivider from "app/ui/utils/DetailDivider";
import CustomDetailItem from "app/ui/utils/DetailItemHorizontal";
import { Observer, observer, useLocalObservable} from "mobx-react";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Platform, RefreshControl, Touchable } from "react-native";
import DetailTopBar from "../utils/DetailTopBar";
import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { AddressReceipt } from "app/receipt/address";
import colors from "app/config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import DialogComponent from "./DialogComponent";
import { action } from "mobx";
import * as Location from 'expo-location';
import locationService from "app/services/location";
import { LocationObject } from "expo-location";
import SessionStore from "app/model/session";


export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();
  let { id }: any = route.params || {};
  const [watcher, setWatcher] = useState<any>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);//LocationObject
  const meta: Customer = CustomerStore.detail;
  let Image_User = { uri: AppConfig.serverUrl + meta.foto };
  const cstyle = StyleSheet.flatten([
    {
      height: 120,
      width: "100%",
    },
  ]);
  const isFocused = useIsFocused();
  const onRefresh = async () => {
    let status = await CustomerStore.detail.load(id);
    if (!status) {
      alert("Terjadi kesalahan saat mengambil data.");
      nav.goBack();
    }
  };

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


      CustomerStore.detail
      CustomerStore.detail.delete().then((res) => {
        if (!!res) {
          CustomerStore.load();
          nav.goBack();
        }
      });
    }
  };

  //One Time Customer
  const deleteable = (CustomerStore.detail.name != "One Time Customer")
  const editable = (CustomerStore.detail.name != "One Time Customer")
  const refreshControl = (
    <RefreshControl refreshing={meta.loading} onRefresh={onRefresh} />
  );

  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
    (async () => {
      await locationService.askPermission();

      let enabled =await Location.hasServicesEnabledAsync()

      if(enabled){
        setWatcher(await Location.watchPositionAsync(
          {accuracy:Location.Accuracy.High},
          action((loc) => {
            setLocation(loc);
            observablevariable.latitude = loc.coords.latitude;
            observablevariable.longitude = loc.coords.longitude;
            observablevariable.ready = true;
          })
        ))
      }else{
        alert("Silahkan menyalakan GPS terlebih dahulu.")
        nav.goBack()
      }  
    })();

    return () => {
      if(!!watcher){
        watcher.remove()
      }
    };
  }, [isFocused]);

  const observablevariable = useLocalObservable(() => ({
    visibility: false,
    phoneNumber: '',
    email: '',
    typeActivity: '',
    latitude: 0,
    longitude: 0,
    ready: false
  }))

  const closeDialog = action(() => {
    observablevariable.visibility = false;
  })

  const showDialog = action(() => {
    if(observablevariable.ready == true) {
      observablevariable.visibility = true;
    } else {
      alert("sedang mendapatkan lokasi, harap tunggu sejenak.");
    }
  })

  const setPropsDialog = action((typeActivity: string, phoneNumber?: string, email?: string) => {
    observablevariable.typeActivity = typeActivity;
    observablevariable.phoneNumber = (phoneNumber != null) ? phoneNumber: '';
    observablevariable.email = (email != null) ? email : '';
  })




  const sentEmail = () => {
    let url = "mailto:" + observablevariable.email;
  
    if (Platform.OS === "ios") {
       url = "mailto:" +  observablevariable.email;
    }
  
    openLinkURL('Email', url);
  }
  
  const makeCall = () => {
    let url = "tel:" + observablevariable.phoneNumber;
  
    if (Platform.OS === "ios") {
      url = "tel://" + observablevariable.phoneNumber;
    }
  
    openLinkURL('phone', url);
  }
  
  const sentMessage = () => {
    let url = "sms:" + observablevariable.phoneNumber;
  
    if (Platform.OS === "ios") {
      url = "sms:" + observablevariable.phoneNumber;
    }
  
    openLinkURL('message', url);
  }
  
  const sentWhatssApp = () => {
    let url = "https://wa.me/" +observablevariable.phoneNumber;
  
    if (Platform.OS === "ios") {
      url = "https://wa.me/" + observablevariable.phoneNumber;
    }
  
    openLinkURL('Whatsapp', url);
  }
  
  const openLinkURL = (type:string, url: string) => {
    Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          try{
            Linking.openURL(url);
          }catch(e:any){  
            alert(`Oops can't open ${type}.`);
          }
        }
      });
}
  
  return (
    <Screen>
      <DetailTopBar
        title="Detail Pelanggan"
        loading={meta.loading}
        onEdit={editable ? () => {
          nav.navigate("user/customer/Form");
        } : undefined}
        onBack={() => {
          nav.goBack();
          CustomerStore.detail.init();
        }}
        onDelete={deleteable ? handleDelete : undefined}

        onPrint={
          async () => {
            AddressReceipt(meta);
          }
        }
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
          <View
            style={{
              borderRadius: 99,
              paddingHorizontal: 0,
              paddingVertical: 0,
              marginVertical: 18,
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
              {!!meta.foto ? (
                <Image
                  source={Image_User}
                  resizeMode="cover"
                  style={cstyle}
                />
              ) : (
                <Icon name="person" size={60} color={"#ccc"} />
              )}
            </View>

          </View>
          <View style={{
            marginBottom: 18,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            flex: 1,
          }}>
            <Icon source="FontAwesome" name="info-circle" size={16} color={"#000"} />
            <Text
              style={{
                marginStart: 8,
                fontFamily: Fonts.poppinsmedium,
                fontSize: 16,
                color: "#00B3FF"
              }}
            >
              {meta.status}
            </Text>
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
            }}
          >
            <CustomDetailItem label={"Nama"} value={meta.name} />

            {!!meta.segment && (
              <CustomDetailItem label={"Industri"} value={meta.segment} />
            )}

            <CustomDetailItem label={"Alamat"} value={meta.address} />
            <CustomDetailItem label={"Kota"} value={meta.new_city} />
            <CustomDetailItem label={"Provinsi"} value={meta.new_province} />
            <CustomDetailItem label={"Negara"} value={meta.new_country} />

            <View>
              <CustomDetailItem label={"Telpon 1"} value={meta.phone1} />
              {!!meta.phone1 &&
                <>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      flex: 3,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        let phone=meta.phone1

                        if(phone.charAt(0)=="0"){
                          phone=phone.substring(0, 0) + "62" + phone.substring(0 + 1);
                        }
                        
                        setPropsDialog('whatsapp', phone.replace(/[-' ']/g, ''));
                        if(SessionStore.package.id==6){
                          sentWhatssApp()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="md-logo-whatsapp"
                        size={21}
                        style={{
                          color: colors.primary,
                          marginEnd: 25,
                        }}
                      />

                    </TouchableOpacity>


                    <TouchableOpacity
                      onPress={() => {
                        setPropsDialog('message', meta.phone1);
                        if(SessionStore.package.id==6){
                          sentMessage()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="chatbox"
                        size={21}
                        style={{
                          color: colors.primary,
                          marginEnd: 25,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setPropsDialog('call', meta.phone1);
                        if(SessionStore.package.id==6){
                          makeCall()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="md-call"
                        size={21}
                        style={{
                          color: colors.primary,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              }

            </View>

            <View>
              <CustomDetailItem label={"Telpon 2"} value={meta.phone2} />
              {!!meta.phone2 &&
                <>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      flex: 3,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        let phone = meta.phone2

                        if(phone.charAt(0)=="0"){
                          phone = phone.substring(0, 0) + "62" + phone.substring(0 + 1);
                        }

                        setPropsDialog('whatsapp', phone);
                        if(SessionStore.package.id==6){
                          sentWhatssApp()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="md-logo-whatsapp"
                        size={21}
                        style={{
                          color: colors.primary,
                          marginEnd: 25,
                        }}
                      />

                    </TouchableOpacity>


                    <TouchableOpacity
                      onPress={() => {
                        setPropsDialog('message', meta.phone2);
                        if(SessionStore.package.id==6){
                          sentMessage()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="chatbox"
                        size={21}
                        style={{
                          color: colors.primary,
                          marginEnd: 25,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setPropsDialog('call', meta.phone2);
                        if(SessionStore.package.id==6){
                          makeCall()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="md-call"
                        size={21}
                        style={{
                          color: colors.primary,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              }
            </View>

            <View>
              <CustomDetailItem label={"Email"} value={meta.email} />
              {!!meta.email &&
                <>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      flex: 3,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setPropsDialog('email', '',  meta.email);
                        if(SessionStore.package.id==6){
                          sentEmail()
                        }else{
                          showDialog();
                        }
                      }}>
                      <Icon
                        name="mail"
                        size={21}
                        style={{
                          color: colors.primary,
                        }}
                      />

                    </TouchableOpacity>
                  </View>
                </>
              }
            </View>

            <CustomDetailItem label={"Fax"} value={meta.fax} />
            {
            SessionStore.package.id!=6 && 
            <CustomDetailItem label={"Sales"} value={meta.sales_name}/>     }
            
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
      <DialogComponent
        custId={meta.id}
        custName={meta.name}
        status={observablevariable.visibility}
        typeActivity={observablevariable.typeActivity}
        email={observablevariable.email}
        phoneNumber={observablevariable.phoneNumber}
        latitude={observablevariable.latitude}
        longitude={observablevariable.longitude}
        handleClose={closeDialog}
      />
    </Screen>
  );
});

export const sendWhatsAppMessage = (link:any) => {
   Linking.canOpenURL(link)
    .then(supported => {
      if (!supported) {
       Alert.alert(
         'Please install whats app to send direct message to students via whatsapp'
       );
     } else {
       return Linking.openURL(link);
     }
   })
   .catch(err => console.error('An error occurred', err));
 };


