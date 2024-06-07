import GlobalStore, { Device } from "app/model/global";
import { runInAction } from "mobx";
import { DeviceEventEmitter, Platform } from "react-native";
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";

const checkBT = () => {
  BluetoothManager.isBluetoothEnabled().then(
    (enabled: boolean) => {
      if (GlobalStore.enabledBT != enabled)
        runInAction(() => (GlobalStore.enabledBT = enabled));
      if (!!enabled && !!GlobalStore.connectedDV.address) {
        connectDV(GlobalStore.connectedDV);
      } else {
        GlobalStore.connectedDV;
      }
    },
    (err: string) => {
      console.log(err);
      GlobalStore.initConnectedDV();
    }
  );
};

const connectDV = (item: any) => {
  BluetoothManager.connect(item.address) // the device address scanned.
    .then(
      runInAction(() => {
        GlobalStore.connectedDV = item;
      }),
      (e: string) => {
        GlobalStore.initConnectedDV();
        console.log(e);
      }
    );
};
export default () => {
  checkBT();
  if (Platform.OS === "android") {
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_CONNECTION_LOST,
      () => {
        GlobalStore.initConnectedDV();
      }
    );
  }
};
