import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import ActivityStore from "app/model/activity";
import CustomerStore from "app/model/customer";
import locationService from "app/services/location";
import DetailDivider from "app/ui/utils/DetailDivider";
import { LocationObject } from "expo-location";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  ChoiceGroup,  
  DocumentPicker,  
  Field,
  Form,
  Icon,
  Screen,
  ScrollView,
  Select,
  Text,
  TextInput,
  TopBar,
  View,
} from "libs/ui";
import * as Location from 'expo-location';
import { observer,useLocalObservable } from "mobx-react";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomSpinner from "../utils/CustomSpinner";
import DateTime from "../utils/DateTime";
import Loading from "../utils/Loading";
import AdditionalStore from "app/model/additional";
import SessionStore from "app/model/session";
import AdditionalField from "../utils/AdditionalField";
import RenderItem from "./RenderItem";
import styles from "app/config/styles";
import { runInAction } from "mobx";
import AppConfig from "libs/config/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "app/config/colors";

export default observer(() => {
  const nav = useNavigation();
  const route = useRoute();
  const isEdit = !!ActivityStore.detail.id;


  
  useEffect(() => {
    if(!isEdit){
      ActivityStore.detail.initForm()
    }else{
      ActivityStore.detail.mergeForm()
    }

    ActivityStore.detail.loadCache();

  }, []);





  const local = useLocalObservable(() => ({
    lat: 0,
    long: 0,
    ready:false,
    epoch:0,
    pickedFile:""
  }));

  useEffect(()=>{
    if(local.pickedFile!==""){
      runInAction(()=>{
        ActivityStore.detail.attachment = local.pickedFile
      })
    }else{
      // runInAction(()=>{
      //   ActivityStore.detail.attachment = ""
      // })
    }
    
  }, [local.pickedFile])

  

  const [location, setLocation] = useState<LocationObject | null>(null);//LocationObject
  const [watcher, setWatcher] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    local.ready=false
    local.lat=0;
    local.long=0;
    // ActivityStore.detail.load(id, true);
    CustomerStore.load();


    //getLocation()

    (async () => {
      await locationService.askPermission();

      let enabled =await Location.hasServicesEnabledAsync()

      if(enabled){
        setWatcher(await Location.watchPositionAsync(
          {accuracy:Location.Accuracy.High},
          (loc) => {
            setLocation(loc);
            local.lat=loc.coords.latitude;

            local.long=loc.coords.longitude;
            
            local.ready=true;
          }
        ))
      }else{
        alert("Silahkan menyalakan GPS terlebih dahulu.")
        nav.goBack()
      }
      
    })();

    return () => {
      if(!!watcher){
        watcher.remove()
      }
    };
  }, []);


  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key:any, value:any) => {
    if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
            return;
        }
        seen.add(value);
    }
    return value;
    };
};

  return (
    <Screen
    style={{
      backgroundColor:"#fff"
    }}
    >
      <TopBar
        backButton={true}
        actionBackButton={async () => {
          let res = await ActivityStore.detail.reset();
          if (res !== null) {
            nav.goBack();
          }
        }}
        rightAction={<CustomSpinner loading={ActivityStore.detail.loading} />}
        styles={{
          title:{
            paddingTop:3
          }
        }}
      >
        {!isEdit ? "Tambah Aktivitas" : "Ubah data Aktivitas"}
        
      </TopBar>
      <Loading loading={ActivityStore.detail.loading} />
      { local.ready==false?
        <View
        style={{
          backgroundColor:"#6e7864",
          width:"100%"
        }}
        
        >
          <Text
          style={{
            color:"#fff",
            paddingVertical:8,
            textAlign:"center"
          }}
          >
            Memindai Lokasi...
          </Text>
        </View> 
        :
        <View
        style={{
          backgroundColor:"#b3a98e",
          width:"100%"
        }}
        
        >
          <Text
          style={{
            color:"#fff",
            paddingVertical:8,
            textAlign:"center"
          }}
          >
            Lokasi: {location?.coords.latitude}, {location?.coords.longitude}
          </Text>
        </View> 
      }
        <View style={{flex: 1}} >
          <Form
            values={ActivityStore.detail}
            validationSchema={{
              type: Yup.string().required("Harus di isi."),
              id_customer: Yup.number().required("Harus di isi.").nullable(),
              visit_date: Yup.string().required("Harus di isi."),
              title: Yup.string().required("Harus di isi."),
              status: Yup.string().required("Harus di isi."),
            }}
            onSubmit={() => {


              ActivityStore.detail.longitude = local.long//_.get(currentLocation, "longitude", 0);//location!!.coords.longitude //_.get(currentLocation, "longitude", 0);
              ActivityStore.detail.latitude =  local.lat//_.get(currentLocation, "latitude", 0);//location!!.coords.latitude//_.get(currentLocation, "latitude", 0);

              // console.log(JSON.stringify(ActivityStore.detail))
              // console.log(JSON.stringify(ActivityStore.detail, getCircularReplacer()));
// {"otherData":123}  
              // if(ActivityStore.detail.attachment.includes("file://")){
              //   ActivityStore.detail.saveAttachment().then((res: boolean) => {
              //     if (!!res) {
              //       nav.goBack();
              //     }
              //   });
              // }else{
                
                console.log(local.pickedFile)
                console.log(ActivityStore.detail.attachment)
                ActivityStore.detail.save().then((res: boolean) => {
                  if (!!res) {
                    nav.goBack();
                  }
                });
              

              
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
                  label={"Status Aktivitas *"}
                  path="status"
                  styles={{
                    label:{
                       
                       color:"#333333"
                    },
                    input: {
                      borderWidth: 0,
                      borderRadius:0
                    },
                  }}
                >
                  <ChoiceGroup
                    mode="tags"
                    items={[
                      { label: "Baru", value: "Baru" },
                      { label: "Berjalan", value: "Berjalan" },
                      { label: "Selesai", value: "Selesai" },
                    ]}
                    valuePath={"value"}
                    labelPath={"label"}
                  />
                </Field>
                <Field
                  initializeField={props}
                  label={"Nama Aktivitas *"}
                  path={"title"}
                  styles={{
                    input: {
                      ...styles.field
                    },
                  }}
                  
                >
                  <TextInput placeholder="Tulis Nama Aktivitas" type={"text"}></TextInput>
                </Field>

                <Field
                  initializeField={props}
                  label={"Pelanggan *"}
                  path={"id_customer"}
                  styles={{
                    label:{
                       
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <Select
                    placeholder={"Select"}
                    items={CustomerStore.list}
                    labelPath={"name"}
                    valuePath={"id"}
                  ></Select>
                </Field>

                <View style={{ top: 178, right: 25, position: "absolute" }}>
                  <TouchableOpacity
                    onPress={() => {
                      nav.push("user/customer/Form");
                    }}
                  >
                    <Text style={{ color: "#008FCC", fontWeight: "800" }}>
                      + Tambah Pelanggan
                    </Text>
                  </TouchableOpacity>
                </View>

                <Field
                  initializeField={props}
                  label={"Tanggal/Jam"}
                  path={"visit_date"}
                  styles={{
                    label:{
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <DateTime type="datetime" ></DateTime>
                </Field>

                <Field
                  initializeField={props}
                  label="Tipe *"
                  
                  path="type"
                  
                  styles={{
                    
                    input: {
                      borderWidth: 0,
                      borderRadius:0
                    },
                  }}
                >
                  <ChoiceGroup
                    mode="tags"
                    items={[
                      { label: "Kunjungan", value: "Kunjungan" },
                      { label: "Meeting", value: "Meeting" },
                      { label: "Telpon", value: "Tlp" },
                    ]}
                    valuePath={"value"}
                    labelPath={"label"}
                  />
                </Field>
                
                
                
                <Field
                  initializeField={props}
                  label={"Catatan"}
                  path={"remarks"}
                  
                  styles={{
                    label:{
                       
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <TextInput 
                  placeholder="Tulis Catatan"
                  type={"multiline"}></TextInput>
                </Field>

                 <View
                 style={{
                  marginHorizontal: -15,
                  marginVertical: 15,
                  height:1,
                  backgroundColor:"#000"
                 }}
                 >
                   </View>     
                {/* <DetailDivider
                  style={{
                    marginHorizontal: -15,
                    marginVertical: 15,
                  }}
                >
                  Realisasi
                </DetailDivider> */}
                <Text
                style={{
                  fontFamily:Fonts.poppins,
                  fontSize:16,
                  color:"#333333",
                  marginLeft:5,
                  marginVertical:5
                }}>
                  Realisasi Aktivitas
                </Text>
                
                <Field
                  initializeField={props}
                  label={"Catatan"}
                  path={"result_remarks"}
                  styles={{
                    label:{
                       
                       color:"#333333"
                    },
                    input: {
                      ...styles.field
                    },
                  }}
                >
                  <TextInput type={"multiline"}
                  placeholder="Tulis Catatan"
                  ></TextInput>
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
                {
                ActivityStore.detail.additional_data.length > 0 &&
                <>
                  <DetailDivider
                    style={{
                      marginHorizontal: -15,
                      marginVertical: 15,
                    }}
                  >
                    Custom Field
                  </DetailDivider>
                  {
                  ActivityStore.detail.additional_data.map(
                    (item: any, key: number) => {
                      
                      return(
                        <AdditionalField
                        key={key}
                        index={key}
                        item={item}
                        initialize={props}
                        />
                      )
                    }
                  )
                }
              </>
              }
                </ScrollView>
                {/* <Text>
                  {">"}{JSON.stringify(AdditionalStore.activity[0].fields)}{"<"}
                  </Text> */}
                  
                
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
            disabled={!canSubmit || ActivityStore.detail.saving}
          >
            <Text
              style={{
                color: Theme.colors.textLight,
                fontSize: 16,
                fontFamily: Fonts.NunitoBold,
              }}
            >
        {ActivityStore.detail.saving ? "Menyimpan..." : "Simpan"}
            </Text>
          </Button>
        </View>

      </View>
    </>
  );
});