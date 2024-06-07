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
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const { height, width } = useWindowDimensions();

  let heightx = (735*width)/1440;

  

  useEffect(()=>{
    if(SessionStore.firstOpened===false){
        nav.navigate("Login")
    }
  },[])

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
      <ScrollView>
        <ImageBackground
        source={require("app/assets/images/bg_1.png")}
        resizeMode={"contain"}
        imageStyle={{
          top:0,
          left:0,
          width:width,
          height:heightx,
          
        }}
        >
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
              source={require("app/assets/images/logo.png")}
              style={{
                height: 60,
                width: 180,
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
                lineHeight: 32,
                fontSize: 14,
                fontFamily: Fonts.poppins,
                color: "#808080",
              }}
            >
              Bisnis Menjadi Lebih Mudah
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
          SessionStore.initFormRegist();
          nav.navigate("Register", {
           
          });
            //nav.navigate("Onboarding")
        }}
      >
        <Text
          style={{
            color: Theme.colors.textLight,
            fontSize: 16,
            fontFamily: Fonts.poppinsbold
          }}
        >
          Daftar Sekarang
        </Text>
      </Button>

        <Text
        style={{
          textAlignVertical: 'center'

         }}>
        Sudah punya akun?{" "}
        
        <Text
          style={{
            color: Theme.colors.primary,
            textAlignVertical: 'bottom',
            fontFamily:Fonts.poppinsbold

          }}
          onPress={() => {
            nav.navigate("Login")
          }}
        >
          Login Disini
        </Text>
      
      
        </Text>
      
      </View>
         
          </ImageBackground>
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
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: Theme.colors.textLight,
            fontSize: 16,
            fontFamily: Fonts.poppinsbold
          }}
        >
          Get Started
        </Text>
      </Button>

      <View
       style={{
        flexDirection: "row",
        alignSelf:"center",
        alignItems:"center",
        alignContent:"center",
        marginTop:11,
        marginBottom:10
       }}
      >

      

          <View style={{
          backgroundColor:"#E6E6E6",
          width:1,
          height:30

       }}/>
       
      <Button
        style={{
          flex:1,
          paddingHorizontal: 10,
          minHeight: 30,
          height: 30,
          backgroundColor: "transparent",
          flexDirection: "column",
        }}
        onPress={() => {
          SessionStore.initFormRegist();
          nav.navigate("Register", {
           
          });
        }}
      >
        <Text
          style={{
            color: Theme.colors.primary,
            width: "100%",
            textAlign:"center"
          }}
        >
          Buat Akun
        </Text>
      </Button>
      </View>

      
    </>
  );
});
