import { useIsFocused, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import OpportunityStore from "app/model/opportunity";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  ChoiceGroup,
  
  Field,
  Form,
  Screen,
  ScrollView,
  Select,
  Text,
  TextInput,
  TopBar,
  View,
} from "libs/ui";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import * as Yup from "yup";
import Loading from "../utils/Loading";
import DateTime from "../utils/DateTime";
import DetailItem from "../utils/DetailItem";
import { dateFormat } from "libs/utils/date";
import DetailItemHorizontal from "../utils/DetailItemHorizontal";
import { moneyFormat } from "libs/utils/string-format";
import DetailTopBar from "../utils/DetailTopBar";
import { RefreshControl } from "react-native";

export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  let { id }: any = route.params || {};

  useEffect(() => {
    
    if (isFocused) {
      OpportunityStore.detail.load(id, true);
    }
    
  }, [isFocused]);

  const onRefresh = async () => {
    //ToastAndroid.show("Refresh: "+(typeof UsersStore.detailUser.loadDetail),ToastAndroid.SHORT)
    await OpportunityStore.detail.load(id, true);
    
  };
  const refreshControl = (
    <RefreshControl refreshing={OpportunityStore.detail.loading} onRefresh={onRefresh} />
  );

  const editable =true;

  return (
    <Screen
    style={{
      backgroundColor:"#fff"
    }}>
      <DetailTopBar loading={OpportunityStore.detail.loading} title="Detail Prospek" 
          onDelete={undefined}
        
        onEdit={
            editable
              ? () => {
                    nav.navigate("user/opportunity/Form", {
                        id: OpportunityStore.detail.id,
                        
                    });
                  
                }
              : undefined
          }
      />
      {/* <Loading loading={OpportunityStore.detail.loading} /> */}
      <ScrollView
       refreshControl={refreshControl}>
      <View
        style={{
          paddingTop: 15,
          paddingHorizontal: 15,
          flexDirection:"column",
        }}>
        {!!OpportunityStore.detail.fullname &&
            <Text
              style={{
                fontFamily:Fonts.poppinsmedium,
                fontSize:14,
                color:"#000"
              }}
            >
              Dibuat oleh : {OpportunityStore.detail.fullname}
            </Text>
        }
        {!!OpportunityStore.detail.created_date &&
            <Text
              style={{
                fontFamily:Fonts.poppins,
                fontSize:14,
                color:"#808080"
              }}
            >
              {dateFormat(OpportunityStore.detail.created_date)}
            </Text>
        }
      </View>
      <View
          style={{
            padding: 15
          }}
        >
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 15,
              marginBottom: 15,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#CCCCCC',
            }}
          >
          <DetailItemHorizontal label={"Prospek"} value={(OpportunityStore.detail.name)} />
          <DetailItemHorizontal label={"Pelanggan"} value={(OpportunityStore.detail.customer_name)} />
          <DetailItemHorizontal label={"Nilai"} value={moneyFormat(OpportunityStore.detail.amount)} />
          <DetailItemHorizontal label={"Profit"} value={moneyFormat(OpportunityStore.detail.margin)} />
          <DetailItemHorizontal label={"Tahapan"} value={(OpportunityStore.detail.stage)} />
          <DetailItemHorizontal label={"Estimasi Deal"} value={(dateFormat(OpportunityStore.detail.estimate_deal))} />
          <DetailItemHorizontal label={"Deskripsi"} value={(OpportunityStore.detail.description)} />
          <DetailItemHorizontal label={"Catatan"} value={(OpportunityStore.detail.remarks)}/>
          <DetailItemHorizontal label={"Dokumen"} value={OpportunityStore.detail.attachment} last={true} />

          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});