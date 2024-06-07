import { dateFormat } from "libs/utils/date";
import { capitalizeFLetter, moneyFormat } from "libs/utils/string-format";
import SessionStore from "app/model/session";
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";
import SunmiV2Printer from 'react-native-sunmi-v2-printer';
import GlobalStore from "app/model/global";
import OutletStore from "app/model/outlet";

const session = SessionStore;

export const SalesReceipt = async (meta: any) => {
  if (!meta) return;
  const data = meta;

  // const data = {
  //   sales_order_number: sv.res.penjualan.sales_order_number,
  //   sales_order_date: sv.res.penjualan.sales_order_date,
  //   customer: sv.res.penjualan,
  //   items: [
  //     {
  //       product: {
  //         name: "Kopi",
  //       },
  //       price: 25000,
  //       qty: 2,
  //       total: 50000,
  //     },
  //     {
  //       product: {
  //         name: "Nasi Goreng",
  //       },
  //       price: 15000,
  //       qty: 3,
  //       total: 45000,
  //     },
  //   ],
  //   subtotal: 95000,
  //   service: 0,
  //   ppn: 10,
  //   ppn_amount: 9500,
  //   grand_total: 104500,
  // };
  
  for (let index = 0; index < GlobalStore.printQty; index++) {
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText(`${SessionStore.client.client_name}\r\n\r\n`, {
      encoding: "GBK",
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 1,
      fonttype: 1,
    });
    await BluetoothEscposPrinter.printText(`${OutletStore.detail.nama}\r\n`, {
      encoding: "GBK",
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    });
    await BluetoothEscposPrinter.printText(`${OutletStore.detail.alamat}\r\n`, {
      encoding: "GBK",
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    });
    await BluetoothEscposPrinter.printText(
      "--------------------------------\r\n",
      {}
    );
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT
    );
    await BluetoothEscposPrinter.printText(`#${data.invoice_code}\r\n`, {});
    await BluetoothEscposPrinter.printText(`${data.customer_name}\r\n`, {});
    await BluetoothEscposPrinter.printText(
      `${dateFormat(data.deliver_date, "dd MMM yyyy")}\r\n`,
      {}
    );
    await BluetoothEscposPrinter.printText(
      "--------------------------------\r\n",
      {}
    );
    let columnWidth = [20, 12];
    await (async function () {
      let i = 0;
      for await (let item of data.items) {
        i++;
        await BluetoothEscposPrinter.printColumn(
          columnWidth,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${item.name}`,
            `${moneyFormat(Number(item.price) * Number(item.qty))}`,
          ],
          {}
        );
        await BluetoothEscposPrinter.printColumn(
          columnWidth,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [`${item.qty} x @ ${moneyFormat(item.price)}`, ""],
          {
            encoding: "GBK",
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: 1,
          }
        );
        if (!!item.discount && item.discount!=0) {
          await BluetoothEscposPrinter.printColumn(
            columnWidth,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              `Diskon ${item.discount}%`,
              `-${moneyFormat(
                (Number(item.discount) * Number(item.price)) / 100
              )}`,
            ],
            {
              encoding: "GBK",
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1,
            }
          );
        }
      }
    })();
    await BluetoothEscposPrinter.printText(
      "--------------------------------\r\n",
      {}
    );
    columnWidth = [20, 12];
    await BluetoothEscposPrinter.printColumn(
      columnWidth,
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ["Subtotal", moneyFormat(data.sub_total)],
      {}
    );
    if (!!data.service) {
      await BluetoothEscposPrinter.printColumn(
        columnWidth,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ["Serv. Charge", moneyFormat(data.service)],
        {}
      );
    }
    //Pajak
    await BluetoothEscposPrinter.printColumn(
      columnWidth,
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      [`Grand Total`, moneyFormat(data.grand_total)],
      {}
    );
    if (!!data.payment_method) {
      await BluetoothEscposPrinter.printColumn(
        columnWidth,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          `${capitalizeFLetter(data.payment_method)}`,
          moneyFormat(data.total_payment),
        ],
        {}
      );
      //Kembalian
    }
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
    await BluetoothEscposPrinter.printQRCode(
      String(data.sales_order_number),
      250,
      BluetoothEscposPrinter.ERROR_CORRECTION.M
    );
    if (!data.payment_method) {
      await BluetoothEscposPrinter.printText("HANYA UNTUK PENAGIHAN\r\n\r\n", {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText("BUKAN BUKTI BAYAR\r\n\r\n", {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });
    }
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT
    );
    await BluetoothEscposPrinter.printText(
      `${session.setting.description}\r\n`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      }
    );
    await BluetoothEscposPrinter.printText("\r\n\r\n", {});
  }
};


// await BluetoothEscposPrinter.printColumn(
    //   columnWidth,
    //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
    //   [`Pajak ${data.ppn}%`, moneyFormat(data.amount_ppn)],
    //   {}
    // );


    // await BluetoothEscposPrinter.printColumn(
      //   columnWidth,
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   [
      //     `Kembalian`,
      //     moneyFormat(Number(data.total_payment) - Number(data.grand_total)),
      //   ],
      //   {}
      // );