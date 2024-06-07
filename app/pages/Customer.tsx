import { useIsFocused, useNavigation } from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import MainTopBar from "app/ui/utils/MainTopBar";
import { FlatList } from "libs/ui";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import RenderItem from "../ui/customer/RenderItem";
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

import { action, runInAction, toJS } from "mobx";
import GlobalStore from "app/model/global";
import ContactStore from "app/model/contact";


export default observer(() => {
  const nav = useNavigation();
  
  const isFocus = useIsFocused()
  const refreshControl = (
    <RefreshControl
      refreshing={CustomerStore.loading}
      onRefresh={() => {CustomerStore.load()
        }}
    />
  );

  const handleImport = action(() => {
    nav.navigate("user/customer/contact");
    
  });


  
    useEffect(() => {
      CustomerStore.load();
    }, [isFocus]);
  
    
  
  return (
    <>
      <MainTopBar filter={CustomerStore.filter} disableDate={true} enableImport={true} handleImport={handleImport}/>
      <Filter filter={CustomerStore.filter} />
      <FlatList
      
        refreshControl={refreshControl}
        data={CustomerStore.getList}
        renderItem={({ item }: any) => {
          return <RenderItem item={item} />;
        }}
        keyExtractor={(_, index) => {
          return String(index);
        }}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data pelanggan."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />
      <Fab
        onPress={() => {
          nav.navigate("user/customer/Form");
        }}
      />
    </>
  );
});
