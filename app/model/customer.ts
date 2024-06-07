import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import CustomerAPI from "app/api/customer";
import { Alert } from "react-native";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore, { Session } from "./session";
import { confirmData, confirmLoadData, generateFileObj } from "./utils";
import { dateFormat } from "libs/utils/date";
import AdditionalStore, { FieldSingle } from "./additional";

export class Customer extends Model {
  id = null;
  id_segment = null;
  name = "";
  address = "";
  new_province = "";
  new_city = "";
  new_country = "";
  status = "";
  is_customer = "1";
  created_by = null;
  is_one_time=0;

  id_sales=null;
  sales_name="";

  segment = "";
  phone1 = "";
  phone2 = "";
  fax = "";
  contact_person_name = "";
  identity = "";
  contact_person_phone = "";
  email = "";
  created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");

  foto = "";

  born_date="";

  additional_data :FieldSingle[] = FieldSingle.hasMany(this)

  loading = false;
  saving = false;
  cached = true;

  init() {
    this._loadJSON(new Customer()._json);
  }
  initForm() {
    this._loadJSON(new Customer()._json);
    this.additional_data=[];
    try{
      this.additional_data=AdditionalStore.customer[0].fields
    }catch(e:any){

    }
    
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.customer.find((x) => x.id === this.id);
    if (!!save) {
      if (!!cs) {
        cs._loadJSON(this._json);
      } else {
        let cs = new Customer()._loadJSON(this._json);
        CacheStore.customer.push(cs);
      }
    } else if (save === false) {
      let csIdx = CacheStore.customer.findIndex((x) => x.id === this.id);
      if (csIdx > -1) CacheStore.customer.splice(csIdx, 1);
      this.init();
    }
    return save;
  }

  async delete() {
    let res: any = await CustomerAPI.postDelete(this._json);
    if (!!res) {
      this.init();
      alert("Data berhasil dihapus.");
      return true;
    }
    return false;
  }

  async load(id: number) {
    this.loading = true;
    let status = false;
    let data = new Customer();
    if (!!id) {
      let d = await CustomerAPI.getDetail(id);
      data._loadJSON(d);
      status = true;
    }
    data._loadJSON({
      loading: false,
    });
    this._loadJSON(data._json);
    return status;
  }

  async save() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
      status:"Leads"
    });
    let data = this._json;

    if(data.foto.includes("file://")){
      const foto = await generateFileObj(data.foto);
      data.created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      let res: any = await CustomerAPI.savePhoto(SessionStore.jwt, data, foto);
      //let res: any = await CustomerAPI.save(data);
      this._loadJSON({
        saving: false,
      });
      if (!!res) {
        this.init();
        alert("Data berhasil tersimpan.");
        return true;
      }
    }else{
      ///const foto = await generateFileObj(data.foto);
      data.created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      //let res: any = await CustomerAPI.savePhoto(SessionStore.jwt, data, foto);
      let res: any = await CustomerAPI.save(data);
      this._loadJSON({
        saving: false,
      });
      if (!!res) {
        this.init();
        alert("Data berhasil tersimpan.");
        return true;
      }
    }
    
    return false;
  }

  async saveImport() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
    });
    let data = this._json;
    data.created_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    let res: any = await CustomerAPI.save(data);
    this._loadJSON({
      saving: false,
    });
    if (!!res) {
      this.init();
      
      return true;
    }
    return false;
  }

  async saveToLocal() {
    let res: any = await confirmData();
    if (!!res) {
      this.cached = res;
    } else {
      this.cached = false;
    }
    return res;
  }

  async loadCache() {
    let data = new Customer();
    let cs = CacheStore.customer.find((x) => x.id === data.id);
    if (!!cs) {
      let load = await confirmLoadData();
      
      if (!!load) {
        data._loadJSON(cs._json);
      }
    }
  }
}

export class CustomerSegment extends Model {
  id = 0;
  name = "";
}

export class CustomerRepository extends Model {
  filter = Filter.childOf(this);
  list: Customer[] = Customer.hasMany(this);
  detail: Customer = Customer.childOf(this);
  segment: CustomerSegment[] = CustomerSegment.hasMany(this);

  loading = false;

  get getList() {
    const filter = (item: Customer) => {
      let match = true;
      if (!!this.filter.search) {
        let f1 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          item.name.toLowerCase()
        );

        let f2 = item.name.toLowerCase().includes(this.filter.search.toLowerCase())
        
        match = f1 || f2;
      }
      return match;
    };
    return this.list.filter(filter);
  }


  get getOneTimeId() {
    const filter = (item: Customer) => {
        let f1 = (item.is_one_time == 1)
      return f1;
    };
    let x = !!this.list.filter(filter)[0]?this.list.filter(filter)[0].id:null
    return x;
  }

  get getCustomerSegment() {
    return this.segment;
  }

  async load() {
    this.loading = true;
    CustomerAPI.getList().then((res) => {
      this._loadJSON({
        list: res,
        loading: false,
      });
    });
  }

  async loadSegment() {
    this.loading = true;
    CustomerAPI.getListSegment().then((res) => {
      this._loadJSON({
        segment: res,
        loading: false,
      });
    });
  }
}
const CustomerStore = CustomerRepository.create({
  localStorage: true,
  storageName: "CustomerRepository",
});
export default CustomerStore;
