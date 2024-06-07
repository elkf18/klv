import Fonts from "libs/assets/fonts";
import { Text } from "libs/ui";
import { moneyFormat } from "libs/utils/string-format";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

export default observer(({ meta }: any) => {
  const dim = Dimensions.get("window");
  let total = 0;
  meta.salesFunnel.map((x: any) => (total += Number(x.nilai)));

  const presentationSale  = meta.reversedSalesFunnel.map((x: any) => Number(x.nilai) / total);

  let data = {
    data: presentationSale,
    labels: meta.salesFunnel.map((x: any) => x.tahapan), // optional
    };
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(7, 104, 159, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  if (Array.isArray(meta.salesFunnel) && meta.salesFunnel.length == 0 && !data)
    return null;

  if (meta.salesFunnel.length<=1 && Number.isNaN(presentationSale[0]))
    return null;

  return (
    <View
      style={{
        padding: 15,
        paddingVertical: 5,
      }}
    >
      <View
        style={{
          padding: 15,
          backgroundColor: "#fafafa",
          borderBottomWidth: 1,
          borderColor: "#dfdfdf",
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.NunitoBold,
            fontSize: 18,
          }}
        >
          Sales Funnel (Open Status)
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <ProgressChart
          data={data}
          width={dim.width - 30}
          height={(3 / 4) * dim.width}
          strokeWidth={15}
          radius={25}
          chartConfig={chartConfig}
          hideLegend={true}

          style={{
            height: (3 / 4) * dim.width,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        />
        <View
          style={{
            padding: 15,
          }}
        >
          {Array.isArray(meta.salesFunnel) &&
            meta.salesFunnel.map((item: any, index: number) => {
              let l = meta.salesFunnel.length;
              let op = 1 / (l - (index + 1) + 1) + 0.3;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 5,
                  }}
                >
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 99,
                      backgroundColor: `rgba(7, 104, 159, ${op})`,
                      marginVertical: 5,
                      marginRight: 15,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        color: "#333",
                      }}
                    >
                      {item.tahapan} :{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.NunitoBold,
                        color: "#07689F",
                      }}
                    >
                      {moneyFormat(item.nilai, "Rp. ")} (
                      {((Number(item.nilai) / total) * 100).toFixed(2)}%)
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
});
