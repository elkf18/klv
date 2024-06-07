import Fonts from "libs/assets/fonts";

import { FlatList, Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { useNavigation, useTheme } from "@react-navigation/native";
import OpportunityStore from "app/model/opportunity";
import Footer from "app/ui/opportunity/Footer";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import MainTopBar from "app/ui/utils/MainTopBar";
import TabList from "app/ui/utils/TabList";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import RenderItem from "../ui/opportunity/RenderItem";
import { ITheme } from "libs/config/theme";

export default observer(() => {
  const nav = useNavigation();
  const Theme: ITheme = useTheme() as any;

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    OpportunityStore.load();
  };

  const refreshControl = (
    <RefreshControl
      refreshing={OpportunityStore.loading}
      onRefresh={onRefresh}
    />
  );

  return (
    <>
      <MainTopBar filter={OpportunityStore.filter} disableDate />
      <TabList
        tabs={OpportunityStore.getStage}
        state={OpportunityStore.filter}
      />
      <Filter filter={OpportunityStore.filter} />
      {/* <FlatList
        refreshControl={refreshControl}
        data={OpportunityStore.getList}
        renderItem={({ item }: any) => {
          return <RenderItem item={item} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada opportunity."} />
        }
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        ListFooterComponent={() => <Footer />}
      /> */}
      <View
        style={{
          paddingHorizontal: 15,
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <View
          shadow
          style={{
            padding: 10,
            backgroundColor: Theme.colors.primary,
            marginVertical: 10,
            borderRadius: 4,
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Total:
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.NunitoBold,
              color: "white",
            }}
          >
            {moneyFormat(OpportunityStore.total, "Rp. ")}
          </Text>
        </View>
        <Fab
          onPress={() => {
            nav.navigate("user/opportunity/Form");
          }}
          style={{
            marginLeft: 10,
            marginBottom: 10,
            position: undefined,
            bottom: undefined,
            right: undefined,
          }}
        />
      </View>
    </>
  );
});
