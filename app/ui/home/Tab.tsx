import {
  useIsFocused,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import GlobalStore from "app/model/global";
import SessionStore from "app/model/session";
import { EmptyRoutes, TabRoutes } from "app/routes/tabs";
import Fonts from "libs/assets/fonts";

import { ITheme } from "libs/config/theme";
import { IRoute } from "libs/routes";
import { Button, Icon, Text } from "libs/ui";
import debounce from "lodash.debounce";
import { action, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import AppConfig from "app/config/app";
import { filter } from "lodash";

const update = debounce((meta: any) => {
  const dim = Dimensions.get("window");
  runInAction(() => {
    meta.wraper = !!meta.expandMenu ? dim.width : 60;
  });
}, 100);

export default observer(({ state, navigation }: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const isFocused = useIsFocused();
  const meta = useLocalObservable(() => ({
    top: 0 as any,
    backgroundColor: "rgba(0,0,0,0)",
    expandMenu: false,
    tempExpandMenu: false,
    menuList: [] as any,
    activeMenu: {
      label: "",
      path: "",
    },
    wraper: 55,
  }));
  const expandMenu = meta.expandMenu;

  const animate = useRef(new Animated.Value(0)).current;
  const bg = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });
  const opacity = animate.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [1, 0, 0, 1],
  });
  const transy = animate.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 100, 100, 0],
  });

  let ws = !!expandMenu ? (dim.width - (100 + 10 * 3)) / 3 : 50;
  let baseStyle: ViewStyle = {
    borderRadius: !!expandMenu ? 14 : 999,
    margin: !!expandMenu ? 20 : 0,
    backgroundColor: "transparent",
    height: ws,
    width: ws,
    flexDirection: "column",
    // borderWidth:1,
    paddingHorizontal: 0,
  };

  const filterRole = (x: IRoute) => {
    if (x.roles.length === 0) return true;
    let urole = SessionStore.role.menu_path.split(".");
    let role = SessionStore.package.menu_prefix + urole[2];
    //# DEBUG IDENTIFY ROLE HERE! 
    // console.log(SessionStore.package.menu_prefix)
    // console.log(JSON.stringify(urole))
    
     

    return x.roles.indexOf(role) > -1;
  };
  
  
  const menu = TabRoutes().filter(filterRole)??EmptyRoutes();
  
  console.log(JSON.stringify(menu))

  useEffect(() => {
    if (!!isFocused) {
      let activeRoute = state.routes[state.index];
      let currentMenu = menu.find((x) => x.name === activeRoute.name);
      let cmenu = menu;
      if (!expandMenu && cmenu.length > 4) {
        cmenu = cmenu.slice(0, 4);
      }
      let actMenu: any = menu.find(
        (x) => !!currentMenu && x.name === currentMenu.name
      );
      const exMenu = cmenu.find(
        (x) => !!currentMenu && x.name === currentMenu.name
      );
      if (!exMenu && !expandMenu) {
        cmenu[cmenu.length - 1] = actMenu;
      }
      const path = currentMenu?.name || "";
      const title = currentMenu?.title || "";
      const icon = currentMenu?.icon || {};
      runInAction(() => {
        meta.menuList = cmenu;
        GlobalStore.activeMenu = {
          label: title || path,
          path,
          icon,
        };
      });
      if (!!expandMenu) {
        runInAction(() => {
          meta.top = 0;
          meta.backgroundColor = "rgba(0,0,0,0.3)";
        });
      } else {
        runInAction(() => {
          meta.backgroundColor = "rgba(0,0,0,0)";
          meta.top = undefined;
        });
      }
    }
  }, [expandMenu, isFocused, state]);

  useEffect(() => {
    if (!!meta.tempExpandMenu) {
      Animated.spring(animate, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animate, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [meta.tempExpandMenu]);

  useEffect(() => {
    if (state.index > -1) {
      let activeRoute = state.routes[state.index];
      let currentMenu = menu.find((x) => x.name === activeRoute.name);
      //console.log(menu, currentMenu);
      if (!currentMenu) {
        if (!!currentMenu?.name) {
          currentMenu = menu[0];
          navigation.jumpTo(currentMenu.name);
        } else {
          navigation.jumpTo("InitPage");
        }

      }
      runInAction(() => {
        if (!!currentMenu) {
          GlobalStore.activeMenu = {
            label: currentMenu.title || currentMenu.name,
            path: currentMenu.name,
            icon: currentMenu.icon || {},
          };
        }
      });
    }
    animate.addListener((s) => {
      if (
        (!meta.tempExpandMenu && s.value > 0.5) ||
        (s.value < 0.5 && !!meta.tempExpandMenu)
      ) {
        runInAction(() => {
          meta.wraper = !!meta.expandMenu ? dim.width : 60;
          meta.expandMenu = meta.tempExpandMenu;
        });
      }
    });

    return () => animate.removeAllListeners();
  }, []);

  return (
    <>
      <Animated.View
        style={{
          backgroundColor: "#000000",
          opacity: bg,
          position: "absolute",
          top: !meta.tempExpandMenu ? undefined : 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {!!meta.tempExpandMenu && (
          <TouchableOpacity
            style={{
              height: dim.height,
              width: dim.width,
              backgroundColor: "transparent",
            }}
            onPress={() =>
              runInAction(() => {
                meta.tempExpandMenu = !meta.tempExpandMenu;
              })
            }
            activeOpacity={1}
          />
        )}
      </Animated.View>
      <Animated.View
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 10,
          // borderRadius: !!meta.expandMenu ? 25 : 0,
          borderTopEndRadius: !!meta.expandMenu ? 25 : 0,
          borderTopStartRadius: !!meta.expandMenu ? 25 : 0,
          padding: 5,
          paddingHorizontal: 5, //AppConfig.mode=="dev"?5:15,
          justifyContent: !!meta.expandMenu ? "flex-start" : "space-between",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity,
          transform: [
            {
              translateY: transy,
            },
          ],
        }}
      >
        <RenderMenu meta={meta} state={state} baseStyle={baseStyle} />
        {/* {AppConfig.mode=="dev" && */}
        <>
          <Button
            mode="clean"
            style={baseStyle}
            onPress={() =>
              runInAction(() => {
                meta.tempExpandMenu = !meta.tempExpandMenu;
              })
            }
          >
            <Icon
              name={!!expandMenu ? "ios-close" : "menu"}
              size={!!expandMenu ? 22 * 1.5 : 22}
              style={{
                margin: 0,
              }}
              color="#CCCCCC"
            />
            {!!expandMenu && (
              <Text
                style={{
                  fontSize: 14,
                  color: "#CCCCCC",
                  textAlign: "center",
                }}
                numberOfLines={2}
                ellipsizeMode={"tail"}
              >
                Minimize
              </Text>
            )}
          </Button>
        </>
        {/* //  } */}

      </Animated.View>
    </>
  );
});

const RenderMenu = observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const { meta, state, baseStyle } = props;
  const nav = useNavigation();
  const expandMenu = meta.expandMenu;

  return (
    <>
      {meta.menuList.map((item: IRoute, key: number) => {
        if (!item) return null;
        const active = state.routes[state.index].name === item.name;
        let actStyle: ViewStyle = {
          backgroundColor: !!active ? "transparent" : "transparent",
        };
        const RenderIcon = () => {
          const icon: any = item.icon;
          const size = icon.size || 24;
          if (!!icon) {
            if (typeof icon === "object") {
              return (
                <Icon
                  {...icon}
                  name={icon.name}
                  size={
                    !!expandMenu ? Number(size || 0) * 1.5 : Number(size || 0)
                  }
                  style={{
                    margin: 0,
                  }}
                  color={active ? Theme.colors.primary : "#CCCCCC"}
                />
              );
            }
          } else {
            return icon;
          }

          return null;
        };
        const RenderTitle = () => {
          // if (!!expandMenu) {
          return (
            <Text
              style={{
                fontSize: expandMenu ? 12 : 8,
                color: active ? Theme.colors.primary : "#CCCCCC",
                textAlign: "center",
                fontFamily: Fonts.poppins,
              }}
              numberOfLines={expandMenu ? 2 : 1}
              ellipsizeMode={"tail"}
            >
              {item.title}
            </Text>
          );
          // }
          return null;
        };
        return (
          <Button
            key={String(key)}
            mode="clean"
            style={StyleSheet.flatten([baseStyle, actStyle])}
            onPress={action(() => {
              nav.navigate(item.name);
              if (!!expandMenu) {
                runInAction(() => {
                  meta.tempExpandMenu = !meta.tempExpandMenu;
                });
              }
            })}
          >
            <RenderIcon />
            <RenderTitle />
          </Button>
        );
      })}
    </>
  );
});
