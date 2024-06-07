import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useIsFocused, useNavigation, useTheme } from "@react-navigation/native";
import ActivityStore from "app/model/activity";
import RenderItem from "app/ui/activity/RenderItem";
import TabList from "app/ui/activity/TabList";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import { ITheme } from "libs/config/theme";
import { FlatList, View, SectionList, Text } from "libs/ui";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import { dateFormat } from "libs/utils/date";
import { useLocalObservable } from "mobx-react";
import CustomDetailItem from "../../app/ui/utils/DetailItemHorizontal";

const NavigationTab = createMaterialTopTabNavigator();

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const tabs = [
    {
      name: "Baru",
      component: Baru,
    },
    {
      name: "Berjalan",
      component: Berjalan,
    },
    {
      name: "Selesai",
      component: Selesai,
    },
  ];

  return (
    <>
      <NavigationTab.Navigator
        initialRouteName="Baru"
        tabBar={(props) => <TabList tabs={tabs} {...props} />}
        lazy={true}
        tabBarPosition={"top"}
        swipeEnabled={true}
      >
        {tabs.map((tab, key) => (
          <NavigationTab.Screen key={key} {...tab} />
        ))}
      </NavigationTab.Navigator>
    </>
  );
});

const Baru = observer(() => {
  const nav = useNavigation();
  const isFocus = useIsFocused()
  useEffect(() => {
    refresh();
  }, [ActivityStore.filter.search,ActivityStore.filter.date,isFocus]);


  const refresh = () => {
    meta.offset=0
    ActivityStore.loadMoreBaru(meta.offset);
  };

  const meta = useLocalObservable(() => ({
    offset:0
  }));
  

  const loadMore = () => {
    ActivityStore.loadMoreBaru(meta.offset);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={ActivityStore.loadingBaru}
      onRefresh={refresh}
    />
  );

  return (
    <>
      {/* <Filter filter={ActivityStore.filter} /> */}
      <View
      style={{
        marginHorizontal:8
      }}>
        {/* <CustomDetailItem label={"Jumlah"} value={ActivityStore.listBaru.length} /> */}
      </View>

      <SectionList
      sections={ActivityStore.sectionListBaru}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }:any) => <RenderItem item={item} />}
      renderSectionHeader={({ section: {title} }) => (
        <Text style={{ fontWeight:'bold', fontFamily:'Poppins', fontSize:15, marginBottom:10, marginLeft:8 }}>
          {dateFormat(title,'dd MMM yyyy')}
        </Text>
      )}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
      onEndReached={
        ()=>{
          if(!ActivityStore.loadingBaru){
            meta.offset = ActivityStore.listBaru.length
            loadMore()

          }
        }
      }
       onEndReachedThreshold={5}
      />

      {/* <FlatList
        refreshControl={refreshControl}
        data={ActivityStore.listBaru}
        renderItem={({ item }: any) => <RenderItem item={item} />}
        keyExtractor={(_, index: number) => String(index)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data aktivitas."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        onEndReached={
          ()=>{
            if(!ActivityStore.loadingBaru){
              meta.offset = ActivityStore.listBaru.length
              loadMore()

            }
          }
        }
         onEndReachedThreshold={5}
      /> */}
      <Fab
        onPress={() => {
          nav.navigate("user/activity/Form");
        }}
      />
    </>
  );
});

const Berjalan = observer(() => {
  const nav = useNavigation();

  const isFocus = useIsFocused()

  useEffect(() => {
    refresh();
  }, [ActivityStore.filter.search,ActivityStore.filter.date,isFocus]);

  const refresh = () => {
    meta.offset=0
    ActivityStore.loadMoreBerjalan(meta.offset);
  };
  const meta = useLocalObservable(() => ({
    offset:0,
    isLoading:false,
    lastPage:false
  }));

  const loadMore = () => {
    ActivityStore.loadMoreBerjalan(meta.offset);
  };


  const refreshControl = (
    <RefreshControl
      refreshing={ActivityStore.loadingBerjalan}
      onRefresh={refresh}
    />
  );

  return (
    <>
      {/* <Filter filter={ActivityStore.filter} /> */}
      <View
      style={{
        marginHorizontal:8
      }}>
        {/* <CustomDetailItem label={"Jumlah"} value={ActivityStore.listBerjalan.length} /> */}
      </View>

      <SectionList
      sections={ActivityStore.sectionListBerjalan}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }:any) => <RenderItem item={item} />}
      renderSectionHeader={({ section: {title} }) => (
        <Text style={{ fontWeight:'bold', fontFamily:'Poppins', fontSize:15, marginBottom:10, marginLeft:8 }}>
          {dateFormat(title,'dd MMM yyyy')}
        </Text>
      )}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
      onEndReached={
        ()=>{
          if(!ActivityStore.loadingBerjalan){
            meta.offset = ActivityStore.listBerjalan.length
            loadMore()
          }
        }
      }
      onEndReachedThreshold={5}
      />

      {/* <FlatList
        refreshControl={refreshControl}
        data={ActivityStore.listBerjalan}
        renderItem={({ item }: any) => <RenderItem item={item} />}
        keyExtractor={(_, index: number) => String(index)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data aktivitas."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        onEndReached={
          ()=>{
            if(!ActivityStore.loadingBerjalan){
              meta.offset = ActivityStore.listBerjalan.length
              loadMore()
            }
          }
        }
        onEndReachedThreshold={5}
      /> */}

      <Fab
        onPress={() => {
          nav.navigate("user/activity/Form");
        }}
      />
    </>
  );
});

const Selesai = observer(() => {
  const nav = useNavigation();
  const isFocus = useIsFocused()
  useEffect(() => {
    refresh();
  }, [ActivityStore.filter.search,ActivityStore.filter.date,isFocus]);

  const refresh = () => {
    meta.offset=0
    ActivityStore.loadMoreSelesai(meta.offset);
  };
  const meta = useLocalObservable(() => ({
    offset:0,
    isLoading:false,
    lastPage:false
  }));
  const loadMore = () => {
    ActivityStore.loadMoreSelesai(meta.offset);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={ActivityStore.loadingSelesai}
      onRefresh={refresh}
    />
  );

  return (
    <>
      {/* <Filter filter={ActivityStore.filter} /> */}
      <View
      style={{
        marginHorizontal:8
      }}>
        {/* <CustomDetailItem label={"Jumlah"} value={ActivityStore.listSelesai.length} /> */}
      </View>

      <SectionList
      sections={ActivityStore.sectionListSelesai}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }:any) => <RenderItem item={item} />}
      renderSectionHeader={({ section: {title} }) => (
        <Text style={{ fontWeight:'bold', fontFamily:'Poppins', fontSize:15, marginBottom:10, marginLeft:8}}>
          {dateFormat(title,'dd MMM yyyy')}
        </Text>
      )}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
      onEndReached={
        ()=>{
          if(!ActivityStore.loadingSelesai){
            meta.offset = ActivityStore.listSelesai.length
            loadMore()
          }
        }
      }
      onEndReachedThreshold={5}
      />

      {/* <FlatList
        refreshControl={refreshControl}
        data={ActivityStore.listSelesai}
        renderItem={({ item }: any) => <RenderItem item={item} />}
        keyExtractor={(_, index: number) => String(index)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data aktivitas."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        onEndReached={
          ()=>{
            if(!ActivityStore.loadingSelesai){
              meta.offset = ActivityStore.listSelesai.length
              loadMore()
            }
          }
        }
        onEndReachedThreshold={5}
      /> */}

      <Fab
        onPress={() => {
          nav.navigate("user/activity/Form");
        }}
      />
    </>
  );
});
