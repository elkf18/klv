import { Button, Icon, TextInput, Text, TopBar, View } from "libs/ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import CustomerStore from "app/model/customer";
import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ITheme } from "libs/config/theme";

export default observer(
  ({ state, onGoBack, data = null, title, editButton = true }: any) => {
    const Theme: ITheme = useTheme() as any;
    const nav = useNavigation();

    const handleSrcBtn = action(() => {
      CustomerStore.filter.showSearch = !CustomerStore.filter.showSearch;
    });
    const handleEditBtn = () => {
      nav.navigate("user/customer/Form", {
        onGoBack: onGoBack,
        data: data,
      });
    };
    return (
      <TopBar
        style={{
          backgroundColor: Theme.colors.primary,
        }}
        backButton={!CustomerStore.filter.showSearch && true}
        rightAction={
          !CustomerStore.filter.showSearch && (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {editButton && !CustomerStore.filter.showSearch && (
                <Button
                  mode={"clean"}
                  style={{
                    margin: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    minWidth: 45,
                    backgroundColor: "#fff" + "40",
                  }}
                  onPress={handleEditBtn}
                >
                  <Icon name={"ios-create"} size={24} color={"#fff"} />
                </Button>
              )}
              <Button
                mode={"clean"}
                style={{
                  margin: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  minWidth: 45,
                  backgroundColor: "#fff" + "40",
                }}
                onPress={handleSrcBtn}
              >
                <Icon name={"ios-search"} size={24} color={"#fff"} />
              </Button>
            </View>
          )
        }
        styles={{
          title:{
            paddingTop:3
          }
        }}
      >
        {CustomerStore.filter.showSearch ? (
          <View
            type={"View"}
            style={{
              paddingLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "flex-start",
              minHeight: 45,
              height: 45,
            }}
          >
            <Icon
              source={"AntDesign"}
              name={"search1"}
              size={20}
              style={{
                margin: 0,
                marginRight: 8,
              }}
              color={"#fff"}
            ></Icon>
            <TextInput
              placeholder={"Search"}
              autoFocus={true}
              type={"text"}
              style={{
                flexGrow: 1,
                color: "#fff",
              }}
              value={state.search}
              onChangeText={(value: any) => {
                state.search = value;
              }}
              onBlur={handleSrcBtn}
            ></TextInput>

            <Button
              mode={"clean"}
              style={{
                margin: 0,
                paddingLeft: 0,
                paddingRight: 0,
                minWidth: 45,
                backgroundColor: "transparent",
              }}
              onPress={handleSrcBtn}
            >
              <Icon name={"ios-close-circle"} size={24} color={"#fff"} />
            </Button>
          </View>
        ) : (
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              paddingLeft: 10,
              flexGrow: 1,
            }}
          >
            {title ? title : "Detail"}
          </Text>
        )}
      </TopBar>
    );
  }
);
