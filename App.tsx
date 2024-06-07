import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import Loading from "app/pages/Loading";
import {
  PrivateInitialStack,
  PrivateRoutes,
  PublicInitialStack,
  PublicRoutes,
} from "app/routes";
import PrivateService from "app/services/private-services";
import PublicService from "app/services/public-services";

import { IRoute } from "libs/routes";
import { AppProvider, CodePush, ReactNavigation } from "libs/ui";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import messaging from '@react-native-firebase/messaging';
import {
  useNavigation
  
} from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import SalesStore from "app/model/sales";

const loadingComponent = (props: any) => {
  return <Loading {...props} />;
};

export default observer(() => {
  const [initialStack, setInitialStack] = useState({});
  const [routes, setRoutes] = useState([] as IRoute[]);
  
  //const [initialRoute, setInitialRoute] = useState('Home');
  useEffect(() => {
    const authContext = SessionStore.AuthContext;
    if (!!authContext && !!authContext.isLoggedIn) {
      let nroutes = PrivateRoutes;
      if (!!authContext.role) {
        const userRole = authContext.role;
        const filterRoutes = (item: IRoute) => {
          if (item.roles.length === 0) return true;
          return (
            item.roles
              .map((role) => role.toLowerCase())
              .findIndex((role) => role === userRole.toLowerCase()) > -1
          );
        };

        nroutes = PrivateRoutes.filter(filterRoutes);
      }
      setInitialStack(PrivateInitialStack);
      setRoutes(nroutes);
      PrivateService();
    } else {
      setInitialStack(PublicInitialStack);
      setRoutes(PublicRoutes);
      PublicService();
    }
  }, [SessionStore.AuthContext]);


  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    

    messaging().onNotificationOpenedApp(remoteMessage => {
      const nav = useNavigation();
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      let item = remoteMessage.data!!
      switch (item.type) {
        case "BIRTHDAY":
          //CustomerStore.detail.load(item.ref_data);
          nav.navigate("user/customer/Detail", {
              id: item.ref_data
            });
          break;
          case "NEXT ORDER":
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
      //navigation.navigate(remoteMessage.data.type);
    });

    
  }, []);


  return (
    <AppProvider>
      <CodePush LoadingComponent={loadingComponent}>
        <ReactNavigation
          initialStack={initialStack}
          routes={routes}
          mode="default"
        />
      </CodePush>
    </AppProvider>
  );
});
