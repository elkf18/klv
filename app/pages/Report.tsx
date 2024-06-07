import { useNavigation, useRoute } from "@react-navigation/native";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import SalesStore from "app/model/sales";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions, RefreshControl } from "react-native";
import RenderItem from "../ui/so/RenderItem";
import MainTopBar from "app/ui/utils/MainTopBar";
import { Field, FlatList, Form, Text, TopBar, View } from "libs/ui";
import Fonts from "libs/assets/fonts";
import DateTime from "app/ui/utils/DateTime";
import { moneyFormat } from "libs/utils/string-format";
import GlobalStore from "app/model/global";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();

  useEffect(() => {
    onRefresh();
  }, [SalesStore.salesReport.date1,SalesStore.salesReport.date2]);

  const onRefresh = async () => {
    SalesStore.salesReport.load()
  };

  const refreshControl = (
    <RefreshControl refreshing={SalesStore.salesReport.loading} onRefresh={onRefresh} />
  );

  return (
    <>
      <TopBar
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{
          color: "#000",
          fontSize: 20,
          fontFamily: Fonts.poppinsbold,
          flexGrow: 1,
          paddingTop:5,
        }}
      >
        
        {GlobalStore.activeMenu.label || ""}
      </Text>
    </TopBar>

      <View style={{
          flexDirection:"row",
          width:"100%",
          paddingTop:20,
          paddingBottom:15,
          backgroundColor:"#fff"
      }}>
          <View style={{
              flexDirection:"column",
                flex:1,
                flexGrow:1
          }}>
                <Text style={{
                    width:"100%",
                    textAlign:"center",
                    fontFamily:Fonts.RobotoBold,
                    color:"#1ACBDA",
                    fontSize:16
                }}>
                    {moneyFormat(SalesStore.salesReport.pesanan, "Rp. ")}
                </Text>
                <Text style={{
                    width:"100%",
                    textAlign:"center",
                    fontFamily:Fonts.Roboto,
                    color:"#CCCCCC",
                    fontSize:12
                }}>
                  (Rp.) Belum Lunas
                </Text>

          </View>
          <View style={{
              flexDirection:"column",
              width:1,
              backgroundColor:"#F0F0F0"
              
          }}></View>      
          <View style={{
              flexDirection:"column",
              flex:1,
              flexGrow:1
          }}>
                <Text style={{
                    width:"100%",
                    textAlign:"center",
                    fontFamily:Fonts.RobotoBold,
                    color:"#A9B616",
                    fontSize:16
                }}>
                    {moneyFormat(SalesStore.salesReport.pembayaran, "Rp. ")}
                  
                </Text>
                <Text style={{
                    width:"100%",
                    textAlign:"center",
                    fontFamily:Fonts.Roboto,
                    color:"#CCCCCC",
                    fontSize:12
                }}>
                  (Rp.) Lunas
                </Text>
          </View>

      </View>


      <Form
            values={SalesStore.salesReport}
            Submit={(handleSubmit, canSubmit) => (
              <>
              </>  
              )}
          >
              {(props) => (
              <>
        
      <View style={{
          flexDirection:"row",
          width:"100%",
          backgroundColor:"#fff",
          paddingHorizontal:15
      }}>
          <View style={{
              flexDirection:"column",
                flex:1,
                flexGrow:1
          }}>
              <Field
                  initializeField={props}
                  label={""}
                  path="date1"
                  styles={{
                    input: {
                      borderWidth: 0,
                    },
                  }}
                >
                    <DateTime type="date"></DateTime>
                </Field>
                

          </View>
          <View style={{
              flexDirection:"column",
              width:15,
              backgroundColor:"#00000000"
              
          }}></View>
          <View style={{
              flexDirection:"column",
              flex:1,
              flexGrow:1
          }}>
              <Field
                  initializeField={props}
                  label={""}
                  path="date2"
                  styles={{
                    input: {
                      borderWidth: 0,
                    },
                  }}
                >
                    <DateTime type="date"></DateTime>
                </Field>
                
          </View>

      </View>
      </>
       )}
       </Form>

       <View style={{
            flexDirection:"row"
       }}>
       <Text style={{
                    fontFamily:Fonts.Roboto,
                    color:"#000",
                    fontSize:14,
                    marginHorizontal:12,
                    marginVertical:12,
                    backgroundColor:"#aaaaaa",
                    paddingHorizontal:10,
                    paddingVertical:6,
                    borderRadius:6,
                }}>
            {SalesStore.salesReport.count} Transaksi
         </Text>
         <View style={{
                    marginHorizontal:12,
                    marginVertical:12,
                    paddingHorizontal:10,
                    paddingVertical:6,
                    borderRadius:6,
                    flex:1,
                    flexGrow:1
                }}>

         </View>
       </View>
       
      <FlatList
        refreshControl={refreshControl}
        data={SalesStore.salesReport.list}
        renderItem={({ item }: any) => {
          return <RenderItem item={item} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data penjualan."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />
    </>
  );
});
