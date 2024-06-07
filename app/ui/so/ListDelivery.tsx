import { FlatList } from "libs/ui";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import DeliveryStore from "app/model/delivery";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Dimensions, RefreshControl } from "react-native";
import RenderDeliveryItem from "./RenderDeliveryItem";

export default observer((props: any) => {
  const { sales_order } = props;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    onRefresh();
  }, [isFocused]);

  const onRefresh = async () => {
    DeliveryStore.load(sales_order);
  };

  const refreshControl = (
    <RefreshControl refreshing={DeliveryStore.loading} onRefresh={onRefresh} />
  );

  return (
    <>
      <FlatList
        // refreshControl={refreshControl}
        data={DeliveryStore.getList}
        renderItem={({ item, index }: any) => {
          return <RenderDeliveryItem item={item} index={index} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <EmptyList text={"Maaf untuk saat ini, tidak ada data pengiriman."} />
        }
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      />
      {DeliveryStore.canAdd && (
        <Fab
          style={{
            bottom: 15,
          }}
          onPress={() => {
            nav.navigate("user/so/FormDelivery", {
              sales_order,
            });
          }}
        />
      )}
    </>
  );
});
