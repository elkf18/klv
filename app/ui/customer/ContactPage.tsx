import { useIsFocused, useNavigation, useTheme } from "@react-navigation/native";

import EmptyList from "app/ui/utils/EmptyList";

import Filter from "app/ui/utils/Filter";
import MainTopBar from "app/ui/utils/MainTopBar";
import { Button, FlatList, Icon, Modal, Spinner, Text, TextInput, TopBar, View } from "libs/ui";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform, RefreshControl } from "react-native";

import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

import { action, runInAction, toJS } from "mobx";
import ContactStore from "app/model/contact";
import ContactItem from "./ContactItem";
import GlobalStore from "app/model/global";
import DetailTopBar from "../utils/DetailTopBar";
import { ITheme } from "libs/config/theme";
import Fonts from "libs/assets/fonts";
import { subMinutes } from "date-fns";
import CustomerStore from "app/model/customer";


// class Upload{
//   isUploading = false;
//   uploaded = 0;
// }
export default observer(() => {
  const nav = useNavigation();
  const isFocus = useIsFocused()
  const Theme: ITheme = useTheme() as any;

  
  function getPhoneNumber(){
    if(Platform.OS==='ios'){
        Contacts.getAll().then(contacts => {
          ContactStore.getContact(contacts)
          })
    }else if(Platform.OS==='android'){
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              'title': 'Contacts',
              'message': 'Izikan aplikasi untuk mengakses kontak',
              'buttonPositive': 'Izinkan Akses'
            }
          ).then((e:any)=>{
            console.log("->"+e)
            if(e!=="granted"){
              nav.goBack()
              alert("Tidak dapat mengakses Kontak")
              return
            }
            Contacts.getAll().then(contacts => {
              ContactStore.getContact(contacts)
              })
          })
         
    }
  } 

  

  const refreshControl = (
    <RefreshControl
      refreshing={ContactStore.loading}
      onRefresh={() => {
        getPhoneNumber()
      }}
    />
  );
    useEffect(() => {

      getPhoneNumber()
        
    }, []);
    
    useEffect(() => {
      ContactStore.isUploading=false
      ContactStore.uploaded=0
        
    }, []);
    

    // GlobalStore.activeMenu = {
    //   label: "Tambah dari Kontak",
    //   path:"Customer",
    //   icon:{
    //     name:"md-book"
    //   },
    // };  
    
    function submit(){
      ContactStore.isUploading=true
      let submitee = ContactStore.getChecked

      submitee.map((item,index)=>{
        
        ContactStore.uploaded=(index+1)
      
        CustomerStore.detail.init()
        CustomerStore.detail.name=item.displayName;
        CustomerStore.detail.contact_person_name=item.displayName;

        if(!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number){
            CustomerStore.detail.phone1=item.phoneNumbers[0].number
            CustomerStore.detail.contact_person_phone=item.phoneNumbers[0].number
        }
        if(!!item.phoneNumbers[1]  && !!item.phoneNumbers[1].number){
            CustomerStore.detail.phone2=item.phoneNumbers[1].number
        }
        if(!!item.emailAddresses[0]  && !!item.emailAddresses[0].email){
            CustomerStore.detail.email=item.emailAddresses[0].email
        }
        
        if(!!item.postalAddresses[0]  && !!item.postalAddresses[0].formattedAddress){
            CustomerStore.detail.address=item.postalAddresses[0].formattedAddress
            
            if(!!item.postalAddresses[0].city){
                CustomerStore.detail.new_city=item.postalAddresses[0].city
            }
            if(!!item.postalAddresses[0].country){
                CustomerStore.detail.new_country=item.postalAddresses[0].country
            }

        }

        CustomerStore.detail.status="Leads"

        
        
      //   //VVVVVVVVVVVVVVVVVVVVVVVVVVV
        CustomerStore.detail.saveImport().then((res) => {
          if (!!res) {
        
            if( (index+1) < ContactStore.getChecked.length){
              
              
            }else{
              
              ContactStore.isUploading=false
              
              CustomerStore.load();
              nav.goBack();
              alert(ContactStore.getChecked.length+" data berhasil tersimpan.");
            }
            
          }
        });

      })
    }
    const handleSrcBtn = action(() => {
      ContactStore.filter.showSearch = !ContactStore.filter.showSearch;
    });
  return (
    <>
    <TopBar
     backButton={true}
        actionBackButton={() => {
          nav.goBack();
        }}

        rightAction={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!!ContactStore.loading ? (
              <Spinner
                color={"#000"}
                style={{
                  padding: 8,
                }}
              />
            ) : (!ContactStore.filter?.showSearch)&& (
              
              <View style={{ flexDirection: "row" }}>
              <Button
              mode={"clean"}
              style={{
                margin: 0,
                paddingHorizontal: 0,
                minWidth: 45,
              }}
              onPress={() => handleSrcBtn()}
            >
              <Icon
                name={"ios-search"}
                size={24}
                color="#fff"
              />
            </Button>
              
                </View>
            )}
            
          </View>
        }
        styles={{
          title:{
            paddingTop:3
          }
        }}
      >
        
        <DetailHead filter={ContactStore.filter} title={"Tambah dari Kontak"} handleSrcBtn={handleSrcBtn} />
      </TopBar>
      <Filter filter={ContactStore.filter} />
      <FlatList
      
        refreshControl={refreshControl}
        data={ContactStore.getList}
        renderItem={({ item,index }: any) => {
          return <ContactItem item={item} index={index} />;
        }}
        keyExtractor={(_, index) => {
          return String(index);
        }}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data pelanggan."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        
      />
      
      <CustomProgressBar isUploading={ContactStore.isUploading}/>
      

      {ContactStore.getChecked.length>0 &&
      <Button
      style={{
        margin: 10,
        paddingVertical: 12,
        borderRadius:10,
        backgroundColor: '#00B3FF',
      }}
      onPress={()=>{submit()}}
    >
      <Text
        style={{
          color: Theme.colors.textLight,
          fontSize: 16,
          fontFamily: Fonts.NunitoBold,
        }}
        // Subtotal:
      >
        Tambah dari {ContactStore.getChecked.length} Kontak
      </Text>
    </Button>
      }
      
    </>
  );
});

const CustomProgressBar = observer(({isUploading}:any) => (
  
  <Modal visible={isUploading}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.0 )",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text>
            Menyimpan Kontak. ({ContactStore.uploaded}/{ContactStore.getChecked.length})
          </Text>
        </View>
      </View>
    </Modal>
));


const DetailHead = observer(({ filter, handleSrcBtn,title }: any) => {
  const Theme: ITheme = useTheme() as any;

  if (!!filter?.showSearch)
    return (
      <View
        //type={"View"}
        style={{
          paddingLeft: 10,
          flexDirection: "row",
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "flex-start",
          minHeight: 45,
          height: 45,
        }}
      >
        <Icon
          source={"AntDesign"}
          name={"search1"}
          size={20}
          style={{
            margin: 0,
            marginRight: 8,
          }}
          color={"#fff"}
        ></Icon>
        <TextInput
          placeholder={"Search"}
          autoFocus={true}
          type={"text"}
          style={{
            flexGrow: 1,
          }}
          value={filter.search}
          onChangeValue={(value: string) => {
            runInAction(() => (filter.search = value));
          }}
          onBlur={() => handleSrcBtn()}
        ></TextInput>

        <Button
          mode={"clean"}
          style={{
            margin: 0,
            paddingLeft: 0,
            paddingRight: 0,
            minWidth: 45,
            backgroundColor: "transparent",
          }}
          onPress={() => handleSrcBtn()}
        >
          <Icon name={"ios-close-circle"} size={24} color={"#fff"} />
        </Button>
      </View>
    );
  return (
    <>
      {/* {!!GlobalStore.activeMenu.icon && (
        <Icon
          {...(GlobalStore.activeMenu.icon as any)}
          color={Theme.colors.primary}
          size={28}
          style={{
            marginRight: 15,
          }}
        />
      )} */}
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          flexGrow: 1,
          fontFamily: Fonts.poppinsmedium,
          textAlign: 'center',
        }}
      >
        
        {title||GlobalStore.activeMenu.label || ""}
      </Text>
    </>
  );
});