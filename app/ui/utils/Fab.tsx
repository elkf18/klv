import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import { Button, Icon } from "libs/ui";
import { observer } from "mobx-react";
import React from "react";

export default observer(({ onPress, iconProps, style, children }: any) => {
  const Theme: ITheme = useTheme() as any;
  return (
    <Button
      style={{
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 50,
        alignItems: "center",
        backgroundColor: Theme.colors.primary,
        height: 45,
        width: 45,
        minWidth: 45,
        position: "absolute",
        bottom: 80,
        right: 20,
        ...(style || {}),
      }}
      onPress={onPress}
      shadow={true}
    >
      {children ? (
        children
      ) : (
        <Icon
          source={"Ionicons"}
          name={"ios-add"}
          size={26}
          color={"#fff"}
          {...iconProps}
        />
      )}
    </Button>
  );
});
