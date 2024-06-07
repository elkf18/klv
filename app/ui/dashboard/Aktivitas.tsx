import Fonts from "libs/assets/fonts";
import { Text } from "libs/ui";
import DashboardStore from "app/model/dashboard";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions, View } from "react-native";

export default observer(() => {
  const dim = Dimensions.get("window");
  const meta = DashboardStore.activity;
  let data = {
    labels: meta.map((x: any) => x.sales), // optional
    datasets: [
      {
        data: meta.map((x: any) => Number(x.aktivitas)),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
    ],
    barColors: ["red", "green", "blue"],
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
          Jumlah Aktivitas
        </Text>
      </View>
      {/* <BarChart
        values={data}
        width={dim.width - 30}
        height={dim.width - 30}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        yAxisSuffix=""
        yAxisLabel=""
      /> */}
    </View>
  );
});
