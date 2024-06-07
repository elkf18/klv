import Fonts from "libs/assets/fonts";

import { Button, Icon, Text, View } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { ITheme } from "libs/config/theme";
import colors from "app/config/colors";
import { dateFormat } from "libs/utils/date";
import SessionStore from "app/model/session";

export default observer(({ item }: any) => {
  const Theme: ITheme = useTheme() as any;
  const nav = useNavigation();

  const today = () => {

    return dateFormat(new Date(), "EEEE") + " " + openToday()
  }

  const openToday = () => {
    let open = ""
    let close = ""
    switch (dateFormat(new Date(), "EEEE")) {
      case "Senin": {
        open = item.mon_start
        close = item.mon_end
        break;
      }
      case "Selasa": {
        open = item.tue_start
        close = item.tue_end
        break;
      }
      case "Rabu": {
        open = item.wed_start
        close = item.wed_end
      }
      case "Kamis": {
        open = item.thu_start
        close = item.thu_end
        break;
      }
      case "Jumat": {
        open = item.fri_start
        close = item.fri_end
        break;
      }
      case "Sabtu": {
        open = item.sat_start
        close = item.sat_end
        break;
      }
      case "Minggu": {
        open = item.sun_start
        close = item.sun_end
        break;
      }
    }

    return dateFormat("2020-01-01 " + open, "HH:mm") + " - " + dateFormat("2020-01-01 " + close, "HH:mm")
  }



  const status = () => {
    let status = "Tutup";
    const today = new Date();
    const day = dateFormat(today, "EEE", "en").toLowerCase();

    try {
      const open = (item)[day + "_start"].split(":");
      const close = (item)[day + "_end"].split(":");

      const currentTime = today.getTime();
      const openTime = new Date(dateFormat(today, "yyyy-MM-dd")).setHours(
        open[0] || 0,
        open[1] || 0,
        open[2] || 0
      );
      const closeTime = new Date(dateFormat(today, "yyyy-MM-dd")).setHours(
        close[0] || 0,
        close[1] || 0,
        close[2] || 0
      );

      if (
        !isNaN(currentTime) &&
        !isNaN(openTime) &&
        !isNaN(closeTime) &&
        currentTime >= openTime &&
        currentTime <= closeTime
      ) {
        status = "Buka";
      } else {
        const diff = 1 * 60 * 1000;
        let soonTime = openTime - currentTime;
        if (!!open && !!close && soonTime > 0 && soonTime <= diff) {
          status = "Segera Buka";
        } else {
          status = "Tutup";
        }
      }
    }
    catch (exception_var) {

    }
    return status;
  }

  return (
    <Button
      style={{
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        marginBottom: 10,
        display: "flex",
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 6,
        overflow: "hidden",
        padding: 10,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
      onPress={() => {
        nav.navigate("user/outlet/Detail", {
          id: item.id,
        });
      }}
    >{openToday()!==" - " &&
      <>
        <View style={{ flexDirection: "row" }}>

          <Text
            style={{
              fontSize: 12,
              color: colors.black,
              marginRight: 10,
              fontFamily: Fonts.poppins,
            }}
            lineBreakMode={"tail"}
            numberOfLines={1}
          >
            {today()}
          </Text>
          <Text
            style={{
              fontSize: 10,
              paddingHorizontal: 4,
              paddingVertical: 2,
              color: colors.black,
              fontFamily: Fonts.poppins,
              backgroundColor: status() == "Buka" ? colors.secondary : colors.cardBorder,
              borderRadius: 2
            }}
            lineBreakMode={"tail"}
            numberOfLines={1}
          >
            {status()}
          </Text>
        </View>

      </>}
      <View>
        <Text
          style={{
            fontSize: 16,
            color: colors.black,
            marginRight: 40,
            fontFamily: Fonts.poppinsmedium,
          }}
          lineBreakMode={"tail"}
          numberOfLines={1}
        >
          {item.nama}
        </Text>
      </View>
      <Text
        style={{
          color: "#808080",
          flex: 1,
          fontSize: 14,
          fontFamily: Fonts.poppins,
          marginTop: 5
        }}
      >
        {item.kodearea}
      </Text>


      {/* <Text
        style={{
          fontFamily: Fonts.RobotoBold,
        }}
      >
        {item.alamat}
      </Text> */}
      {/* <Icon
        name="layers"
        size={40}
        color={"#ddd"}
        style={{
          position: "absolute",
          right: 5,
          bottom: 5,
        }}
      /> */}
    </Button>
  );
});
