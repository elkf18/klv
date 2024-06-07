import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import { Button, Text } from "libs/ui";
import DateTimeView, { IDateTimeView } from "libs/ui/DateTime/DateTimeView";
import { generateDate } from "libs/ui/DateTime/generator";
import Icon, { IIcon } from "libs/ui/Icon";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";



import { color } from "react-native-reanimated";

export interface IDateTime {
  value?: string;
  format?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  labelFormat?: string;
  type?: "date" | "time" | "datetime" | "monthly" | "yearly";
  display?: "default" | "spinner" | "calendar" | "clock";
  editable?: boolean;
  onChange?: (ev: any, date: Date) => void;
  onChangeValue?: (value: string) => void;
  onBlur?: () => void;
  styles?: {
    label?: TextStyle;
    wraper?: ViewStyle;
  };
  iconProps?: Partial<IIcon>;
  dateProps?: IDateTimeView;
  Label?: (props: any) => ReactElement;
}

export default observer((props: IDateTime) => {
  const meta = useLocalObservable(() => ({
    visible: false,
  }));

  const cprops: any = generateDate(props, meta);
  const cstyle = StyleSheet.flatten([
    {
      paddingHorizontal: 5,
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    cprops?.styles?.wraper,
  ]);

  return (
    <>
      <Button mode="clean" onPress={cprops?.switchCalendar} style={cstyle}>
        <DateLabel {...cprops} meta={meta} />
      </Button>
      <DateTimeView {...cprops.dateProps} />
    </>
  );
});

const DateLabel = observer((props: any) => {
  const { label, value, iconProps, styles, Label } = props;
  const Theme: ITheme = useTheme() as any;
  const labelStyle = StyleSheet.flatten([
    {
      flexGrow: 1,
      color:!!value?"#000":"#cccccc"
    },
    styles?.label,
  ]);

  if (!!Label) {
    return Label({ label, value });
  }

  return (
    <>
      <Text style={labelStyle}>{!!value?label:"Pilih Tanggal / Waktu"}</Text>
      {/* {!!value?label:"Pilih Tanggal / Waktu"} */}
      {/* {label} */}
      {/* {!!value?label:"Pilih Tanggal / Waktu"} */}
      <Icon name="md-calendar" color={Theme.colors.text} {...iconProps} />
    </>
  );
});
