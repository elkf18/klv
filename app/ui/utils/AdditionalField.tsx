import { metaProperty } from "@babel/types";
import {useIsFocused, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import ActivityStore from "app/model/activity";
import CustomerStore from "app/model/customer";
import Activity from "app/pages/Activity";
import CustomSpinner from "app/ui/utils/CustomSpinner";
import DetailDivider from "app/ui/utils/DetailDivider";
import Loading from "app/ui/utils/Loading";
import Fonts from "libs/assets/fonts";
import AppConfig from "libs/config/app";
import { ITheme } from "libs/config/theme";
import { Dimensions, StyleSheet, ToastAndroid } from "react-native";
import * as Location from 'expo-location';


import {
  Button,
  Camera,
  ChoiceGroup,
  DateTime,
  Field,
  Form,
  Icon,
  Image,
  Screen,
  ScrollView,
  Select,
  Signature,
  Text,
  TextInput,
  TopBar,
  View,
} from "libs/ui"; //ScrollView,


import { runInAction } from "mobx";
import { observer , useLocalObservable } from "mobx-react";
import React, { useEffect , useRef, useState} from "react";
import * as Yup from "yup";

import { dateFormat } from "libs/utils/date";
import locationService from "app/services/location";
import { LocationObject } from "expo-location";
// import { ScrollView } from "react-native-gesture-handler";

export default observer((props: any) => {
    const { index: key, item, initialize, fields } = props;

    
    const nav = useNavigation();
    const Theme: ITheme = useTheme() as any;

  return (
    <>
    <Field
      initializeField={initialize}
      label={item.label}
      path={`additional_data[${key}].value`}
      styles={{
        label:{
          fontFamily:Fonts.poppinsmedium ,
          color:"#333333"
        },
        input: {
          borderRadius: item.type.toLowerCase()=="choicegroup"?0:10,
          borderWidth: item.type.toLowerCase()=="choicegroup"?0:1,
          borderColor: "#CCCCCC",
          backgroundColor: "transparent",
        },
      }}
    >
      {
        item.type.toLowerCase()=="textinput"? 
          <TextInput type={item.subtype.toLowerCase()}></TextInput>
          :
        item.type.toLowerCase()=="select"? 
          <Select
            placeholder={item.placeholder}
            items={item.list}
            labelPath={"label"}
            valuePath={"value"}
            />
          :
        item.type.toLowerCase()=="choicegroup"? 
        <ChoiceGroup
          mode={!!item.subtype?item.subtype.toLowerCase():"default"}
          items={item.list}
          valuePath={"value"}
          labelPath={"label"}
        />
        :
        item.type.toLowerCase()=="datetime"? 
          <DateTime type={item.subtype.toLowerCase()}></DateTime>
          :
          <TextInput type={"text"}></TextInput>
      }
      
    </Field>
    </>
  );
});
