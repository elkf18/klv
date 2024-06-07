import { useTheme } from "@react-navigation/native";
import GlobalStore from "app/model/global";
import { SampleReceipt } from "app/receipt/sample";
import Fonts from "libs/assets/fonts";
import { ITheme } from "libs/config/theme";
import {
  Button,
  Field,
  FlatList,
  Icon,
  Screen,
  ScrollView,
  Spinner,
  Text,
  TextInput,
  TopBar,
  View,
} from "libs/ui";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";
import { Alert, RefreshControl } from "react-native";
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";
import * as Location from "expo-location";
import EmptyList from "app/ui/utils/EmptyList";

export default observer(() => {

  const meta = useLocalObservable(() => ({
    isScanning: false,
  }));

  const switchBT = () => {
    if (GlobalStore.enabledBT) {
      disableBT();
    } else {
      enableBT();
    }
  };
  const disableBT = () => {
    BluetoothManager.disableBluetooth().then(
      () => {
        checkBT();
      },
      (err: string) => {
        console.log(err);
      }
    );
  };
  const enableBT = () => {
    BluetoothManager.enableBluetooth().then(
      (r: any[]) => {
        checkBT();
        const paired: any[] = [];
        r.map((x) => {
          if (typeof x === "string") {
            paired.push(JSON.parse(x));
          }
        });
        GlobalStore._loadJSON({
          pairedBT: paired,
        });
      },
      (err: string) => {
        console.log(err);
      }
    );
  };
  const checkBT = () => {
    BluetoothManager.isBluetoothEnabled().then(
      (enabled: boolean) => {
        if (GlobalStore.enabledBT != enabled)
          runInAction(() => (GlobalStore.enabledBT = enabled));
        if (!!enabled) {
          scanDV();
        }
      },
      (err: string) => {
        console.log(err);
      }
    );
  };
  const connectDV = async (item: any) => {
    if (
      !!GlobalStore.connectedDV &&
      item.address === GlobalStore.connectedDV.address
    ) {
      Alert.alert(
        "Printer sudah terhubung.",
        "Apakah anda ingin memutuskan koneksi dengan printer?",
        [
          {
            text: "Tidak",
          },
          {
            text: "Ya",
            onPress: () => {
              GlobalStore.initConnectedDV();
            },
          },
        ]
      );
    } else {
      await BluetoothManager.connect(item.address) // the device address scanned.
        .then(
          () => {
            GlobalStore._loadJSON({
              connectedDV: item,
            });
          },
          (e: string) => {
            alert(
              "Gagal terhubung dengan printer. Pastikan bluetooth menyala dan tersambung dengan perangat."
            );
            console.log(e);
            GlobalStore.initConnectedDV();
          }
        );
    }
  };
  const scanDV = async () => {
    runInAction(() => (GlobalStore.loadingScanDV = true));
    Location.hasServicesEnabledAsync().then((res:any) => {
      if (!res) {
        alert("Mohon hidupkan Lokasi/GPS anda.");
      }
    });

    meta.isScanning=true
    BluetoothManager.scanDevices().then(
      (s: string) => {
        var ss = JSON.parse(s); //JSON string
        GlobalStore._loadJSON({
          foundBT: ss.found,
          pairedBT: ss.paired,
          loadingScanDV: false,
        });
        meta.isScanning=false
      },
      (e: string) => {
        GlobalStore._loadJSON({
          loadingScanDV: false,
        });
        meta.isScanning=false
        console.log(e);
      }
    );
  };
  useEffect(() => {
    checkBT();
  }, []);

  return (
    <Screen>
      <TopBar
        backButton
        rightAction={
          <Button
            onPress={scanDV}
            style={{
              height: 40,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
            disabled={GlobalStore.loadingScanDV}
          >
            {!!GlobalStore.loadingScanDV ? (
              <Spinner color="#fff" size="small" />
            ) : (
              <Icon name="md-sync" color={"#fff"} />
            )}
          </Button>
        }
        styles={{
          title:{
            paddingTop:2
          }
        }}
      >
        Printer
      </TopBar>
      <View
        style={{
          padding: 15,
        }}
      >
        <Field
          label="Jumlah per cetak"
          path="printQty"
          value={String(GlobalStore.printQty)}
          onChange={(value) => {
            runInAction(() => (GlobalStore.printQty = value));
          }}
          styles={{
            field: {
              flexDirection: "row",
              alignItems: "center",
            },
          }}
          Suffix={
            <Text
              style={{
                width: 50,
                backgroundColor: "#ddd",
                height: 44,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 18,
                fontFamily: Fonts.NunitoBold,
              }}
            >
              X
            </Text>
          }
        >
          <TextInput
            type="number"
            style={{
              textAlign: "right",
              fontSize: 18,
              fontFamily: Fonts.NunitoBold,
            }}
          />
        </Field>
        <Text
          style={{
            color: "#333",
            marginBottom: 10,
          }}
        >
          Petunjuk:
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              color: "#777",
              marginRight: 10,
            }}
          >
            1.
          </Text>
          <Text
            style={{
              color: "#777",
            }}
          >
            Hidupkan dan hubungkan bluetooth dengan perangkat.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#777",
              marginRight: 10,
            }}
          >
            2.
          </Text>
          <Text
            style={{
              color: "#777",
            }}
          >
            Pilih printer pada daftar perangkat terhubung.
          </Text>
        </View>
        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.NunitoBold,
              flex: 1,
            }}
          >
            Perangkat Terhubung:
          </Text>
          {meta.isScanning==true &&
          <Spinner />
          }
          
        </View>
        
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingBottom: 15,
        }}
      >
        {!!GlobalStore.enabledBT ?
          <FlatList
            refreshControl={
            <RefreshControl
              refreshing={meta.isScanning}//scanDV
              onRefresh={() => {scanDV()}}
            />
          }
            data={GlobalStore.pairedBT}
            renderItem={({ item }: any) => <DeviceComp item={item} connectDV={connectDV} /> }
            keyExtractor={(_, index: number) => String(index)}
            ListEmptyComponent={
              <EmptyList text={"Tidak ada perangkat terhubung."} />
            }
            contentContainerStyle={{
              paddingBottom: 80,
            }}
          />
          : (
            <View
              style={{
                padding: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#aaa",
                }}
              >
                Mohon aktifkan bluetooth dahulu.
              </Text>
            </View>
          )}

        {/* {!!GlobalStore.enabledBT ? (
          GlobalStore.pairedBT.map((item, key) => {
            return <DeviceComp key={key} item={item} connectDV={connectDV} />;
          })
        ) : (
          <View
            style={{
              padding: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#aaa",
              }}
            >
              Mohon aktifkan bluetooth dahulu.
            </Text>
          </View>
        )} */}
      </View>
      <Button
        onPress={SampleReceipt}
        style={{
          margin: 15,
          paddingVertical: 15,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.NunitoBold,
            fontSize: 16,
            color: "#fff",
          }}
        >
          Coba Printer
        </Text>
      </Button>
    </Screen>
  );
});

const DeviceComp = observer((props: any) => {
  const { item, connectDV } = props;
  const Theme: ITheme = useTheme() as any;
  const meta = useLocalObservable(() => ({
    loading: false,
  }));
  let paired = false;
  if (
    !!GlobalStore.connectedDV &&
    GlobalStore.connectedDV.address === item.address
  ) {
    paired = true;
  }
  return (
    <Button
      mode={"clean"}
      style={{
        borderRadius: 0,
        justifyContent: "flex-start",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        paddingVertical: 15,
      }}
      onPress={async () => {
        runInAction(() => (meta.loading = true));
        await connectDV(item);
        runInAction(() => (meta.loading = false));
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.NunitoBold,
            fontSize: 15,
            marginBottom: 5,
            overflow: "hidden",
          }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={{
            color: "#aaa",
          }}
        >
          {item.address}
        </Text>
      </View>
      {meta.loading ? (
        <Spinner />
      ) : (
        !!paired && (
          <Icon size={30} color={Theme.colors.primary} name="md-pulse"></Icon>
        )
      )}
    </Button>
  );
});
