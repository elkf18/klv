import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import OpportunityStore from "app/model/opportunity";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  ChoiceGroup,
  DocumentPicker,
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
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";
import * as Yup from "yup";
import Loading from "../utils/Loading";
import DateTime from "../utils/DateTime";
import DetailItem from "../utils/DetailItem";
import { dateFormat } from "libs/utils/date";
import { runInAction } from "mobx";

export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();

  const local = useLocalObservable(() => ({
    pickedFile:""
  }));
  useEffect(()=>{
    if(local.pickedFile!==""){
      runInAction(()=>{
        OpportunityStore.form.attachment = local.pickedFile
      })
    }else{
      runInAction(()=>{
        OpportunityStore.form.attachment = ""
      })
    }
    
  }, [local.pickedFile])

  let { id }: any = route.params || {};

  useEffect(() => {
    OpportunityStore.form.load(id, true);

    return () => {
      OpportunityStore.form.init();
    };
  }, []);

  return (
    <Screen
    style={{
      backgroundColor:"#fff"
    }}>
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await OpportunityStore.form.reset();
          if (res !== null) {
            nav.goBack();
          }
        }}
        // rightAction={
        //   <CustomSpinner loading={OpportunityStore.form.loading} />
        // }
        styles={{
          title:{
            textAlign:"center",
            marginEnd:50,
            fontFamily:Fonts.poppinsmedium,
          }
        }}
      >
        {!id ? "Tambah Prospek" : "Ubah Prospek"}
      </TopBar>
      <Loading loading={OpportunityStore.form.loading} />
      <View style={{flex: 1}} >
          <Form
            values={OpportunityStore.form}
            onSubmit={async () => {
              OpportunityStore.form.save().then((res) => {
                if (!!res) {
                  OpportunityStore.load();
                  nav.goBack();
                }
              });
            }}
            validationSchema={{
              name: Yup.string().required("Harus di isi."),
              id_customer: Yup.number().required("Harus di isi.").nullable(),
              id_stage: Yup.number().required("Harus di isi.").nullable(),
            }}
            Submit={(handleSubmit, canSubmit) => (
              <RenderSubmit handleSubmit={handleSubmit} canSubmit={canSubmit} />
            )}
            // onError={(error) => {
            //   let field = error
            //     .filter((x) => x.status === false)
            //     .map((x) => x.label);
            //   if (field.length > 0) {
            //     Alert.alert(
            //       "Terjadi Kesalahan",
            //       `Mohon Anda lengkapi dahulu kolom ${field.join(", ")}.`
            //     );
            //   }
            // }}
          >
            {(props) => (
              <>
            <ScrollView
              style={{
                width: "100%",
              }}
              contentContainerStyle={{
                padding: 10,
                paddingBottom: 100
              }}
            >
                <Field
                  initializeField={props}
                  label={"Prospek *"}
                  path={"name"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <TextInput type={"text"}placeholder={"Nama Prospek"} style={{fontFamily:Fonts.poppins}}></TextInput>
                </Field>
                <Field
                  initializeField={props}
                  label={"Pelanggan *"}
                  path={"id_customer"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Select
                    placeholder={"Pilih Pelanggan"}
                    items={CustomerStore.list}
                    labelPath={"name"}
                    valuePath={"id"}
                    styles={{
                      label:{
                        fontFamily:Fonts.poppins ,
                        color:"#333333"
                      }
                    }}
                  ></Select>
                </Field>
                <Field initializeField={props} label={"Nilai"} path={"amount"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}>
                  <TextInput type={"currency"}placeholder={"Nilai Prospek"} style={{fontFamily:Fonts.poppins}}></TextInput>
                </Field>

                <Field initializeField={props} label={"Profit"} path={"margin"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}>
                  <TextInput type={"currency"}placeholder={"Nilai Profit"} style={{fontFamily:Fonts.poppins}}></TextInput>
                </Field>

                <Field
                  initializeField={props}
                  label={"Tahapan *"}
                  path="id_stage"
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Select
                    placeholder="Pilih Tahapan"
                    items={OpportunityStore.getStage}
                    labelPath={"label"}
                    valuePath={"value"}
                    
                    styles={{
                      label:{
                        fontFamily:Fonts.poppins ,
                        color:"#333333"
                      }
                    }}
                  ></Select>
                </Field>

                <Field
                  initializeField={props}
                  label={"Estimasi Deal"}
                  path={"show_estimate_deal"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                  
                >
                  <DateTime type="datetime"></DateTime>
                </Field>

                <Field
                  initializeField={props}
                  label={"Deskripsi"}
                  path={"description"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <TextInput type={"multiline"}placeholder={"Deskripsi"} style={{fontFamily:Fonts.poppins}}></TextInput>
                </Field>
                <Field
                  initializeField={props}
                  label={"Catatan"}
                  path={"remarks"}
                  styles={{
                    label:{
                      fontFamily:Fonts.poppinsmedium ,
                      color:"#333333"
                    },
                    input: {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#CCCCCC",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <TextInput type={"multiline"}placeholder={"Catatan"} style={{fontFamily:Fonts.poppins}}></TextInput>
                </Field>


                <Field
                  initializeField={props}
                label={"Dokumen"}
                path={"attachment"}

              >
               
                <DocumentPicker
                placeholder="Klik untuk upload dokumen"
                onChange={(result)=>{
                  if(!!result){
                    local.pickedFile=result.uri;
                  }else{
                    local.pickedFile="";
                  }
                  
                }} />
              </Field>


                </ScrollView>

                {/* <Field
                  initializeField={props}
                  label={"Tangga dibuat"}
                  path={"created_date"}
                  styles={{
                    label:{
                       fontFamily:Fonts.RobotoBold ,
                       color:"#333333"
                    },
                    input: {
                      borderRadius: 0,
                      borderWidth: 0,
                      borderColor: "#E6E6E6",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                      

                    },
                  }}
                  
                >
                  <DateTime type="date"
                  
                  ></DateTime>
                </Field> */}
                {/* {!!OpportunityStore.form.created_date &&
                  <DetailItem label={"Tanggal dibuat"} value={dateFormat(OpportunityStore.form.created_date)} />
                }
                {!!OpportunityStore.form.fullname &&
                  <DetailItem label={"Dibuat oleh"} value={OpportunityStore.form.fullname} />
                } */}
                

                {/* <Field
                  initializeField={props}
                  label={"Dibuat oleh"}
                  path={"name"}
                  styles={{
                    label:{
                       fontFamily:Fonts.RobotoBold ,
                       color:"#333333"
                    },
                    input: {
                      borderRadius: 0,
                      borderWidth: 0,
                      borderColor: "#E6E6E6",
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                    },
                  }}
                >
                  <TextInput type={"text"}></TextInput>
                </Field> */}
              </>
            )}
          </Form>
        </View>
    </Screen>
  );
});

const RenderSubmit = observer((props: any) => {
  const { handleSubmit, canSubmit } = props;
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      <View
        style={{
          borderTopColor: "#cccccc",
          backgroundColor: "#ffffff",
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 16,
          elevation: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
        </View>
        <View style={{
          flexDirection: "row",
          flex: 1,
          flexGrow: 1,

        }}>
          <Button
            style={{
              margin: 0,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              flexGrow: 1,
              flexBasis: 0,
            }}
            onPress={handleSubmit}
            disabled={!canSubmit || CustomerStore.detail.saving}
          >
            <Text
              style={{
                color: Theme.colors.textLight,
                fontSize: 16,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              {CustomerStore.detail.saving ? "Menyimpan..." : "Simpan Data"}
            </Text>
          </Button>
        </View>

      </View>
    </>
  );
});