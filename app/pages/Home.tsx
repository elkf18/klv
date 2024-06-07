import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Screen } from "libs/ui";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Tab from "app/ui/home/Tab";
import { PosTabInitialStack, TabInitialStack, TabRoutes } from "app/routes/tabs";
import { IRoute } from "libs/routes";
import { ITheme } from "libs/config/theme";
import { useTheme } from "@react-navigation/native";
import SessionStore from "app/model/session";

const NavigationTab = createBottomTabNavigator();
import {
  useNavigation
  
} from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';
import SalesStore from "app/model/sales";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  // Check whether an initial notification is available
  messaging().getInitialNotification()
  .then(payload => {
    
    
    
    if(!!payload){
      let item = payload.data;
      switch (item.type) {
        case "BIRTHDAY":
          //CustomerStore.detail.load(item.ref_data);
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
    }else{

    }
  });

  return (
    <Screen
    statusBar={{
      barStyle: "dark-content",
      backgroundColor: "transparent",
    }}
    >
      <NavigationTab.Navigator
        //{...TabInitialStack}
        {...(SessionStore.package.menu_prefix=="pos_"?PosTabInitialStack:TabInitialStack)}
        tabBar={(props) => <Tab {...props} />}
        lazy={true}
        sceneContainerStyle={{
          backgroundColor: Theme.colors.background,
        }}
      >
        {TabRoutes().map(
          (item: IRoute) =>
            !!item.component && (
              <NavigationTab.Screen
                key={item.name}
                name={item.name}
                component={item.component}
              />
            )
        )}
      </NavigationTab.Navigator>
    </Screen>
  );
});
