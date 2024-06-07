import { FlatList } from "libs/ui";
import ProductStore from "app/model/product";
import EmptyList from "app/ui/utils/EmptyList";
import MainTopBar from "app/ui/utils/MainTopBar";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import RenderItem from "../ui/outlet/RenderItem";
import Fab from "app/ui/utils/Fab";
import { useNavigation } from "@react-navigation/core";
import OutletStore from "app/model/outlet";
import SessionStore from "app/model/session";
import { limitDialog } from "app/model/utils";


export default observer(() => {
    const onRefresh = async () => {
      OutletStore.load();
    };
    const nav = useNavigation();
    const refreshControl = (
      <RefreshControl refreshing={OutletStore.loading} onRefresh={onRefresh} />
    );
  
    useEffect(() => {
      onRefresh();
    }, []);
  
    return (
    <>
        <MainTopBar filter={OutletStore.filter} disableDate={true} />
      <FlatList
        refreshControl={refreshControl}
        data={OutletStore.getList}
        renderItem={({ item }: any) => {
          return <RenderItem item={item} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data outlet."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />
      {/* //TODO */}
      {SessionStore.role.role_name.toLowerCase()!=="sales" && 
          SessionStore.package.id!=1 && 
          //SessionStore.package.menu_prefix=="pos_" &&
          (
        <Fab
          onPress={() => {
            let limit = SessionStore.getConfig("m_outlet")
          if (!!limit) {
            if (OutletStore.list.length >= (limit - 1)) {
              limitDialog()
            } else {

              OutletStore.detail.init();
            nav.navigate("user/outlet/Form");
            }
          } else {
            OutletStore.detail.init();
            nav.navigate("user/outlet/Form");
          }
            
          }}
        />)
      }
      
    </>
    )
});