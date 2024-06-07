import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useTheme } from "@react-navigation/native";
import OpportunityStore from "app/model/opportunity";
import Footer from "app/ui/opportunity/Footer";
import { getPath } from "app/ui/opportunity/getPath";
import TabList from "app/ui/opportunity/TabList";
import EmptyList from "app/ui/utils/EmptyList";
import Fab from "app/ui/utils/Fab";
import Filter from "app/ui/utils/Filter";
import MainTopBar from "app/ui/utils/MainTopBar";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { FlatList, Screen, Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import RenderItem from "../ui/opportunity/RenderItem";

const NavigationTab = createMaterialTopTabNavigator();

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
    <Screen
    statusBar={{
      barStyle: "dark-content",
      backgroundColor: "transparent",
    }}>
      {/* <NavigationTab.Navigator
        initialRouteName={getPath(OpportunityStore.firstStage)}
        tabBar={(props) => (
          <TabList tabs={OpportunityStore.getStage} {...props} />
        )}
        lazy={true}
        tabBarPosition={"top"}
        swipeEnabled={true}
      > */}
        
        {OpportunityStore.getStage.length > 0 ? 
        
        <NavigationTab.Navigator
          initialRouteName={getPath(OpportunityStore.firstStage)}
          tabBar={(props) => (
            <TabList tabs={OpportunityStore.getStage} {...props} />
          )}
          lazy={true}
          tabBarPosition={"top"}
          swipeEnabled={true}
        >
        {OpportunityStore.getStage.map((tab: any, key: number) => (
          <NavigationTab.Screen
            key={key}
            name={getPath(tab)}
            children={(props: any) => (
              <Screen
              
                statusBar={{
                  barStyle: "dark-content",
                  backgroundColor: "transparent",
                }}>
                <Component {...props} tab={tab} refreshControl={refreshControl} />
              </Screen>
              
            )}
          />
        ))}

        </NavigationTab.Navigator>
         : 
         <>
         <MainTopBar filter={OpportunityStore.filter} disableDate={true} />
          <EmptyList text={"Maaf untuk saat ini, tidak ada opportunity."} />    
          </>
      }
        
      {/* </NavigationTab.Navigator> */}
      <View
        style={{
          paddingHorizontal: 15,
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        {/* <View
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
        </View> */}
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
      </Screen>
    </>
  );
});

const Component = observer((props: any) => {
  const { refreshControl, tab } = props;
  const nav = useNavigation();

  return (
    <>
    <Screen
    statusBar={{
      barStyle: "dark-content",
      backgroundColor: "transparent",
    }}>
    <FlatList
        refreshControl={refreshControl}
        data={OpportunityStore.getListStage(tab.value)}
        renderItem={({ item }: any) => {
          return <RenderItem item={item} tab={tab} />;
        }}
        keyExtractor={(item: any) => String(item.id)}
        ListEmptyComponent={
          <Screen
          statusBar={{
            barStyle: "dark-content",
            backgroundColor: "transparent",
          }}>
            <EmptyList text={"Maaf untuk saat ini, tidak ada opportunity."} />
          </Screen>
          
        }
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        ListHeaderComponent={() => <Footer tab={tab} />}
      />
    </Screen>
      
    </>
  );
});
