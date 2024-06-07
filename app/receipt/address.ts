import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";

export const AddressReceipt = async (meta: any) => {
  if (!meta) return;
  const data = meta;

    await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT
    );
  
    await BluetoothEscposPrinter.printText("Alamat:\r\n", {});
    await BluetoothEscposPrinter.printText(`${meta.name}\r\n`, {});
    await BluetoothEscposPrinter.printText(`${meta.phone1}\r\n`, {});
    await BluetoothEscposPrinter.printText(`${meta.address}\r\n`, {});
    await BluetoothEscposPrinter.printText(`${meta.new_city+", "+meta.new_province+" - "+meta.new_country}\r\n\r\n\r\n`, {});
};
