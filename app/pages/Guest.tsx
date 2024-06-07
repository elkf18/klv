import codePushOptions from "libs/config/code-push";
import useTheme from "libs/hooks/useTheme";

import { Button, Image, Screen, Spinner, Text, View } from "libs/ui";
import { action } from "mobx";
import { useLocalObservable } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";
import codePush from "react-native-code-push";
import Update from "./Update";

export default () => {
  const Theme = useTheme();
  const dim = Dimensions.get("window");
  const meta = useLocalObservable(() => ({
    update: false,
    checkUpdate: false,
    progress: "",
  }));
  const handleUpdate = action(async () => {
    try {
      meta.checkUpdate = true;
      codePush.checkForUpdate(codePushOptions.deploymentKey).then((update) => {
        if (!update) {
          alert("Already updated.");
          meta.checkUpdate = false;
        } else {
          meta.update = true;
          update.download((progress: any) => {
            if (!!progress) {
              let dl = (progress.receivedBytes / progress.totalBytes) * 100;
              meta.progress = `(${dl.toFixed(1)}%)`;
              if (dl == 100) {
                meta.checkUpdate = false;
                setTimeout(() => {
                  codePush.restartApp();
                }, 100);
              }
            }
          });
        }
      });
    } catch (e) {
      meta.checkUpdate = false;
      // handle or log error
      console.log(e);
    }
  });

  return (
    <Screen
      style={{
        backgroundColor: "white",
      }}
      statusBar={{
        backgroundColor: "white",
        barStyle: "dark-content",
      }}
    >
      <View
        style={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        type={"View"}
      >
        <Image
          source={require("app/assets/images/splash.png")}
          style={{
            width: dim.width,
            height: dim.width / 2,
            marginBottom: 20,
          }}
        ></Image>
        <Spinner
          size={"large"}
          style={{
            alignSelf: "center",
          }}
          color={Theme.colors.primary}
        ></Spinner>
        <Text>Guest</Text>
        <Button onPress={handleUpdate}>
          <Text
            style={{
              color: "white",
            }}
          >
            Check Update
          </Text>
        </Button>
      </View>
      <Update meta={meta} />
    </Screen>
  );
};
