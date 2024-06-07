import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import colors from "app/config/colors";
import PaymentStore from "app/model/payment";
import PaymentMethodStore from "app/model/payment_method";
import PromoStore from "app/model/promo";
import SalesStore from "app/model/sales";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  ChoiceGroup,
  Field,
  Form,
  Icon,
  ScrollView,
  Text,
  TextInput,
  View,
} from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { toJS } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Dimensions, Keyboard } from "react-native";
import * as Yup from "yup";
import CustomChoiceGroup from "../utils/CustomChoiceGroup";
import DetailItem from "../utils/DetailItem";
import DetailItemHorizontal from "../utils/DetailItemHorizontal";
import DetailItemNotes from "../utils/DetailItemNotes";
import DetailItemStretch from "../utils/DetailItemStretch";
import DetailItemProduct from "./DetailItemProduct";

export default observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const { data, onBack, handleSave } = props;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  
  //console.log(JSON.stringify(data))
  useEffect(() => {
    PaymentStore.detail._loadJSON(data);
  }, []);

  const meta = useLocalObservable(() => ({
    inputFocus: false,
  }));

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <>
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          alignContent:"center",
          borderBottomWidth:1,
          borderBottomColor:"#cccccc"
        }}
      >
        <Text
          style={{
            color: colors.black,
            fontFamily: Fonts.poppinsmedium,
            fontSize: 16,
            textAlignVertical:"center"
          }}
        >
          Pembayaran
        </Text>
        <Button
          onPress={onBack}
          style={{
            margin: 0,
            paddingHorizontal: 0,
            width: 23,
            height: 23,
            backgroundColor: "transparent",
          }}
        >
          <Icon name="md-close" color="#000" size={18} />
        </Button>
      </View>
      <ScrollView
        keyboardAvoidingProps={{
          style: {
            flexGrow: 0,
          },
        }}
      >
        <View
          style={{
            padding: 10
          }}
        >
          <Form
            values={PaymentStore.detail}
            onSubmit={handleSave}
            validationSchema={{
              payment_method: Yup.string().required("Harus di isi."),
              total_payment: Yup.number().required("Harus di isi."),
            }}
            Submit={(handleSubmit, canSubmit) => (
              <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
            )}
            // onError={(fields) => {
            //   let error = fields.map((f) => f.label);
            //   Alert.alert(
            //     "Terjadi Kesalahan",
            //     `Mohon Anda lengkapi dahulu kolom ${error.join(", ")}.`
            //   );
            // }}
          >
            {(props) => (
              <>
              {!isKeyboardVisible &&
              <>
                <Field
                  initializeField={props}
                  path="payment_method"
                  label="Metode Pembayaran *"
                  styles={{
                    input: {
                      borderWidth: 0,
                    },
                  }}
                  
                >
                  <CustomChoiceGroup

                    style={{
                      flexGrow: 1,
                      flexDirection: "row",
                    }}
                    mode="tags"
                    // items={[
                    //   { label: "Cash", value: "cash" },
                    //   { label: "Transfer", value: "transfer" },
                    //   { label: "Lainnya", value: "others" },
                    // ]}
                    items={PaymentMethodStore.list}
                    valuePath={"name"}
                    labelPath={"name"}
                  />
                </Field>


                <Field
                  initializeField={props}
                  path="id_promo"
                  label="Pasang Promo"
                  styles={{
                    input: {
                      borderWidth: 0,
                    },
                  }}
                >
                  <CustomChoiceGroup
                    style={{
                      flexGrow: 1,
                      flexDirection: "row",
                    }}
                    
                    
                    mode="tags"
                    onChange={(data:any)=>{
                      
                      if(SalesStore.form.id_promo==PromoStore.list[data.index].id){
                        PaymentStore.detail.id_promo=0;
                      }else{
                        SalesStore.form.promo=PromoStore.list[data.index]
                      }
                      SalesStore.form.setPromo(PromoStore.list[data.index].id)
                      
                      PaymentStore.detail.grand_total = SalesStore.form.grand_total
                      PaymentStore.detail.total_payment = SalesStore.form.grand_total
                    
                    }}

                    styles={{
                      item:{
                      width:"100%"
                      }
                    }}
                    items={PromoStore.list}
                    valuePath={"id"}
                    labelPath={"name"}

                  />
                </Field>
              </>
              }
                {/* <Field
                  initializeField={props}
                  label={"Total Pembayaran"}
                  path={`total_payment`}
                  editable={false}
                  Prefix={
                    
                      <Text
                      >
                        {"   Rp."}
                      </Text>
                    
                  }
                >
                  <TextInput type={"currency"} placeholder={"0"}></TextInput>
                </Field> */}

                <View
                style={{
                  marginHorizontal:-10,
                  paddingVertical:12,
                  paddingHorizontal:10,
                  borderTopColor:colors.cardBorder,
                  borderTopWidth:1

                }}
                >
                  <DetailItemStretch label={"Sub total"} value={moneyFormat( SalesStore.form.sub_total, "Rp. ") || "-"} />
                <DetailItemStretch label={"Disc"} value={moneyFormat( SalesStore.form.amount_discount, "Rp. ") || "-"} />
                <DetailItemStretch label={"Total"} value={moneyFormat( SalesStore.form.grand_total, "Rp. ") || "-"} bold={true}/>

                  </View>

                
                
                {/* <Field initializeField={props} label={"Catatan"} path={`notes`}
                
                onBlur={()=>{
                  meta.inputFocus=false
                }}
                >

                  <TextInput type={"multiline"}
                  onFocus={()=>{
                    meta.inputFocus=true
                  }}
                  onBlur={()=>{
                    meta.inputFocus=false
                  }}
                  
                  ></TextInput>
                </Field> */}
              </>
            )}
          </Form>
          
        </View>
      </ScrollView>
    </>
  );
});

const RenderSubmit = observer((props: any) => {
  const { handleSubmit, canSubmit } = props;
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  return (
    <Button
      style={{
        margin: 0,
        marginTop: 15,
        paddingVertical: 12,
        borderRadius:10
      }}
      onPress={handleSubmit}
      disabled={!canSubmit || PaymentStore.detail.saving}
    >
      <Text
        style={{
          color: Theme.colors.textLight,
          fontSize: 16,
          fontFamily: Fonts.NunitoBold,
        }}
      >
        {PaymentStore.detail.saving ? "Menyimpan..." : "Simpan"}
      </Text>
    </Button>
  );
});
