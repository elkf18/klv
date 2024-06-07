import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import SalesStore, { Sales } from "app/model/sales";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions, RefreshControl } from "react-native";
import RenderItem from "../ui/so/RenderItem";
import MainTopBar from "app/ui/utils/MainTopBar";
import { FlatList, Text, View } from "libs/ui";
import SessionStore from "app/model/session";
import { useLocalObservable } from "mobx-react";
import { runInAction } from "mobx";
import CustomDetailItem from "../../app/ui/utils/DetailItemHorizontal";
import Activity from "./Activity";
import ActivityStore from "app/model/activity";

export default observer(() => {
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    onRefresh();
  }, [SalesStore.filter.date,SalesStore.filter.search,]);

  const onRefresh = async () => {
    runInAction(()=>{
      // SalesStore.list = [] as Sales[];
      meta.offset=0
      SalesStore.loadMore(meta.offset);
    })
  };

  const meta = useLocalObservable(() => ({
    offset:0,
    isLoading:false,
    lastPage:false
  }));
  const loadMore = () => {
    SalesStore.loadMore(meta.offset);
  };

  const footer = () => {
    return (
      <View 
      style={{
        padding:8,
        width:"100%"
      }}
      >
        {/* {SalesStore.lastPage && SalesStore.LoadedList.length!==0 &&
          <View
          style={{
            height:2,
            width:"100%",
            backgroundColor:"#777777"
          }}
          />
        } */}

      {SalesStore.loading &&
          <Text
          style={{
            width:"100%",
            textAlign:"center"
          }}
          >
            Sedang memuat
          </Text>
        }


      </View>
    );
  };

  

  const refreshControl = (
    <RefreshControl refreshing={SalesStore.loading} onRefresh={onRefresh} />
  );

  return (
    <>
      <MainTopBar filter={SalesStore.filter} />
      <Filter filter={SalesStore.filter} />

      {/* <View
      style={{
        marginHorizontal:8
      }}>
        <CustomDetailItem label={"Jumlah SO"} value={SalesStore.list.length} />
      </View> */}
      
      <FlatList
        refreshControl={refreshControl}
        data={SalesStore.LoadedList}
        renderItem={({ item }: any) => {
          return <RenderItem item={item} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data penjualan."} />
        }
        ListFooterComponent={footer}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        onEndReached={
          ()=>{
            if(!SalesStore.loading){
              meta.offset = SalesStore.list.length
              loadMore()
            }
          }
        }
        
        
        
        
      />
      {!!SessionStore.user.id_outlet && 
      <Fab
      onPress={() => {
        nav.navigate("user/so/Form");
      }}
    />
    }
      
    </>
  );
});
