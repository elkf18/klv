import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import OpportunityAPI from "app/api/opportunity";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";
import { dateFormat } from "libs/utils/date";
import { runInAction, toJS } from "mobx";
import upload from "app/api/upload";

export class Stage extends Model {
  id = null;
  stage = "";
  sequence = 0;
  is_final = "N";
}

export class Opportunity extends Model {
  id = null;
  id_stage = null;
  id_customer = null;
  amount = 0;
  created_by = 0;
  created_date = "";
  fullname=""
  name = "";
  stage = "";
  closed_date = null;
  description = "";
  remarks = "";
  customer_name = "";

  margin=0;
  estimate_deal="";
  show_estimate_deal="";

  attachment="";

  loading = false;
  saving = false;
  cached = false;

  init() {
    this._loadJSON(new Opportunity()._json);
    
    runInAction(()=>{
      this.id_stage = OpportunityStore.getStage[0].value
      this.estimate_deal = dateFormat(new Date(), "yyyy-MM-dd HH:mm");

      this.show_estimate_deal = new Date().toISOString();
    })
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.opportunity.find((x) => x.id === this.id);
    if (!!save) {
      if (!!cs) {
        cs._loadJSON(this._json);
      } else {
        let cs = new Opportunity()._loadJSON(this._json);
        CacheStore.opportunity.push(cs);
      }
    } else if (!save) {
      let csIdx = CacheStore.opportunity.findIndex((x) => x.id === this.id);
      if (csIdx > -1) CacheStore.opportunity.splice(csIdx, 1);
      this.init();
    }
    return save;
  }

  async load(id: number, editable: boolean = false) {
    this.loading = true;
    let data = new Opportunity();
    if (!!id) {
      let d = await OpportunityAPI.getDetail(id);
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
    console.log(data._json)
    this._loadJSON(data._json);
  }

  async save() {
    this._loadJSON({
      saving: true,
      created_by: SessionStore.user.id,
      estimate_deal: dateFormat(this.show_estimate_deal, "yyyy-MM-dd HH:mm")
    });
    let data = this._json;
    data.created_date = dateFormat(new Date(), "yyyy-MM-dd HH:mm");

    if(!!this.attachment){
     
      if(this.attachment.includes('file://')){
        let res = await upload(this.attachment, "opportunity");
        data.attachment=res
        this.attachment=res
      }
    }else{
      data.attachment=""
        this.attachment=""
    }
    let res: any = await OpportunityAPI.save(data);
    this.saving = false;
    if (!!res) {
      this.init();
      alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  }

  
}

export class OpportunityRepository extends Model {
  list: Opportunity[] = [];
  stage: Stage[] = [];
  filter = Filter.childOf(this);

  detail: Opportunity = Opportunity.childOf(this);
  form: Opportunity = Opportunity.childOf(this);

  loading = false;

  get getStage() {
    const { stage } = this._json;

    return stage
      .sort((a: Stage, b: Stage) => a.sequence - b.sequence)
      .map((x: Stage) => ({
        label: x.stage,
        value: x.id,
      }));
  }

  // get getList() {
  //   return this.list.filter((item: Opportunity) => {
  //     let match = true;
  //     let f1 = String(this.filter.tab) === String(item.id_stage);
  //     let f2 = true,
  //       f3 = true,
  //       f4 = true;
  //     if (!!this.filter.search) {
  //       f2 = fuzzyMatch(
  //         this.filter.search.toLowerCase(),
  //         (item.name || "").toLowerCase()
  //       );
  //       f3 = fuzzyMatch(
  //         this.filter.search.toLowerCase(),
  //         (item.customer_name || "").toLowerCase()
  //       );
  //       f4 = fuzzyMatch(this.filter.search.toLowerCase(), String(item.amount));
  //     }
  //     match = !!f1 && (!!f2 || !!f3 || !!f4);
  //     return match;
  //   });
  // }

  // get subtotal() {
  //   let subtotal = 0;
  //   this.getList.forEach((x) => (subtotal += Number(x.amount)));
  //   return subtotal;
  // }

  get firstStage() {
    let stage = {
      label: "",
      value: "",
    };
    if (this.stage.length > 0) {
      stage = this.getStage[0];
    }
    return stage;
  }

  get total() {
    let total = 0;
    this.list.forEach((x) => (total += Number(x.amount)));
    return total;
  }
  getFilter(idStage: number) {
    // let filter = this.filter.find((x) => x.tab === String(idStage));
    let filter = this.filter;
    if (!filter) {
      filter = new Filter();
    }
    return filter;
  }

  getListStage(idStage: number) {
    // let filter = this.filter.find((x) => x.tab === String(idStage));
    let filter = this.filter;
    return this.list.filter((item: Opportunity) => {
      let match = true;
      let f1 = String(idStage) === String(item.id_stage);
      let f2 = true,
        f3 = true,
        f4 = true,
        f5 = true;
      const fs = filter.search.toLowerCase();
      if (!!filter?.search) {
        f2 = fuzzyMatch(fs, (item.name || "").toLowerCase());
        f3 = fuzzyMatch(fs, (item.customer_name || "").toLowerCase());
        f4 = fuzzyMatch(fs, String(item.amount));
      }
      if (!!filter?.date) {
        const fd = dateFormat(filter.date, "yyyy-MM-dd");
        f5 = fd === dateFormat(item.closed_date, "yyyy-MM-dd");
      }
      match = !!f1 && (!!f2 || !!f3 || !!f4) && f5;

      
      return match;
    });
  }

  subtotal(idStage: number) {
    let subtotal = 0;
    this.getListStage(idStage).forEach((x) => (subtotal += Number(x.amount)));
    return subtotal;
  }

  async load() {
    this.loading = true;
    
    let stage = await OpportunityAPI.getListStage();
    let data = await OpportunityAPI.getList();
    
    this._loadJSON({
      stage,
      list: data,
      loading: false,
    });
  }
}
const OpportunityStore = OpportunityRepository.create({
  localStorage: true,
  storageName: "OpportunityRepository",
});
export default OpportunityStore;
