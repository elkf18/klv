import { useNavigation, useTheme } from "@react-navigation/native";
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
  TopBar,
  View,
} from "libs/ui";
import { shadeColor } from "libs/utils/color";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions, TouchableOpacity, useWindowDimensions } from "react-native";
import { BorderlessButton, RawButton, RectButton } from "react-native-gesture-handler";
import Onboarding from 'react-native-onboarding-swiper';
import { useState, useEffect } from 'react';

export default observer(() => {
    const nav = useNavigation();

    useEffect(()=>{
        if(SessionStore.firstOpened===false){
            nav.navigate("Login")
        }
      },[])

    const Skip = ({...props}) => (
        <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
        >
            <Text
                style={{
                lineHeight: 30,
                fontSize: 14,
                fontFamily: Fonts.poppinssemibold,
                color: "#00B3FF",
                marginStart: 20,
                }}
            >
                Lewati
            </Text>
        </TouchableOpacity>
    );

    const Next = ({...props}) => (
        <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
        >
            <Text
                style={{
                lineHeight: 30,
                fontSize: 14,
                fontFamily: Fonts.poppinssemibold,
                color: "#00B3FF",
                marginEnd: 20,
                }}
            >
                Lanjut
            </Text>
        </TouchableOpacity>
    );

    const Prev = ({...props}) => (
        <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
        >
            <Text
                style={{
                lineHeight: 30,
                fontSize: 14,
                fontFamily: Fonts.poppinssemibold,
                color: "#00B3FF",
                marginEnd: 20,
                }}
            >
                Sebelumnya
            </Text>
        </TouchableOpacity>
    );

    const Done = ({...props}) => (
        <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
        >
            <Text
                style={{
                lineHeight: 30,
                fontSize: 14,
                fontFamily: Fonts.poppinssemibold,
                color: "#00B3FF",
                marginEnd: 20,
                }}
            >
                Siap
            </Text>
        </TouchableOpacity>
    );

    const Dots = ({selected} : {selected:any}) => {
        let backgroundColor;

        backgroundColor = selected ? 'rgba(0, 179, 255, 0.8)' : 'rgba(0, 0, 0, 0.2)';

        return(
            <View
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: 50,
                    marginHorizontal: 3,
                    backgroundColor
                }}
            />
        );
    }

    return (
        <View
        style={{
            flex:1
        }}>
            <TopBar
          style={{
            backgroundColor: "transparent",
          }}
          enableShadow={false}
          backButton={true}
          iconProps={{
            color: '#404040',
            name: "arrowleft",
            source: "AntDesign",
          }}
          styles={{
            title: {
              paddingTop: 3,
            },
          }}
        >
          <Image
            source={require("app/assets/images/logo.png")}
            style={{
              height: 20,
              
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              
              
            }}
          />
        </TopBar>

        {/* <Image
              source={require("app/assets/images/logo.png")}
              style={{
                height: 34,
                width: 145,
                position:"absolute",
                zIndex:999,
                top:50,
                 
              }}
            /> */}
        <Onboarding
        bottomBarColor="#fff"
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => {
            SessionStore.initFormRegist();
            nav.navigate("Register", {})
        }}
        onDone={() => {
            SessionStore.initFormRegist();
            nav.navigate("Register", {})
        }}
        pages={[
            //Onboarding 1
            {
                backgroundColor: '#0000',
                image:
                    <Image
                        source={require('app/assets/images/onboarding1.png')}
                        style={{
                            height: 200,
                            width: 280,
                            alignContent:"center",
                            alignItems:"center",
                            alignSelf:"center"
                        }}
                    />,
                title:
                    <Text
                        style={{
                        lineHeight: 30,
                        fontSize: 20,
                        fontFamily: Fonts.poppinssemibold,
                        color: "#000000",
                        textAlign: "center",
                        paddingHorizontal: 50,
                        }}
                    >
                    Monitoring Aktivitas Sales
                    </Text>,
                subtitle:
                    <Text
                        style={{
                        fontSize: 14,
                        fontFamily: Fonts.poppinslight,
                        color: "#000000",
                        textAlign: "center",
                        marginTop: 10,
                        paddingHorizontal: 20,
                        }}
                    >
                    Pantau aktivitas sales kamu secara realtime agar pekerjaan bisa lebih produktiv
                    </Text>,
            },

            //Onboarding 2
            {
                backgroundColor: '#0000',
                image:
                    <Image
                        source={require('app/assets/images/onboarding2.png')}
                        style={{
                            height: 200,
                            width: 280,
                            alignContent:"center",
                            alignItems:"center",
                            alignSelf:"center"
                        }}
                    />,
                title:
                    <Text
                        style={{
                        lineHeight: 30,
                        fontSize: 20,
                        fontFamily: Fonts.poppinssemibold,
                        color: "#000000",
                        textAlign: "center",
                        paddingHorizontal: 50,
                        }}
                    >
                    Capai Target Sales
                    </Text>,
                subtitle:
                    <Text
                        style={{
                        fontSize: 14,
                        fontFamily: Fonts.poppinslight,
                        color: "#000000",
                        textAlign: "center",
                        marginTop: 10,
                        paddingHorizontal: 20,
                        }}
                    >
                    Tingkatkan semangat penjualan dengan melihat target penjualan kamu
                    </Text>,
            },

            //Onboarding 3
            {
                backgroundColor: '#0000',
                image:
                    <Image
                        source={require('app/assets/images/onboarding3.png')}
                        style={{
                            height: 200,
                            width: 280,
                            alignContent:"center",
                            alignItems:"center",
                            alignSelf:"center"
                        }}
                    />,
                title:
                    <Text
                        style={{
                        lineHeight: 30,
                        fontSize: 20,
                        fontFamily: Fonts.poppinssemibold,
                        color: "#000000",
                        textAlign: "center",
                        paddingHorizontal: 50,
                        }}
                    >
                    Lihat Tiap Tahapan Prospek Bisnis Kamu
                    </Text>,
                subtitle:
                    <Text
                        style={{
                        fontSize: 14,
                        fontFamily: Fonts.poppinslight,
                        color: "#000000",
                        textAlign: "center",
                        marginTop: 10,
                        paddingHorizontal: 20,
                        }}
                    >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum libero libero ultricies mollis.
                    </Text>,
            },

            //Onboarding 4
            {
                backgroundColor: '#0000',
                image:
                    <Image
                        source={require('app/assets/images/onboarding4.png')}
                        style={{
                            height: 200,
                            width: 280,
                            alignContent:"center",
                            alignItems:"center",
                            alignSelf:"center"
                        }}
                    />,
                title:
                    <Text
                        style={{
                        lineHeight: 30,
                        fontSize: 20,
                        fontFamily: Fonts.poppinssemibold,
                        color: "#000000",
                        textAlign: "center",
                        paddingHorizontal: 50,
                        }}
                    >
                    Siap Pakai Kelava Untuk Bisnis Kamu
                    </Text>,
                subtitle:
                    <Text
                        style={{
                        fontSize: 14,
                        fontFamily: Fonts.poppinslight,
                        color: "#000000",
                        textAlign: "center",
                        marginTop: 10,
                        paddingHorizontal: 20,
                        }}
                    >
                    Consectetur adipiscing elit. Ipsum libero libero ultricies mollis.
                    </Text>,
            },
        ]}
        />

            
        
        </View>
    )
});