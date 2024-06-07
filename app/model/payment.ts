import { Model } from "libs/model/model";
import SalesAPI from "app/api/so";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";
import { Promo } from "./promo";
import SalesStore from "./sales";

export class Payment extends Model {
  id = null;
  id_delivery = null;
  created_by = null;
  total_payment = 0;
  grand_total = 0;
  total_paid = 0;
  total_unpaid = 0;

  payment_method = "";
  notes = "";

  id_promo?: number = 0;

  loading = false;
  saving = false;
  cached = false;

  init() {
    this._loadJSON(new Payment()._json);
    // this.payment_method="CASH";
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.payment.find(
      (x) => x.id === this.id && x.id_delivery === this.id_delivery
    );
    if (!!save) {
      if (!!cs) {
        cs._loadJSON(this._json);
      } else {
        let cs = new Payment()._loadJSON(this._json);
        CacheStore.payment.push(cs);
      }
    } else if (!save) {
      let csIdx = CacheStore.payment.findIndex((x) => x.id === this.id);
      if (csIdx > -1) CacheStore.payment.splice(csIdx, 1);
      this.init();
    }
    return save;
  }

  async load(id: number, editable: boolean = false) {
    this.loading = true;
    let data = new Payment();
    if (!!id) {
      let d = await SalesAPI.getDeliveryDetail(id);
      data._loadJSON(d);
    }
    if (!!editable) {
      let cs = CacheStore.opportunity.find((x) => x.id === data.id);
      if (!!cs) {
        let load = await confirmLoadData();

        if (!!load) {
          data._loadJSON(cs._json);
        }
      }
    }
    data._loadJSON({
      loading: false,
    });
    this._loadJSON(data._json);
  }

  async save() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
    });
    let res: any = await SalesAPI.savePembayaran(this._json);
    this.saving = false;
    if (!!res) {
      this.init();
      alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  }


  getFromSO(){
    console.log("SO:"+SalesStore.form.grand_total)
    console.log("Payment:"+this.total_payment)
    this.grand_total = SalesStore.form.grand_total
    this.total_payment = SalesStore.form.grand_total
  }


  checkPayment() {
    let val = Number(this.total_payment);
    if (val < this.grand_total) {
      this.total_payment = this.grand_total;
    }
  }
}

export class PaymentRepository extends Model {
  list: Payment[] = [];
  productUndeliver: any[] = [];
  filter: Filter = Filter.childOf(this);

  detail: Payment = Payment.childOf(this);
  form:Payment = Payment.childOf(this);

  loading: boolean = false;

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
}
const PaymentStore = PaymentRepository.create({
  localStorage: true,
  storageName: "PaymentRepository",
});
export default PaymentStore;
