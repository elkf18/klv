import { Model } from "libs/model/model";
import { dateFormat } from "libs/utils/date";
import fuzzyMatch from "libs/utils/fuzzy-match";
import SalesAPI from "app/api/so";
import CacheStore from "./cache";
import { Filter } from "./filter";
import PaymentStore from "./payment";
import ProductStore from "./product";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";
import CustomerStore from "./customer";
import GlobalStore from "./global";
import { SalesReceipt } from "app/receipt/sales";
import { Promo } from "./promo";

import AdditionalStore, { FieldSingle } from "./additional";

import { runInAction } from "mobx";



const getTotalDisc = (val: any) => {
  if (!val) return 0;
  let disc = typeof val === "number" ? val.toString() : val;
  let discArr = disc.split("+");
  let TotDisc = 0;
  if (discArr.length > 0) {
    if (discArr[0] == "") {
      TotDisc = 0;
    } else {
      TotDisc = parseFloat(discArr[0]);
    }
    for (let i = 1; i < discArr.length; i++) {
      let subDisc = ((100 - TotDisc) * parseFloat(discArr[i])) / 100;

      TotDisc = TotDisc + subDisc;
    }
  }
  return TotDisc;
};

export class SalesProduct extends Model {
  id = null;
  id_product = null;
  id_sales_order = null;
  qty = 1;
  qty_kg = 0;
  price = 0;
  subtotal = 0;
  total = 0;
  discount = "0";
  amount_discount = 0;
  created_by = 0;

  status="Active";
  payment=0;
  product_name = "";
  unit = "";
  payment_method="";
}

export class SalesReport extends Model {
  list: Sales[] = [];
  list2: Sales[] = [];
  pesanan =0;
  pembayaran=0;
  count :number =0;
  date1=dateFormat(new Date(), "yyyy-MM-dd")
  date2=dateFormat(new Date(), "yyyy-MM-dd")

  loading = false;


  async load() {
    this.loading = true;
    let data = await SalesAPI.getReport(this.date1,this.date2);
    this._loadJSON({
      list: data,
      loading: false,
    });
    let data2 = await SalesAPI.getList(this.date1,this.date2);
    this._loadJSON({
      list2: data2,
      loading: false,
    })
    console.log(this.list)
    console.log(this.list2)

    // let x = this.list.reduce((acc:number, curr) => acc+parseInt(String(!!curr.grand_total?curr.grand_total:0)), 0);
    // this.pesanan = x;
    
    let x = 0;
    this.list.map((item:any, index) => {
      let z = this.list2.find((item2 :any) => item2.sales_order_number === item.sales_order_number)
      console.log(z)
      let status = z?.status;
      if(status === "submitted"){
        x += parseInt(String(!!item.grand_total?item.grand_total:0))
      }
    })
    this.pesanan = x;

    // let y = this.list.reduce((acc:number, curr) => acc + parseInt(String(!!curr.payment?curr.payment:0)), 0);
    // this.pembayaran = y;

    let y = 0;
    this.list.map((item:any, index) => {
      let z = this.list2.find((item2 :any) => item2.sales_order_number === item.sales_order_number)
      console.log(z)
      let status = z?.status;
      if(status === "paid" || status === "complete"){
        y += parseInt(String(!!item.payment?item.payment:0))
      }
    })
    this.pembayaran = y;

    this.count = this.list.length

  }
}
export class Sales extends Model {
  id = null;
  id_customer = null;
  sub_total = 0;
  amount_ppn = 0;
  grand_total = 0;
  total_payment = 0;
  ppn = 10;
  totalkg = 0;
  //discount = "0";
  fullname = "";
  created_by = 0;
  payment=0;
  est_delivery = dateFormat(new Date(), "yyyy-MM-dd");
  status = "submitted";

  sales_order_date = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
  customer_name = "";
  purchase_order_number = "";
  sales_order_number = "";
  outlet_name = "";
  address = "";
  phone = "";
  created_date = "";

  tab = "";

  t_sales_order_lines: SalesProduct[] = SalesProduct.hasMany(this);

  loading = false;
  saving = false;
  cached = false;
  openPayment = false;

  id_promo?: number = 0;
  amount_discount = 0;
  discount = 0;
  payment_method="";

  additional_data :FieldSingle[] = FieldSingle.hasMany(this)

  promo = Promo.childOf(this)

  init() {
    this._loadJSON(new Sales()._json);
    PaymentStore.detail.init();
    this.promo = new Promo()
    this.t_sales_order_lines = []
    this.id_customer = CustomerStore.getOneTimeId 
  }
  initForm() {
    this.init()
    // this.additional_data=[];
    // this.additional_data=AdditionalStore.sales[0].fields
    try {
      if (!!AdditionalStore.sales) {
        this.additional_data = AdditionalStore.sales[0].fields
      }
    } catch (e: any) {

    }
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.sales.find((x) => x.id === this.id);
    if (!!save) {
      // if (!!cs) {
      //   cs._loadJSON(this._json);
      // } else {
      //   let cs = new Sales()._loadJSON(this._json);
      //   CacheStore.sales.push(cs);
      // }
    } else if (!save) {
      this.init();
      // let csIdx = CacheStore.sales.findIndex((x) => x.id === this.id);
      // if (csIdx > -1) CacheStore.sales.splice(csIdx, 1);
      this.init();
    }
    return save;
  }

  async load(id: number, editable: boolean = false) {
    this.loading = true;
    if (!!id) {
      let d = await SalesAPI.getDetail(id);
      this._loadJSON(d);
    }
    if (!!editable) {
      let cs = CacheStore.sales.find((x) => x.id === this.id);
      if (!!cs) {
        let load = await confirmLoadData();

        if (!!load) {
          this._loadJSON(cs._json);
        }
      }
    }
    this._loadJSON({
      loading: false,
    });
    if (this.t_sales_order_lines.length === 0) {
      this.addProduct();
    }
  }

  async save() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
    });
    let data = this._json;
    data.created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");

    if(data.id==null){
      data.sales_order_date = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    }

    let res: any = await SalesAPI.save(data);
    this.saving = false;
    if (!!res.status) {
      this.init();
      await alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  }

  async delete() {
    let data = this._json;
    let res: any = await SalesAPI.postDelete(data);
    
    if (!!res.status) {
      this.init();
      await alert("Pesanan berhasil dibatalkan.");
      return true;
    }
    return false;
  }

  changeToNumber(key: number) {
    if (!!this.t_sales_order_lines[key]) {
      
      
      let sop = new SalesProduct()._loadJSON(this.t_sales_order_lines[key]);
      
      let qty = Number(sop.qty);
      // let discount = Number(sop.discount);

      sop._loadJSON({
        ...sop,
        qty,
        // discount,
      });
      this.t_sales_order_lines[key] = sop._json;
    }
  }

  setPromo(promo_id:number){
    this.amount_discount=0
    this.discount=0

    if(promo_id==this.id_promo){
      this.id_promo=0;
      this.promo = new Promo()
      this.generateGrand()
      return
    }else{
      this.id_promo=promo_id
    }
    

    if(this.promo.type==="P"){
      
      let disc = this.sub_total * (this.promo.discount_percent/100)
      
      if(disc>this.promo.max_discount_value && this.promo.max_discount_value!==0){
        this.amount_discount = this.promo.max_discount_value
      }else{
        this.amount_discount = disc
      }
      this.setDiscountAmount()
      
    }else{
      this.amount_discount =this.promo.discount_amount
      this.setDiscountAmount()
      
    }

    this.generateGrand()
  }

  generateGrand(){
    this.grand_total = this.sub_total - this.amount_discount
  }


  setDiscount(){
    if(this.discount>100){
      this.discount=100
    }else if (this.discount<0){
      this.discount=0
    }

    this.amount_discount=(this.sub_total*(this.discount/100))
  }
  setDiscountAmount(){
    if(this.amount_discount>this.sub_total){
      this.amount_discount=this.sub_total
    }else if (this.amount_discount<0){
      this.amount_discount=0
    }

    this.discount=Math.round( ((100*this.amount_discount)/this.sub_total))
  }

  async saveAndPay() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
    });
    let data = this._json;
    data.created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    if(data.id==null){
      data.sales_order_date = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    }
    
    let res: any = await SalesAPI.saveAndPay(data, PaymentStore.detail._json);
    this.saving = false;
    if (!!res.status) {
      this.init();
      //PaymentStore.detail.init();
      await alert("Data berhasil tersimpan.");
      console.log(res)
      return true;
    }
    return false;
  }

  // addProduct() {
  //   let soline = [...this.t_sales_order_lines];
  //   let a = new SalesProduct();
  //   a._loadJSON({
  //     id_sales_order: !!SalesStore.detail.id ? SalesStore.detail.id : null,
  //     created_by: SessionStore.user.id,
  //   })._json;
  //   soline.push(a);
  //   this._loadJSON({
  //     t_sales_order_lines: soline,
  //   });
  // }

  addProduct(data?: any) {
    
    let a = new SalesProduct();
    a._loadJSON({
      id_sales_order: !!SalesStore.form.id ? SalesStore.form.id : null,
      created_by: SessionStore.user.id,
      
    });
    if (!!data) {
      a._loadJSON(data);
      a.id=null;
      a.id_product=data.id
      a.price=data.normal_price
    }
    //console.log(JSON.stringify(a))
    this.t_sales_order_lines.push(a);
    
    return this.t_sales_order_lines.indexOf(a);
  }

  addProductById(id:number) {
    let data = ProductStore.getProductModalId(id)[0].product[0]
    let a = new SalesProduct();
    a._loadJSON({
      id_sales_order: !!SalesStore.form.id ? SalesStore.form.id : null,
      created_by: SessionStore.user.id,
      
    });
    if (!!data) {
      a._loadJSON(data);
      a.id=null;
      a.id_product=data.id
      a.price=data.normal_price?data.normal_price:0
      a.total=data.normal_price?data.normal_price:0
    }
    //console.log(JSON.stringify(a))
    this.t_sales_order_lines.push(a);
    
    return this.t_sales_order_lines.indexOf(a);
  }

  changeProduct(key: number, id: number) {
    let product = ProductStore.getList.find((x) => x.id === id);
    if (!!product) {
      this.t_sales_order_lines[key]._loadJSON({
        id_product: product.id,
        price: product.price || this.t_sales_order_lines[key].price,
        unit: product.unit,
      });
    }
    this.calculate(key);
  }

  deleteProduct(key: number) {

    // if(SalesStore.form.t_sales_order_lines[key].id!=null){
    //   SalesStore.form.t_sales_order_lines[key].is_deleted=1
    // }else{
      SalesStore.form.t_sales_order_lines.splice(key, 1);
    // }

    
    this.calcGrand();
  }

  calculate(key: number) {
    if (!!this.t_sales_order_lines[key]) {
      let self = this._json;
      let sop = self.t_sales_order_lines[key];
      let qty = sop.qty;
      let price = sop.price.toString().replace(/,/g, "");
      let discount;
      if (Number(sop.discount) < 0) {
        discount = getTotalDisc(0);
      } else if (Number(sop.discount) > 100) {
        discount = getTotalDisc(100);
      } else {
        discount = getTotalDisc(sop.discount);
      }

      let subtotal = Number(price) * Number(qty);
      let amount_discount = (subtotal * discount) / 100;
      let total = subtotal - amount_discount;
      sop = {
        ...sop,
        amount_discount,
        subtotal,
        total,
      };
      let a = new SalesProduct();
      a._loadJSON(sop);
      this.t_sales_order_lines[key] = a;
      this.calcGrand();
    }
  }

  calcGrand() {
    let so_lines = this._json.t_sales_order_lines;
    let subtotal = 0;
    //let discount = getTotalDisc(this.discount);
    // let ppn = _.get(meta, "form.ppn", 0);
    let ppn;
    if (this.ppn < 0) {
      ppn = 0;
    } else if (this.ppn > 100) {
      ppn = 100;
    } else {
      ppn = this.ppn;
    }
    so_lines.map((sl: SalesProduct) => {
      subtotal += Number(sl.total);
    });
    //let amount_discount = (subtotal * discount) / 100;
    let total = subtotal - this.amount_discount;
    
    //let amount_ppn = (total * ppn) / 100;
    let grand_total = total; //+ amount_ppn;
    this._loadJSON({
      sub_total: subtotal,
      //amount_ppn,
      grand_total,
    });
  }
}

export class SalesRepository extends Model {
  list: Sales[] = [];
  filter: Filter = Filter.childOf(this);

  detail: Sales = Sales.childOf(this);
  form: Sales = Sales.childOf(this);

  tempForm: Sales = Sales.childOf(this);

  salesReport : SalesReport = new SalesReport()

  loading = false;
  isPrint=false
  lastPage =false
  // get getFormLine() {
  //   return this.form.t_sales_order_lines.filter((item) => {
  //       return item.is_deleted==0
  //   })
  // }

  async print(id: any) {
    
    this.isPrint = true;
    if (!!GlobalStore.connectedDV) {
      let data = await SalesAPI.getReceipt(id);
      await SalesReceipt(data);
    } else {
      alert("Terjadi kesalahan. Perikasa kembali printer di menu setting.");
    }
    SalesStore.isPrint = false;
  }

  

  get getList() {
    return this.list.filter((item) => {
      let match = true;
      let f1 = true,
        f2 = true,
        f3 = true,
        f4 =true;
      if (!!this.filter.search) {
        f1 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.customer_name || "").toLowerCase()
        );
        f2 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.sales_order_number || "").toLowerCase()
        );
        f3 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.purchase_order_number || "").toLowerCase()
        );

       
      }
      f4 = (item.status.toLowerCase() !== "cancelled");
      match = (!!f1 || !!f2 || f3) && f4;
      return match;
    });
  }

  get getQty(){
    return this.tempForm.t_sales_order_lines.reduce((a, b) => a + b.qty, 0);
  }

  async load() {
    this.loading = true;
    let data = await SalesAPI.getList(this.filter.date,this.filter.search);
    this._loadJSON({
      list: data,
      loading: false,
    });
    console.log(data)
  }

  get LoadedList(){
    console.log(this.list)
    return this.list
  }

  async loadMore(offset:number) {
    if(offset==0){
      this.lastPage=false
      // runInAction(()=>{
        
      //   this.list= [] as Sales[];
      // })
    }
    if(this.lastPage){
      return;
    }

    this._loadJSON({
      loading: true,
    });
    
    
    SalesAPI.getListPage(this.filter,
      20,offset).then((data) => {

        if(data.length==0){
          this.lastPage=true
          if(offset==0){
            this.list= [] as Sales[];
          }
          
        }

        if(offset==0){
          runInAction(()=>{
            // this.list= [] as Sales[];
            // this.list = data
            this._loadJSON({
              list: data,
            });
          })
        }else{
          runInAction(()=>{
            this.list.push(...data)
          })
        }
        
      this._loadJSON({
        //list: data,
        loading: false,
      });
    });
  }
}
const SalesStore = SalesRepository.create({
  localStorage: true,
  storageName: "SalesRepository",
});
export default SalesStore;
