import { Model } from "libs/model/model";
import { dateFormat } from "libs/utils/date";
import fuzzyMatch from "libs/utils/fuzzy-match";
import ActivityAPI from "app/api/activity";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";
import AdditionalStore, { FieldSingle } from "./additional";
import { runInAction } from "mobx";
import { Alert, ToastAndroid } from "react-native";
import upload from "app/api/upload";
const PushNotification = require('../../node_modules/react-native-push-notification');


export class Activity extends Model {
  id = null;
  id_user = null;
  id_customer = null;
  id_outlet = null;
  type = "Kunjungan";
  title = "";
  status = "Baru";
  remarks = "";
  created_by = null;
  visit_date = "";


  date_visit = "";

  result_remarks = "";
  result_realization_date = null;

  name = "";
  contact_person_name = "";
  contact_person_phone = "";
  outlet_address = "";
  phone1 = "";
  sales_name = "";
  customer_name = "";

  attachment = "";

  latitude = 0;
  longitude = 0;

  loading = false;
  saving = false;
  cached = true;
  additional_data: FieldSingle[] = FieldSingle.hasMany(this)

  init() {
    this._loadJSON(new Activity()._json);
    this.status = "Baru"
    this.additional_data = [];
  }

  initForm() {
    this._loadJSON(new Activity()._json);
    runInAction(() => {
      this.status = "Baru"
      this.additional_data = [];


      this.date_visit = dateFormat(new Date(), "yyyy-MM-dd HH:mm");
      //this.visit_date = dateFormat(new Date(), "EEE, dd MMM yyyy HH:mm");

      this.visit_date = new Date().toISOString();
    })
    try {
      if (!!AdditionalStore.activity) {
        this.additional_data = AdditionalStore.activity[0].fields
      }
    } catch (e: any) {

    }


  }

  mergeForm() {
    if (AdditionalStore.activity.length > 0) {
      var ids = new Set(this.additional_data.map(d => d.variable));
      var merged = [...this.additional_data, ...AdditionalStore.activity[0].fields.filter(d => !ids.has(d.variable))];

      var template = AdditionalStore.activity[0].fields

      for (let i = 0; i < merged.length; i++) {
        try {
          if (merged[i].list.length > 0) {
            var tfield = template.find(obj => {
              return obj.variable === merged[i].variable
            })
            if (!!tfield) {
              merged[i].list = tfield.list
            }
          }

        } catch (e: any) {

        }
      }
      runInAction(() => {
        this.additional_data = merged
      })
    }
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.activity.find((x) => x.id === this.id);
    if (!!save) {
      if (!!cs) {
        cs._loadJSON(this._json);
      } else {
        let cs = new Activity()._loadJSON(this._json);
        CacheStore.activity.push(cs);
      }
    } else if (!save) {
      let csIdx = CacheStore.activity.findIndex((x) =>
        x.id === this.id);
      if (csIdx > -1) CacheStore.activity.splice(csIdx, 1);
      this.init();
    }
    return save;
  }

  async load(id: number) {
    this.loading = true;
    let data = new Activity();
    if (!!id) {
      let d = await ActivityAPI.getDetail(id);

      data._loadJSON(d);
      runInAction(() => {

        // console.log(JSON.stringify())

        data.additional_data = JSON.parse(d.additional_data)
        //  ActivityStore.detail.additional_data =JSON.parse(d.additional_data)

      })

    }
    data._loadJSON({
      loading: false,
    });

    // console.log(data._json);
    this._loadJSON(data._json);
  }

  async delete() {
    let res: any = await ActivityAPI.postDelete(this._json);
    if (!!res) {
      this.init();
      alert("Data berhasil dihapus.");
      return true;
    }
    return false;
  }

  async save() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
      id_user: SessionStore.user.id,
      id_outlet: SessionStore.user.id_outlet,
      visit_date: dateFormat(this.visit_date, "yyyy-MM-dd HH:mm")
    });

    if (this.visit_date == "") {
      this._loadJSON({
        visit_date: dateFormat(this.date_visit, "yyyy-MM-dd HH:mm")
      });
    }


    if (!!this.attachment) {
      if (this.attachment.includes('file://')) {
        let res = await upload(this.attachment, "activity");
        console.log("CCCC")
        console.log(res)
        this.attachment = res
      }
    }

    let res: any = await ActivityAPI.save(this._json);
    this.saving = false;
    if (!!res) {






      this.init();
      alert("Data berhasil tersimpan...");
      return true;
    }
    return false;
  }


  async loadCache() {
    let data = new Activity();
    let cs = CacheStore.activity.find((x) => x.id === data.id);
    if (!!cs) {
      let load = await confirmLoadData();

      if (!!load) {
        data._loadJSON(cs._json);
      }
    }
  }
}

export class ActivityRepository extends Model {
  listBaru: Activity[] = Activity.hasMany(this);
  listBerjalan: Activity[] = Activity.hasMany(this);
  listSelesai: Activity[] = Activity.hasMany(this);

  lastPageBaru = false
  lastPageBerjalan = false
  lastPageSelesai = false

  listRemainder: Activity[] = Activity.hasMany(this);

  filter: Filter = Filter.childOf(this);
  // filterBaru: Filter = Filter.childOf(this);
  // filterBerjalan: Filter = Filter.childOf(this);
  // filterSelesai: Filter = Filter.childOf(this);

  detail: Activity = Activity.childOf(this);

  loadingBaru = false;
  loadingBerjalan = false;
  loadingSelesai = false;

  get getListBaru() {
    let search = this.filter.search.toLowerCase();
    let date = this.filter.date;
    return this.listBaru.filter((item) => {
      let match = true;
      if (!!search) {
        let f1 = fuzzyMatch(
          search.toLowerCase(),
          (item.title || "").toLowerCase()
        );
        let f2 = fuzzyMatch(
          search.toLowerCase(),
          (item.contact_person_name || "").toLowerCase()
        );
        let f3 = fuzzyMatch(
          search.toLowerCase(),
          (item.name || "").toLowerCase()
        );
        match = !!f1 || !!f2 || f3;
      }
      if (!!date && !!item.visit_date) {
        let d =
          dateFormat(date, "yyyy-MM-dd") ===
          dateFormat(item.visit_date, "yyyy-MM-dd");
        match = match && d;
      }
      return match;
    });
  }
  
  isFirstBaru(id:number,status:string) {
    var list :Activity[]= []
    if(status=="Baru"){
      list=this.getListBaru
    }else if(status=="Berjalan"){
      list=this.getListBerjalan
    }else if(status=="Selesai"){
      list=this.getListSelesai
    }
    try{
      var pos= list.findIndex(x=> x.id===id)
      if(pos!=0){
        var dateup = list[pos-1].visit_date
        var date = list[pos].visit_date
        
        dateup = dateup.slice(0, dateup.length - 6);
        date = date.slice(0, date.length - 6);
  
        if(date===dateup){
          return false
        }else{
          true
        }
        
      }else{
        return true
      }
    }catch(e:any){
      return true
    }
    

    return true

  }

  get getListBerjalan() {
    let search = this.filter.search.toLowerCase();
    let date = this.filter.date;
    return this.listBerjalan.filter((item) => {
      let match = true;
      if (!!search) {
        let f1 = fuzzyMatch(
          search.toLowerCase(),
          (item.title || "").toLowerCase()
        );
        let f2 = fuzzyMatch(
          search.toLowerCase(),
          (item.contact_person_name || "").toLowerCase()
        );
        let f3 = fuzzyMatch(
          search.toLowerCase(),
          (item.name || "").toLowerCase()
        );
        match = !!f1 || !!f2 || f3;
      }
      if (!!date && !!item.visit_date) {
        let d =
          dateFormat(date, "yyyy-MM-dd") ===
          dateFormat(item.visit_date, "yyyy-MM-dd");
        match = match && d;
      }
      return match;
    });
  }
  get getListSelesai() {
    let search = this.filter.search.toLowerCase();
    let date = this.filter.date;
    return this.listSelesai.filter((item) => {
      let match = true;
      if (!!search) {
        let f1 = fuzzyMatch(
          search.toLowerCase(),
          (item.title || "").toLowerCase()
        );
        let f2 = fuzzyMatch(
          search.toLowerCase(),
          (item.contact_person_name || "").toLowerCase()
        );
        let f3 = fuzzyMatch(
          search.toLowerCase(),
          (item.name || "").toLowerCase()
        );
        match = !!f1 || !!f2 || f3;
      }
      if (!!date && !!item.visit_date) {
        let d =
          dateFormat(date, "yyyy-MM-dd") ===
          dateFormat(item.visit_date, "yyyy-MM-dd");
        match = match && d;
      }
      return match;
    });
  }

get sectionListBaru() {
    const s: any = []
    this.getListBaru.map(function(val, index){
      s.push(val.date_visit.slice(0,10))
    })
    const k:any =new Set<string>(s)
      const q = [...k]
  
      const x:any = []
  
      const h = q.map(function(kon:any,p){
        x.push({title:kon,data:[]})
          ActivityStore.getListBaru.map(function(n,index){
            
            if(n.date_visit.slice(0,10) === kon){
              x[p].data.push( n )
            }
          })
      })
    return x;
  }

  get sectionListBerjalan() {
    const s: any = []
    this.getListBerjalan.map(function(val, index){
      s.push(val.date_visit.slice(0,10))
    })
    const k:any =new Set<string>(s)
      const q = [...k]
  
      const x:any = []
  
      const h = q.map(function(kon:any,p){
        x.push({title:kon,data:[]})
          ActivityStore.getListBerjalan.map(function(n,index){
            
            if(n.date_visit.slice(0,10) === kon){
              x[p].data.push( n )
            }
          })
      })
    return x;
  }

  get sectionListSelesai() {
    const s: any = []
    this.getListSelesai.map(function(val, index){
      s.push(val.date_visit.slice(0,10))
    })
    const k:any =new Set<string>(s)
      const q = [...k]
  
      const x:any = []
  
      const h = q.map(function(kon:any,p){
        x.push({title:kon,data:[]})
          ActivityStore.getListSelesai.map(function(n,index){
            
            if(n.date_visit.slice(0,10) === kon){
              x[p].data.push( n )
            }
          })
      })
    return x;
  }

  async loadSelesai() {
    let mode = 1;
    if (
      ["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) > -1
    ) {
      mode = 0;
    }
    this._loadJSON({
      loadingSelesai: true,
    });
    ActivityAPI.getList({
      status: "Selesai",
      mode,
    }).then((res) => {
      this._loadJSON({
        listSelesai: res,
        loadingSelesai: false,
      });
    });
  }
  async loadBaru() {
    let mode = 1;
    if (
      ["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) > -1
    ) {
      mode = 0;
    }
    this._loadJSON({
      loadingBaru: true,
    });
    ActivityAPI.getList({
      status: "Baru",
      mode,
    }).then((res) => {
      this._loadJSON({
        listBaru: res,
        loadingBaru: false,
      });
    });
  }
  async loadBerjalan() {
    let mode = 1;
    if (
      ["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) > -1
    ) {
      mode = 0;
    }
    this._loadJSON({
      loadingBerjalan: true,
    });
    ActivityAPI.getList({
      status: "Berjalan",
      mode,
    }).then((res) => {
      this._loadJSON({
        listBerjalan: res,
        loadingBerjalan: false,
      });
    });
  }

  async loadRemainder() {
    let mode = 1;

    ActivityAPI.getRemainder().then((res) => {
      this._loadJSON({
        listRemainder: res
      });
      console.log("-->" + this.listRemainder.length)

      this.listRemainder.forEach(function (value) {


        let x = new Date(value.date_visit.split('+')[0].replace(" ", "T"));
        let xTime = x.getTime() - 900000 - 25200000
        let xSchedule = new Date(xTime)

        PushNotification.localNotificationSchedule({

          id: value.id,
          channelId: "reminder", // (required)
          channelName: "Activity Reminder", // (required)
          title: "Reminder: " + value.title, // (optional)
          message: "Aktivitas " + value.title + " akan dimulai dalam 15 menit", // (required)
          // message: "My Notification Message", // (required)
          // date: new Date(Date.now() + (5 * 1000)), // in 60 secs
          date: xSchedule, // in 60 secs

          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.

        });
      });


    });
  }


  /**
   * PAGINATION AREA
   */
  async loadMoreBaru(offset: number) {
    if (offset == 0) {
      this.lastPageBaru = false
    }
    if (this.lastPageBaru) {
      return;
    }

    this.loadingBaru = true;
    let mode = 1;
    if (
      ["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) > -1
    ) {
      mode = 0;
    }
    this._loadJSON({
      loadingBaru: true,
    });

    ActivityAPI.getListPage({
      status: "Baru",
      visit_date: this.filter.date,
      mode,
      search: this.filter.search
    }, 20, offset).then((data) => {

      if (offset == 0) {
        runInAction(() => {
          this.listBaru = []
        })

        runInAction(() => {
          this.listBaru = data
        })
      } else {

        runInAction(() => {
          this.listBaru.push(...data)
        })
      }
      if (data.length == 0) {
        this.lastPageBaru = true
      }
      this._loadJSON({
        //list: data,
        loadingBaru: false,
      });


    });

  }

  async loadMoreBerjalan(offset: number) {
    if (offset == 0) {
      this.lastPageBerjalan = false
    }
    if (this.lastPageBerjalan) {
      return;
    }

    this.loadingBerjalan = true;
    let mode = 1;
    if (
      ["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) > -1
    ) {
      mode = 0;
    }
    this._loadJSON({
      loadingBerjalan: true,
    });

    ActivityAPI.getListPage({
      status: "Berjalan",
      visit_date: this.filter.date,
      mode,
      search: this.filter.search
    }, 20, offset).then((data) => {
      if (offset == 0) {
        runInAction(() => {
          this.listBerjalan = []
        })
        runInAction(() => {
          this.listBerjalan = data
        })
      } else {
        runInAction(() => {
          this.listBerjalan.push(...data)
        })
      }
      if (data.length == 0) {
        this.lastPageBerjalan = true
      }

      this._loadJSON({
        //list: data,
        loadingBerjalan: false,
      });
    });
  }

  async loadMoreSelesai(offset: number) {
    if (offset == 0) {
      this.lastPageSelesai = false
    }
    if (this.lastPageSelesai) {
      return;
    }

    this.loadingSelesai = true;
    let mode = 1;
    if (
      ["administrator"].indexOf(SessionStore.role.role_name.toLowerCase()) > -1
    ) {
      mode = 0;
    }
    this._loadJSON({
      loadingSelesai: true,
    });

    ActivityAPI.getListPage({
      status: "Selesai",
      visit_date: this.filter.date,
      mode,
      search: this.filter.search
    }, 20, offset).then((data) => {
      if (offset == 0) {
        runInAction(() => {
          this.listSelesai = []
        })
        this.listSelesai = data
      } else {
        runInAction(() => {
          this.listSelesai.push(...data)
        })
      }
      if (data.length == 0) {
        this.lastPageSelesai = true
      }

      this._loadJSON({
        //list: data,
        loadingSelesai: false,
      });
    });


  }

}
const ActivityStore = ActivityRepository.create({
  localStorage: true,
  storageName: "ActivityRepository",
});
export default ActivityStore;
