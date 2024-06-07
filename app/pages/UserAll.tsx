
import React, { useEffect } from "react";
import { RefreshControl, ToastAndroid } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import MainTopBar from "app/ui/utils/MainTopBar";
import { FlatList } from "libs/ui";
import { observer, useLocalObservable } from "mobx-react";
import RenderItem from "../ui/users/RenderItem";
import { runInAction } from "mobx";
import UsersStore, { UsersForm } from "app/model/users";
import OutletStore from "app/model/outlet";
import SessionStore from "app/model/session";
import { limitDialog } from "app/model/utils";


export default observer(() => {
  const nav = useNavigation();

  const meta = useLocalObservable(() => ({
    offset: 0,
    isLoading: false,
    lastPage: false
  }));

  const isFocus = useIsFocused()

  const refresh = () => {
    meta.offset = 0
    UsersStore.loadMore(meta.offset);

    UsersStore.loadRoles();
    OutletStore.load();
  };

  const refreshControl = (
    <RefreshControl
      refreshing={UsersStore.loading}
      onRefresh={refresh}
    />
  );

  useEffect(() => {
    refresh();
  }, [UsersStore.filter.search, UsersStore.filter.date, isFocus]);



  const loadMore = () => {
    UsersStore.loadMore(meta.offset);
  };

  return (
    <>
      {/* <Filter filter={ActivityStore.filter} /> */}
      <MainTopBar filter={UsersStore.filter} disableDate={true} />
      <Filter filter={UsersStore.filter} />
      <FlatList
        refreshControl={refreshControl}
        data={UsersStore.list}
        renderItem={({ item }: any) => <RenderItem item={item} />}
        keyExtractor={(_, index: number) => String(index)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data user."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        onEndReached={
          () => {
            if (!UsersStore.loading) {
              meta.offset = UsersStore.list.length
              loadMore()
            }
          }
        }
        onEndReachedThreshold={5}
      />
      <Fab
        onPress={() => {

          let limit = SessionStore.getConfig("p_user")
          if (!!limit) {
            if (UsersStore.list.length >= (limit - 1)) {
              limitDialog()
            } else {

              runInAction(() => {
                UsersStore.formUser._loadJSON({ ...new UsersForm()._json })
              })
              UsersStore.detailUser = new UsersForm()
              nav.navigate("user/users/Form");
            }
          } else {
            runInAction(() => {
              UsersStore.formUser._loadJSON({ ...new UsersForm()._json })
            })
            UsersStore.detailUser = new UsersForm()
            nav.navigate("user/users/Form");
          }


        }}
      />
    </>
  );
});
