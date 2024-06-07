import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { Text, View } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";
import { Linking } from "react-native";
import colors from "../../config/colors";

export default observer(({ label, value, style, children, last=false }: any) => {

  let content = ""
  if(!value){
    content="-"
    value="-"
  }else{
    content = value
  }

  if(content.includes(AppConfig.serverUrl+"repo/")){
    const uripath = value.split("/");
    const fileName = uripath[uripath.length - 1];
    content=fileName
  }
  return (
    <View
      style={{
        flexDirection:"column",
        flexGrow:1,
        ...style,
      }}
    >
      {!!label && (
        <Text
          style={{
            fontSize: 14,
            flex:1,
            fontFamily:Fonts.poppins,
            color:"#808080"
          }}
        >
          {label}
        </Text>
      )}
      <Text
        style={{
          flexDirection: "row",
          flex:1,
          alignItems: "center",
          justifyContent: "flex-end",
          fontFamily:Fonts.poppinsmedium,
            color:value.includes(AppConfig.serverUrl+"repo/")?colors.primary: "#333333"
        }}
        onPress={() => {

          if(value.includes(AppConfig.serverUrl+"repo/")){
            if(
              value.includes(".jpg")||
              value.includes(".jpeg")||
              value.includes(".png")){
                Linking.openURL(value)
              }else{
                Linking.openURL("https://docs.google.com/gview?embedded=true&url="+value)
              }
            
          }else{
            
          }
          
        }}
      >
        {children || 
        content}
      </Text>
      {!last && 
      <View
      style={{
        marginVertical: 10,
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: 1,
      }}
    />
      }
      
    </View>
  );
});


/*
nav.navigate("MediaWebView", {
      data: {
        title: "User Guide",
        source: {
          uri: "https://docs.google.com/gview?embedded=true&url=dev.kelava.id/sfa/repo/userguide_crm.pdf",
        },
        style: {
          padding: 15,
        },
      },
    });
    
  })
*/