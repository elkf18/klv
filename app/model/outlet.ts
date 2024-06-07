import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import OpportunityAPI from "app/api/opportunity";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, confirmLoadData, generateFileObj } from "./utils";
import { dateFormat } from "libs/utils/date";
import OutletAPI from "app/api/outlet";

export class Outlet extends Model {
    id=null;
    nama=""
    alamat=""
    telpon=""
    latitude=0
    longitude=0
    m_area=0
    created_time=""
    info=""
    kota=""
    provinsi=""
    negara=""
    code=""
    is_live=0
    mon_start=null
    mon_end=null
    tue_start=null
    tue_end=null
    wed_start=null
    wed_end=null
    thu_start=null
    thu_end=null
    fri_start=null
    fri_end=null
    sat_start=null
    sat_end=null
    sun_start=null
    sun_end=null
    id_client=""
    img_url=""

    catatan_struk=""
    kode_outlet=""
    kodearea=""
    loading = false;
  saving = false;
  cached = false;

  get today(): String{
    return dateFormat(new Date());
  }

    init() {
        this._loadJSON(new Outlet()._json);
    }
    async delete() {
        let res: any = await OutletAPI.postDelete(this._json);
        if (!!res) {
          this.init();
          alert("Data berhasil dihapus.");
          return true;
        }
        return false;
      }

      async reset() {
        let save: any = await confirmData();
        let cs = CacheStore.customer.find((x) => x.id === this.id);
        if (!!save) {
          if (!!cs) {
            cs._loadJSON(this._json);
          } else {
            let cs = new Outlet()._loadJSON(this._json);
            CacheStore.outlet.push(cs);
          }
        } else if (!save) {
          let csIdx = CacheStore.customer.findIndex((x) => x.id === this.id);
          if (csIdx > -1) CacheStore.customer.splice(csIdx, 1);
          this.init();
        }
        return save;
      }

      async save() {
        this._loadJSON({
          saving: true,
          created_by: SessionStore.user.id,
        });
    
        let res: any = await OutletAPI.save(this._json);
        this._loadJSON({
          saving: false,
        });
        if (!!res.status) {
          this.init();
          await alert("Data berhasil tersimpan.");
          return true;
        }
        return false;
      }

      async savePhoto() {

        this._loadJSON({
          loading:true,
          saving: true,
          created_by: SessionStore.user.id
        });
        if(this.created_time==null){
          this._loadJSON({
            created_time: dateFormat(new Date(),"yyyy-MM-dd")
          });
        }
        let data :Outlet= this._json;
    
        const foto = await generateFileObj(data.img_url);
        let res: any = await OutletAPI.savePhoto(SessionStore.jwt, data, foto);
        this._loadJSON({
          saving: false,
        });
        this.loading=false
        if (!!res) {
          this.init();
          alert("Data berhasil tersimpan.");
          return true;
        }
        return false;
      }


    

      async load(id: number, editable: boolean = false) {
        
        
        if (
          // !editable ||
          // (!this.cached && !!id) ||
          // (!!this.cached && this.id !== id)
          id!=null
        ) {
          this.loading = true;
          let data = await OutletAPI.getDetail(id);
          data = {
            ...data,
            loading: false
          };
          this._loadJSON(data);
        } else if (!this.cached || !id || (!!this.cached && this.id !== id)) {
          this.init();
        }
      }

      
}

export class OutletRepository extends Model {
    list: Outlet[] = [];
  filter: Filter = Filter.childOf(this);

  detail: Outlet = Outlet.childOf(this);
  form: Outlet = Outlet.childOf(this);

  loading = false;

  get timeList(){
    let list = [
      { value:"00:00:00", label:"00:00"},
      { value:"00:30:00", label:"00:30"},
      { value:"01:00:00", label:"01:00"},
      { value:"01:30:00", label:"01:30"},
      { value:"02:00:00", label:"02:00"},
      { value:"02:30:00", label:"02:30"},
      { value:"03:00:00", label:"03:00"},
      { value:"03:30:00", label:"03:30"},
      { value:"04:00:00", label:"04:00"},
      { value:"04:30:00", label:"04:30"},
      { value:"05:00:00", label:"05:00"},
      { value:"05:30:00", label:"05:30"},
      { value:"06:00:00", label:"06:00"},
      { value:"06:30:00", label:"06:30"},
      { value:"07:00:00", label:"07:00"},
      { value:"07:30:00", label:"07:30"},
      { value:"08:00:00", label:"08:00"},
      { value:"08:30:00", label:"08:30"},
      { value:"09:00:00", label:"09:00"},
      { value:"09:30:00", label:"09:30"},
      { value:"10:00:00", label:"10:00"},
      { value:"10:30:00", label:"10:30"},
      { value:"11:00:00", label:"11:00"},
      { value:"11:30:00", label:"11:30"},
      { value:"12:00:00", label:"12:00"},
      { value:"12:30:00", label:"12:30"},
      { value:"13:00:00", label:"13:00"},
      { value:"13:30:00", label:"13:30"},
      { value:"14:00:00", label:"14:00"},
      { value:"14:30:00", label:"14:30"},
      { value:"15:00:00", label:"15:00"},
      { value:"15:30:00", label:"15:30"},
      { value:"16:00:00", label:"16:00"},
      { value:"16:30:00", label:"16:30"},
      { value:"17:00:00", label:"17:00"},
      { value:"17:30:00", label:"17:30"},
      { value:"18:00:00", label:"18:00"},
      { value:"18:30:00", label:"18:30"},
      { value:"19:00:00", label:"19:00"},
      { value:"19:30:00", label:"19:30"},
      { value:"20:00:00", label:"20:00"},
      { value:"20:30:00", label:"20:30"},
      { value:"21:00:00", label:"21:00"},
      { value:"21:30:00", label:"21:30"},
      { value:"22:00:00", label:"22:00"},
      { value:"22:30:00", label:"22:30"},
      { value:"23:00:00", label:"23:00"},
      { value:"23:30:00", label:"23:30"}
    ] 
        return list
  }

  get getList() {
    return this.list.filter((item) => {
      let match = true;
      if (!!this.filter.search) {
        let f1 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.nama || "").toLowerCase()
        );
        let f2 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.code || "").toLowerCase()
        );
        match = !!f1 || !!f2;
      }
      return match;
    });
  }
  async load() {
    this.loading = false;
    console.log("load")
    let data = await OutletAPI.getList();
    this._loadJSON({
      list: data,
      loading: false,
    });

    console.log(this.list.length)
  }
}

const OutletStore = OutletRepository.create({
    localStorage: true,
    storageName: "OutletRepository",
  });
  export default OutletStore;