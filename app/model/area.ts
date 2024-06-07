import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import OpportunityAPI from "app/api/opportunity";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";
import { dateFormat } from "libs/utils/date"
import OutletAPI from "app/api/outlet";

export class Area extends Model {
    id=null
    code=""
    name=""
    id_client=0

    loading = false;
  saving = false;
  cached = false;
    init() {
        this._loadJSON(new Area()._json);
    }


    async load(id: number, editable: boolean = false) {
        if (
          !editable ||
          (!this.cached && !!id) ||
          (!!this.cached && this.id !== id)
        ) {
          this.loading = true;
          let data = await OutletAPI.getAreaList();
          data = {
            ...data,
            //loading: false
          };
          this._loadJSON(data);
        } else if (!this.cached || !id || (!!this.cached && this.id !== id)) {
          this.init();
        }
      }
}

export class AreaRepository extends Model {
    list: Area[] = [];
  filter: Filter = Filter.childOf(this);
  loading = false;

  async load() {
     
    this._loadJSON({
        list: [],
        loading: true,
      });
      OutletAPI.getAreaList().then((list) =>{
        this._loadJSON({
            list,
            loading: false,
          });
      })
  }

  get getList() {
    return this.list.filter((item) => {
      let match = true;
      if (!!this.filter.search) {
        let f1 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.name || "").toLowerCase()
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
}
const AreaStore = AreaRepository.create({
    localStorage: false,
    storageName: "AreaRepository",
  });
  export default AreaStore;