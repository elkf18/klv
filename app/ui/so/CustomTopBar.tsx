
import colors from "app/config/colors";
import GlobalStore from "app/model/global";
import Fonts from "libs/assets/fonts";
import { Button, DateTime, Icon, Text, TopBar, View } from "libs/ui";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

export default observer((props: any) => {
  const handleSrcBtn = action(() => {
    props.filter.showSearch = !props.filter.showSearch;
    props.filter.search = "";
    runInAction(() => (props.filter.search = ""));
  });
  return (
    <TopBar
      backButton
      actionBackButton={props.onBack}
      rightAction={<Action {...props} handleSrcBtn={handleSrcBtn} />}
    >
      <DetailHead {...props} handleSrcBtn={handleSrcBtn} />
    </TopBar>
  );
});

const DetailHead = observer(({ filter, handleSrcBtn }: any) => {
  if (!!filter.showSearch)
    return (
      <View
        
        style={{
          paddingLeft: 10,
          flexDirection: "row",
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "flex-start",
          minHeight: 45,
          height: 45
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
          color={ colors.black}
        ></Icon>
        <TextInput
          placeholder={"Search"}
          placeholderTextColor="#d0d0d0"
          autoFocus={true}
          
          style={{
            flexGrow: 1,
            color: colors.black,
          }}
          value={filter.search}
          onChangeText={action((value: string) => {
            filter.search = value;
          })}
          // onBlur={() => handleSrcBtn()}
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
          <Icon name={"ios-close-circle"} size={24} color={"#000"} />
        </Button>
      </View>
    );
  return (
    <Text
      style={{
        color: colors.black,
        fontSize: 20,
        fontFamily: Fonts.poppinsbold,
        flexGrow: 1,
        paddingTop:2,
        textAlign:"center"
      }}
    >
      Pilih Produk
    </Text>
  );
});

const Action = observer(
  ({ filter, disableSearch, disableDate, handleSrcBtn }: any) => {
    if (!filter.showSearch)
      return (
        <View
          style={{
            flexDirection: "row",
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
              <Icon name={"ios-search"} size={24} color={colors.black} />
            </Button>
          )}
          
        </View>
      );
    return null;
  }
);
