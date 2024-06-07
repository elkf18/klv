import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";

export const SampleReceipt = async () => {
  await BluetoothEscposPrinter.printerAlign(
    BluetoothEscposPrinter.ALIGN.CENTER
  );
  
  await BluetoothEscposPrinter.setBlob(0);
  await BluetoothEscposPrinter.printText("Lorem Ipsum\r\n", {
    encoding: "GBK",
    codepage: 0,
    widthtimes: 1,
    heigthtimes: 1,
    fonttype: 1,
  });
  await BluetoothEscposPrinter.printText("\r\n\r\n", {});
  await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
  await BluetoothEscposPrinter.printText(
    "Lorem Ipsum adalah contoh teks atau dummy dalam industri percetakan dan penataan huruf atau typesetting.\r\n\r\n",
    {}
  );
  await BluetoothEscposPrinter.printText("\r\n\r\n", {
    encoding: "GBK",
    codepage: 0,
    widthtimes: 1,
    heigthtimes: 1,
    fonttype: 1,
  });
};
