import { Model } from "libs/model/model";
import { dateFormat } from "libs/utils/date";
import SalesAPI from "app/api/so";
import { SalesReceipt } from "app/receipt/sales";
import CacheStore from "./cache";
import { Filter } from "./filter";
import GlobalStore from "./global";
import PaymentStore from "./payment";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";

export class DeliveryItem extends Model {
  id = null;
  id_product = null;
  qty = 0;

  name = "";
  group_name = "";
}
export class Delivery extends Model {
  id = null;
  id_sales_order = null;
  sub_total = 0;
  amount_discount = 0;
  amount_ppn = 0;
  grand_total = 0;

  invoice_code = "";
  deliver_date = dateFormat(new Date(), "yyyy-MM-dd");

  items: DeliveryItem[] = [];
  currentItems: DeliveryItem[] = [];
  productUndeliver: any[] = [];

  loading = false;
  saving = false;
  cached = false;

  get getProductUndeliver() {
    return this.productUndeliver
      .filter((h) => {
        let idx = -1;
        idx = this.items.findIndex((mh) => mh.id_product === h.id_product);
        if (idx > -1 || h.undelivered === 0) {
          return false;
        }
        return true;
      })
      .map((h) => {
        return {
          name: `${!!h.group_name ? h.group_name + " - " : ""}${h.name}`,
          id: h.id_product,
        };
      });
  }

  addItem(id: number) {
    let item = this.productUndeliver.find((x) => x.id_product === id);
    if (!!item) {
      let p = new DeliveryItem();
      p._loadJSON({
        id_product: item.id_product,
        qty: item.undelivered,
        name: item.name,
        group_name: item.group_name,
      });
      this.items.push(p);
    }
  }

  checkQty(key: number, value: any) {
    if (value < 1) return;
    this.items[key].qty = value < 1 ? 1 : value;
    const item = this.items[key];
    const p = this.productUndeliver.find(
      (x) => x.id_product === item.id_product
    );
    let qty = p.undelivered;
    if (!!p) {
      if (!!item.id) {
        const citem = this.currentItems.find((x) => x.id === item.id);
        if (!!citem) {
          let u = p.order - p.delivery + citem.qty;
          qty = item.qty > u ? p.undelivered : item.qty < 1 ? 1 : item.qty;
        }
      } else {
        qty =
          item.qty > p.undelivered
            ? p.undelivered
            : item.qty < 1
            ? 0
            : item.qty;
      }
    }
    this.items[key].qty = qty;
  }

  init() {
    this._loadJSON(new Delivery()._json);
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.delivery.find(
      (x) => x.id === this.id && x.id_sales_order === this.id_sales_order
    );
    if (!!save) {
      if (!!cs) {
        cs._loadJSON(this._json);
      } else {
        let cs = new Delivery()._loadJSON(this._json);
        CacheStore.delivery.push(cs);
      }
    } else if (!save) {
      let csIdx = CacheStore.delivery.findIndex((x) => x.id === this.id);
      if (csIdx > -1) CacheStore.delivery.splice(csIdx, 1);
      this.init();
    }
    return save;
  }

  async load(id: number, id_sales_order: number, editable = false) {
    this.loading = true;
    let undeliver: any[] = [];
    let items: any[] = [];
    let summary = {};
    if (!!id) {
      let d = await SalesAPI.getDeliveryDetail(id);
      this._loadJSON(d);
      summary = await SalesAPI.getTotalPembayaran(id);
      PaymentStore.detail._loadJSON(summary);
    }
    if (!!id_sales_order) {
      undeliver = await SalesAPI.getProductUndelivered(id_sales_order);
    }
    if (!!editable) {
      if (undeliver.length > 0) {
        items = undeliver
          .filter((x) => x.undelivered > 0)
          .map((x) => ({
            id_product: x.id_product,
            qty: x.undelivered,
            name: x.name,
            group_name: x.group_name,
          }));
      }
    } else {
      items = this._json.items;
    }
    this._loadJSON({
      id_sales_order,
      currentItems: this._json.items,
    });
    if (!!editable) {
      let cs = CacheStore.delivery.find(
        (x) => x.id === this.id && x.id_sales_order === this.id_sales_order
      );
      if (!!cs) {
        let load = await confirmLoadData();

        if (!!load) {
          this._loadJSON(cs._json);
        }
      }
    }
    this._loadJSON({
      productUndeliver: undeliver,
      items,
      loading: false,
    });
    // this._loadJSON(data._json);
  }

  async save() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
    });
    let data = this._json;
    data.created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    data.created_by = SessionStore.user.id;
    let res: any = await SalesAPI.saveDelivery(data);
    this.saving = false;
    if (!!res) {
      this.init();
      alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  }
}

export class DeliveryRepository extends Model {
  list: Delivery[] = [];
  productUndeliver: any[] = [];
  filter: Filter = Filter.childOf(this);

  detail: Delivery = Delivery.childOf(this);

  loading: boolean = false;

  isPrint: boolean = false;

  get canAdd(): boolean {
    return this.productUndeliver.filter((x) => x.undelivered > 0).length > 0;
  }

  get getList() {
    return this.list;
  }

  async load(id: number) {
    this.loading = true;
    let data = await SalesAPI.getListDelivery(id);
    let undeliver = await SalesAPI.getProductUndelivered(id);
    this._loadJSON({
      list: data,
      productUndeliver: undeliver,
      loading: false,
    });
  }

  async print(id: number) {
    this.isPrint = true;
    if (!!GlobalStore.connectedDV) {
      let data = await SalesAPI.getReceipt(id);
      await SalesReceipt(data);
    } else {
      alert("Terjadi kesalahan. Perikasa kembali printer di menu setting.");
    }
    DeliveryStore.isPrint = false;
  }
}
const DeliveryStore = DeliveryRepository.create({
  localStorage: true,
  storageName: "DeliveryRepository",
});
export default DeliveryStore;
