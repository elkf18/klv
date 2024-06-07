import { useNavigation } from "@react-navigation/native";
import NotificationStore from "app/model/notification";
import { FlatList, Text, View } from "libs/ui";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import RenderItem from "./RenderItem";
import { useLocalObservable } from "mobx-react";
import { RefreshControl } from "react-native";
export default observer(() => {
  const nav = useNavigation();
  const meta = useLocalObservable(() => ({
    offset:0,
    isLoading:false,
    lastPage:false
  }));
  NotificationStore.loading=false
  const refresh = () => {
    meta.offset=0
    console.log("Refreshingg")
    NotificationStore.lastPage=false
    NotificationStore.load(meta.offset);
  };
  const refreshControl = (
    <RefreshControl
      refreshing={NotificationStore.loading}
      onRefresh={refresh}
    />
  );
  const loadMore = () => {
    console.log("Load More")
    NotificationStore.load(meta.offset);
  };
  return (
    <FlatList
      refreshControl={refreshControl}
      data={NotificationStore.dataList}
      keyExtractor={(_, index) => String(index)}
      renderItem={(props) => <RenderItem {...props} />}
      contentContainerStyle={{
        flex: 1,
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#fff",
            marginHorizontal: 10,
          }}
        />
      )}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Tidak ada data</Text>
        </View>
      }
      onEndReached={
        ()=>{
          if(!NotificationStore.loading){
            meta.offset = NotificationStore.list.length
            loadMore()
          }
        }
      }
      onEndReachedThreshold={1}
    />
  );
});
