import { Image, Screen, Spinner, TopBar, View, WebView } from "libs/ui";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import get from "lodash.get";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import { Dimensions } from "react-native";
import { ITheme } from "libs/config/theme";
import { toJS } from "mobx";

export default observer(() => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("window");
  const nav = useNavigation();
  const route = useRoute();
  const { data, onGoBack }: any = route.params || {};
  let zoom = 100;
  let source = data.source;
  let props = data.props || {};
  if (source.html) {
    source.html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 15px;">
          ${data.source.html}
        </body>
      </html>`;
  }
  const style = get(data, "style", {});

  const webviewReload = useRef();

  return (
    <Screen>
      <TopBar
        enableShadow={true}
        backButton={true}
        actionBackButton={() => {
          if (!!onGoBack) {
            onGoBack();
          } else {
            nav.goBack();
          }
        }}
        styles={{
          title: {
            paddingTop: 2
          }
        }}
      >
        {data.title}
      </TopBar>
      <WebView
        ref={ref => {
          webviewReload.current = ref
        }}
        source={source}
        onNavigationStateChange={(event) => {
          if (event.url.includes("?r=site/login")) {
            nav.goBack()
          }
        }}

        textZoom={zoom}
        style={{
          flex: 1,
          ...style,
        }}
        // onMessage={(event:any)=>{
        //   console.log("->")
        //   console.log(JSON.stringify(event))
        // }}
        onLoad={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          if (nativeEvent.title == "") {
            webviewReload.current.reload();
          }
        }}
        originWhitelist={['http://', 'https://']}
        loadingImage={require("app/assets/images/splash.png")}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        sharedCookiesEnabled={true}
        renderLoading={() => {
          return (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}

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
                style={{
                  alignSelf: "center",
                }}
                color={Theme.colors.primary}
              ></Spinner>
            </View>
          );
        }}
        {...props}
      />
    </Screen>
  );
});
