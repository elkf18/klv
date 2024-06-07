import Fonts from "libs/assets/fonts";
import { Button, Icon, Text, View } from "libs/ui";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import React from "react";
import NotificationStore, { Data, Notification } from "app/model/notification";
import { runInAction } from "mobx";
import CustomerStore from "app/model/customer";
import SalesStore from "app/model/sales";

export default observer((props: any) => {
  const item: Data = props.item;
  const nav = useNavigation();

  const goToDetail = () => {
    if (!item.isRead) {
      runInAction(() => (item.isRead = true));
    }
    switch (item.type) {
      case "BIRTHDAY":
        CustomerStore.detail.load(item.ref_data);
        nav.navigate("user/customer/Detail", {
            id: item.ref_data
          });
        break;
        case "NEXT ORDER":
         SalesStore.detail.load(item.ref_data);
          nav.navigate("user/so/Form", {
            id_product: item.ref_data,
            id_customer: item.ref_data_ii
          });
          break;

      default:
        // NotificationStore.detail.init(item._json);
        // nav.navigate("DetailInbox");
        break;
    }
  };

  return (
    <Button
      mode="clean"
      style={{
        borderRadius: 0,
        margin: 0,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomColor:"#CCCCCC",
        borderBottomWidth:1
      }}
      onPress={goToDetail}
    >
      {!item.isRead && (
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: "red",
            borderRadius: 99,
            marginTop: 10,
            marginRight: 10,
          }}
        />
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.poppinsbold,
            paddingVertical: 5,
          }}
        >
          {/* {!!item.type?"("+item.type+")":""}  */}
          {item.msg_i}
        </Text>
        <Text
          style={{
            fontSize: 12,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.msg_ii} {item.ref_data}
        </Text>
      </View>
    </Button>
  );
});
