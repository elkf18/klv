import { useNavigation, useTheme } from "@react-navigation/native";
import GlobalStore from "app/model/global";
import { TabRoutes } from "app/routes/tabs";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import { Button,  Icon, Text, TextInput, TopBar, View } from "libs/ui";
import DateTime from "../utils/DateTime";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";

export default observer((props: any) => {
  const handleSrcBtn = action(() => {
    props.filter.search="";
    props.filter.showSearch = !props.filter.showSearch;
  });

  return (
    <TopBar
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 10,
      }}
      rightAction={<Action {...props} handleSrcBtn={handleSrcBtn} />}
    >
      <DetailHead {...props} handleSrcBtn={handleSrcBtn} />
    </TopBar>
  );
});

const DetailHead = observer(({ filter, handleSrcBtn,title }: any) => {
  const Theme: ITheme = useTheme() as any;

  if (!!filter?.showSearch)
    return (
      <View
        //type={"View"}
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
          color={"#818181"}
        ></Icon>
        <TextInput
          placeholder={"Search"}
          autoFocus={true}
          type={"text"}
          style={{
            flexGrow: 1,
          }}
          value={filter.search}
          onChangeValue={(value: string) => {
            runInAction(() => (filter.search = value));
          }}
          onBlur={() => handleSrcBtn()}
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
          onPress={() => handleSrcBtn()}
        >
          <Icon name={"ios-close-circle"} size={24} color={"#333333"} />
        </Button>
      </View>
    );
  return (
    <>
      {/* {!!GlobalStore.activeMenu.icon && (
        <Icon
          {...(GlobalStore.activeMenu.icon as any)}
          color={Theme.colors.primary}
          size={28}
          style={{
            marginRight: 15,
          }}
        />
      )} */}
      <Text
        style={{
          color: "#000",
          fontSize: 20,
          fontFamily: Fonts.poppinsbold,
          flexGrow: 1,
          paddingTop:5,
        }}
      >
        
        {title||GlobalStore.activeMenu.label || ""}
      </Text>
    </>
  );
});

const Action = observer(
  ({ filter, disableSearch, disableDate, handleSrcBtn, enableImport=false,handleImport }: any) => {
    const Theme: ITheme = useTheme() as any;
    if (!filter?.showSearch)
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {!disableSearch && (
            <Button
              mode={"clean"}
              style={{
                margin: 0,
                paddingHorizontal: 0,
                minWidth: 45,
              }}
              onPress={() => handleSrcBtn()}
            >
              <Icon
                name={"ios-search"}
                size={24}
                color="#000"
              />
            </Button>
          )}
          {!disableDate && (
            <DateTime
              onChangeValue={(value: string) => {
                runInAction(() => (filter.date = value));
              }}
              styles={{
                label: {
                  display: "none",
                },
              }}
              iconProps={{
                color: "#000",
              }}
            />
          )}

          {(enableImport &&
            <Button
            mode={"clean"}
            style={{
              margin: 0,
              paddingHorizontal: 0,
              minWidth: 45,
            }}
            onPress={() => handleImport()}
          >
            <Icon
               name="contacts"
               source="AntDesign"
              size={24}
              color="#000"
            />
          </Button>
          )}
        </View>
      );
    return null;
  }
);
