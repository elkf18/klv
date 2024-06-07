import { CommonActions, useNavigation, useTheme } from "@react-navigation/native";
import AppConfig from "app/config/app";
import SessionStore from "app/model/session";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  Field,
  Form,
  Image,
  ImageBackground,
  Screen,
  ScrollView,
  Text,
  TextInput,
  View,
} from "libs/ui";
import { shadeColor } from "libs/utils/color";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import { BorderlessButton, RawButton, RectButton } from "react-native-gesture-handler";
import * as Yup from "yup";
import { useState, useEffect } from 'react';
import { runInAction } from "mobx";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as ITheme;
  SessionStore.loading=false;

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }


  return (
    
    <Screen
      style={{
        backgroundColor: "#fff",
      }}
      statusBar={{
        barStyle: "dark-content",
        backgroundColor: "transparent",
      }}
    >
        <Image
              source={require("app/assets/images/logo.png")}
              style={{
                height: 34,
                width: 145,
                position:"absolute",
                zIndex:999,
                top:50,
                 
              }}
            />
      <ScrollView>
        
           <View
          style={{
            margin: 15,
            justifyContent: 'center',
            height:"100%",
            flex: 1,
            marginTop:75
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              source={require("app/assets/images/postregist.png")}
              style={{
                height: 200,
                width: 200,
                alignContent:"center",
                alignItems:"center",
                alignSelf:"center"
              }}
            />
            <View
            style={{
              marginVertical: 10,
              justifyContent: "center",
            }}
          >
            
          </View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.poppinssemibold,
                color: '#404040',
                textAlign:"center",
                marginHorizontal:52
              }}
            >
              Ayo mulai kembangkan bisnis kamu
            </Text>
          </View>
          
          <View
            style={{
              borderRadius: 14,
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            
             </View>
        </View>
      

        
        <View
       style={{
        flexDirection: "column",
        alignSelf:"center",
        alignItems:"center",
        alignContent:"center",
        justifyContent: 'center',
        flex:1,
        flexGrow:1,
        width:"100%",
        paddingHorizontal:15,
        position: 'absolute' ,
        bottom:0,
        marginBottom:20,
        marginHorizontal:15
       }}
       
      >
          <Button
        style={{
          margin: 0,
          marginTop: 20,
          paddingVertical: 12,
          borderRadius:8,
          flexGrow:1,
          width:"100%",
          marginBottom:15
        }}
        onPress={()=>{
            runInAction(()=>{
                // alert(SessionStore.formRegist.username)
                SessionStore.login();
                // nav.reset;
                // nav.navigate("Login");
                
            })
            
        }}
      >
        <Text
          style={{
            color: Theme.colors.textLight,
            fontSize: 16,
            fontFamily: Fonts.poppinsbold
          }}
        >
          Mulai
        </Text>
      </Button>

      
      </View>
       </ScrollView>
    </Screen>
  );
});

const RenderSubmit = observer((props: any) => {
  const { handleSubmit, canSubmit } = props;
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      
      <Button
        style={{
          margin: 0,
          marginTop: 20,
          paddingVertical: 12,
          borderRadius:100
        }}
        disabled={SessionStore.loading}
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: Theme.colors.textLight,
            fontSize: 16,
            fontFamily: Fonts.poppinsbold
          }}
        >
          Mulai
        </Text>
      </Button>

      
    </>
  );
});
