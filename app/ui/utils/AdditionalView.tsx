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
import CustomDetailItem from "../utils/DetailItemHorizontal";

import { runInAction, toJS } from "mobx";
import { observer , useLocalObservable } from "mobx-react";
import React, { useEffect , useRef, useState} from "react";
import * as Yup from "yup";

import { dateFormat } from "libs/utils/date";
import locationService from "app/services/location";
import { LocationObject } from "expo-location";
import { List } from "app/model/additional";
// import { ScrollView } from "react-native-gesture-handler";

export default observer((props: any) => {
    const { index: key, item, initialize, fields,last=false } = props;

    
    const nav = useNavigation();
    const Theme: ITheme = useTheme() as any;

  return (
    <>
    
      {
        item.type.toLowerCase()=="textinput"? 
          <CustomDetailItem
              label={item.label}
              value={item.value}
              last={last}
            />
        :
        item.type.toLowerCase()=="select"? 
          <CustomDetailItem
            label={item.label}
            value={item.value}
            last={last}
          />
          //value={(item.list.filter((x :List) => x.value===item.value))[0].label}
        :
        item.type.toLowerCase()=="choicegroup"? 
          <CustomDetailItem
            label={item.label}
            value={item.value}
            last={last}
          />
          //value={(item.list.filter((x :List) => x.value===item.value))[0].label}
        :
        item.type.toLowerCase()=="datetime"? 
          <CustomDetailItem
            label={item.label}
            value={dateFormat(item.value)}
            last={last}
          />
        :  
          <Text>{item.value}</Text>
      }
      
      
    
    </>
  );
});
