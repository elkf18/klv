import { useNavigation, useTheme } from "@react-navigation/native";
import AppConfig from "app/config/app";
import SessionStore from "app/model/session";
import codePushOptions from "libs/config/code-push";
import { ITheme } from "libs/config/theme";
import { Button, Icon, Screen, ScrollView, Text, TopBar, View } from "libs/ui";
import { IIcon } from "libs/ui/Icon";
import { action, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import codePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";
import Update from "../ui/setting/Update";
import { ToastAndroid } from "react-native";
import Activity from "./Activity";
import ActivityStore from "app/model/activity";
import Fonts from "libs/assets/fonts";
import DetailItemStretch from "app/ui/utils/DetailItemStretch";
import colors from "app/config/colors";

const PushNotification = require('../../node_modules/react-native-push-notification');

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();
  const meta = useLocalObservable(() => ({
    update: false,
    checkUpdate: false,
    progress: "",
  }));
  const handleUpdate = action(async () => {
    try {
      runInAction(() => (meta.checkUpdate = true));
      codePush
        .checkForUpdate(codePushOptions.deploymentKey)
        .then((update) => {
          if (!update) {
            alert("Already updated.");
            runInAction(() => (meta.checkUpdate = false));
          } else {
            runInAction(() => (meta.update = true));
            update
              .download((progress: any) => {
                if (!!progress) {
                  let dl = (progress.receivedBytes / progress.totalBytes) * 100;
                  runInAction(() => (meta.progress = `(${dl.toFixed(1)}%)`));
                  if (dl == 100) {
                    runInAction(() => (meta.checkUpdate = false));
                    meta.checkUpdate = false;

                    setTimeout(() => {
                      codePush.restartApp();
                    }, 100);
                  }
                }
              })
              .catch((e) => {
                runInAction(() => (meta.checkUpdate = false));
                console.log(e);
              });
          }
        })
        .catch((e) => {
          runInAction(() => (meta.checkUpdate = false));
          console.log(e);
        });
    } catch (e) {
      runInAction(() => (meta.checkUpdate = false));
      // handle or log error
      console.log(e);
    }
  });


  const handleNotif = action(async () => {

    ToastAndroid.show("Notif will start in 3 secs", ToastAndroid.LONG);

    console.log(new Date(Date.now() + (3 * 1000)))
    PushNotification.localNotificationSchedule({

      id: 1,
      channelId: "channel-idX", // (required)
      channelName: "My channelX", // (required)
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + (5 * 1000)), // in millisecs
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.

    });

  });

  const handleRemainder = action(async () => {

    console.log("remainder")
    await ActivityStore.loadRemainder()
    ToastAndroid.show("Success", ToastAndroid.LONG);


  });

  const handleUserGuide = action(async () => {
    console.log("http://docs.google.com/gview?embedded=true&url=" + AppConfig.serverUrl + "repo/userguide_crm.pdf")
    nav.navigate("MediaWebView", {
      data: {
        title: "User Guide",
        source: {
          // uri: "https://docs.google.com/gview?embedded=true&url=dev.kelava.id/sfa/repo/userguide_crm.pdf",
          uri: "http://docs.google.com/gview?embedded=true&url=" + AppConfig.serverUrl + "repo/userguide_crm.pdf"
        },
        style: {
          padding: 15,
        },
      },
    });

  })
  const menu = [
    // {
    //   label: "Ubah Sandi",
    //   action: () => nav.navigate("changePassword"),
    //   icon: {
    //     name: "md-key",
    //   } as IIcon,
    // },
    {
      label: "Print",
      action: () => nav.navigate("printer"),
      icon: {
        source: "AntDesign",
        name: "printer",
      } as IIcon,
    },
    {
      label: "Check new update",
      action: handleUpdate,
      icon: {
        name: "system-update",
        source: "MaterialIcons",
      } as IIcon,
    },
    // {
    //   label: "Check Notif",
    //   action: handleNotif,
    //   icon: {
    //     name: "notifications",
    //     source: "MaterialIcons",
    //   } as IIcon,
    // },
    // {
    //   label: "Update Reminder",
    //   action: () => handleRemainder(),
    //   icon: {
    //     source: "MaterialIcons",
    //     name: "notifications",
    //     size: 18,
    //   } as IIcon,
    // },
    {
      label: "User Guide",
      action: () => handleUserGuide(),
      icon: {
        source: "MaterialIcons",
        name: "picture-as-pdf",
        size: 18,
      } as IIcon,
    },
    {
      label: "Keluar",
      action: () => SessionStore.logout(),
      icon: {
        source: "AntDesign",
        name: "logout",
        size: 18,
      } as IIcon,
    },
  ];

  return (
    <Screen
      statusBar={{
        backgroundColor: Theme.colors.primary,
        barStyle: "light-content",
      }}
    >
      <TopBar backButton styles={{
        title: {
          paddingTop: 3
        }
      }}>Setting</TopBar>
      <ScrollView
        style={{
          backgroundColor: "#fff",
        }}
        keyboardAvoidingProps={{
          style: {
            flexGrow: 1,
          },
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              margin: 16
            }}>
            <View
              style={{
                marginHorizontal: -10,
                paddingHorizontal: 10,

              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.poppinsbold,
                  alignSelf: "center",
                  marginBottom: 4
                }}>
                Account
              </Text>
              <DetailItemStretch label={"Name"} value={SessionStore.user.fullname}
                style={{
                  marginBottom: 4
                }}
              />

              <DetailItemStretch label={"Outlet"} value={SessionStore.outlet.nama}
              style={{
                marginBottom: 4
              }}/>

<DetailItemStretch label={"Package"} value={SessionStore.package.package_name}
              />
            </View>
          </View>
          {menu.map((item, key) => {
            return (
              <Button
                key={key}
                mode={"clean"}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 0,
                  justifyContent: "flex-start",
                  borderBottomWidth: 1,
                  borderColor: "#ddd",
                }}
                onPress={item.action}
              >
                <Icon
                  size={20}
                  color={Theme.colors.primary}
                  {...item.icon}
                ></Icon>
                <Text
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {item.label}
                </Text>
              </Button>
            );
          })}
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
            }}
          >
            {"©"} {DeviceInfo.getApplicationName()}
          </Text>
          <Text
            style={{
              fontSize: 12,
              paddingBottom:80
            }}
          >
            v{DeviceInfo.getVersion()}
            {AppConfig.mode === "production" ? "" : "-dev"}
          </Text>
        </View>
      </ScrollView>
      <Update meta={meta} />
    </Screen>
  );
});
