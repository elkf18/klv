import { Button, CodePush, Icon, Text, View } from "libs/ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import SessionStore from "app/model/session";
import { observer } from "mobx-react";
import React from "react";
import { DefaultTheme, ITheme } from "libs/config/theme";
import { dateFormat } from "libs/utils/date";
import Fonts from "libs/assets/fonts";
import { moneyFormat } from "libs/utils/string-format";
import DashboardStore from "app/model/dashboard";
import { TouchableOpacity } from "react-native-gesture-handler";

export default observer(({ item, modul }: any) => {
    const Theme: ITheme = useTheme() as any;
    const nav = useNavigation();

    const pallete = {
        "Penjualan": {
            "main": "#00B3FF",
            "over": "#055B80",
            "last": "#DCDCDC"

        },
        "New": {
            "main": "#00B3FF",
            "over": "#055B80",
            "last": "#DCDCDC"
        },
        "Won": {
            "main": "#52CC3D",
            "over": "#338026",
            "last": "#DCDCDC"
        },
        "Lose": {
            "main": "#FF6666",
            "over": "#803333",
            "last": "#DCDCDC"
        },
    }


    return (
        <View
            style={{
                backgroundColor: "#fffa",
                flexDirection: "column",
                margin: 5,
                marginTop: 0,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingBottom: 16,
                paddingTop: 8,
                marginHorizontal: 15,

                borderWidth: 1,
                borderColor: pallete[modul]["main"],
            }}
        >
            <View
                style={{
                    flexDirection: "row"
                }}>
                <Text
                    style={{
                        fontSize: 16,
                        fontFamily: Fonts.poppinsmedium,
                        color: "#575757",
                        flexGrow: 1

                    }}
                >
                    {modul}
                </Text>
                {((modul === "Penjualan") && (SessionStore.role.role_name.toLowerCase() !== "administrator" || SessionStore.package.id==1) 
                || modul === "New") &&

                

                    <TouchableOpacity
                        style={{
                            backgroundColor: pallete[modul]["main"],
                            paddingVertical: 4,
                            paddingHorizontal: 10,
                            borderRadius: 6
                        }}
                        onPress={() => {
                            if (modul === "Penjualan") {
                                nav.navigate("user/so/Form");
                            } else if (modul === "New") {
                                nav.navigate("user/opportunity/Form");
                            }
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: Fonts.poppinsmedium,
                                color: "#fff",
                                includeFontPadding: false

                            }}
                        >
                            + Buat
                        </Text>
                    </TouchableOpacity>
                }


            </View>


            <Text
                style={{
                    fontSize: 24,
                    color: pallete[modul]["main"],
                    marginRight: 40,
                    fontFamily: Fonts.poppinsmedium,

                }}
                lineBreakMode="tail"
                numberOfLines={2}
            >
                {moneyFormat(item.current, "Rp. ")}
            </Text>

            {item.percentage > 0 &&
                <View
                    style={{
                        width: "100%",
                        height: 18,
                        backgroundColor: item.percentage >= 100 ? pallete[modul]["over"] : pallete[modul]["last"],
                        marginVertical: 6,
                        borderRadius: 100,
                        flexDirection: "row"

                    }}
                >

                    <Text
                        style={{
                            fontSize: 10,
                            height: 18,
                            fontFamily: Fonts.poppinsmedium,
                            backgroundColor: pallete[modul]["main"],
                            color: "#fff",
                            flexGrow: item.percentage / 100,

                            textAlign: "center",
                            textAlignVertical:"center",
                            borderRadius: 100

                        }}
                        lineBreakMode="tail"
                        numberOfLines={1}
                    >
                        {item.percentage}%
                    </Text>
                    {item.over > 0 &&
                        <Text
                            style={{
                                fontSize: 10,
                                height: 18,
                                fontFamily: Fonts.poppinsmedium,
                                backgroundColor: pallete[modul]["over"],
                                color: "#fff",
                                flexGrow: item.over / 100,

                                textAlign: "center",
                                textAlignVertical:"center",

                                borderTopRightRadius: 100,
                                borderBottomRightRadius: 100,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,


                            }}
                            lineBreakMode="tail"
                            numberOfLines={1}
                        >
                            +{item.over}%
                        </Text>}


                </View>
            }



            <Text
                style={{
                    fontSize: 12,
                    color: "#8E8E8E",
                    marginRight: 40,
                    fontFamily: Fonts.poppinsmedium,


                }}
                lineBreakMode="tail"
                numberOfLines={2}
            >
                {dateFormat(DashboardStore.last_month, "MMMM yyyy")}{": "} {moneyFormat(item.last, "Rp. ")}
            </Text>



        </View>
    );
});
