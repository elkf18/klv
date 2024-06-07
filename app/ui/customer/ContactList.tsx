
import { useNavigation, useRoute } from "@react-navigation/core";
import ContactStore from "app/model/contact";
import { FlatList, Screen, Text, View } from "libs/ui";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { Component, useEffect } from "react";
import { PermissionsAndroid, Platform, RefreshControl, ToastAndroid } from "react-native";
import Contacts from 'react-native-contacts';


export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();
  let { contactsList }: any = route.params || {};
  let contactsLst=null
  let refresh=false




    
    function getPhoneNumber(){
        refresh=true
        if(Platform.OS==='ios'){
            Contacts.getAll().then(contacts => {
                contactsLst=contacts
                // console.log(toJS(contacts))
                // console.log(JSON.stringify(contacts))
              })
        }else if(Platform.OS==='android'){
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                  'title': 'Contacts',
                  'message': 'This app would like to view your contacts.',
                  'buttonPositive': 'Please accept bare mortal'
                }
              ).then((e:any)=>{
                console.log("->"+e)
                Contacts.getAll().then(contacts => {
                  ContactStore.getContact(contacts)
                  })
              })


              // PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((x:any)=>{
              //   if(x!=='granted'){
              //     nav.goBack()
              //   }
              // })

             
        }
        refresh=false
    }
    
    const refreshControl = (
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => {
            getPhoneNumber()
          }}
        />
      );

    useEffect(() => {
        getPhoneNumber()
        
      }, [contactsLst]);

    
        return(
            <>
            <Screen>
                <View style={{
                    
                    justifyContent:'center',
                    height:'100%', 
                    marginTop:20, 
                    marginBottom:20}}>

                <FlatList
                
                data = {contactsList}
                refreshControl={refreshControl}
                renderItem={({item}:any)=>(
                    <View style={{backgroundColor:'gray', margin:2, padding:5}}>

                        <Text >{`${item.givenName}`} {item.familyName}</Text>
                        {!!item.phoneNumbers && item.phoneNumbers.map((phone : any)=>(
                            <Text>{phone.number}</Text>
                        ))}
                    </View>
                )}
                
                keyExtractor={(_, index) => {
                    return String(index);
                  }}
                />
            </View>
            </Screen>
            </>
            
        );
    
    })
