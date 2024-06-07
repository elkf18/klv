import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import OpportunityAPI from "app/api/opportunity";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, confirmLoadData } from "./utils";
import { dateFormat } from "libs/utils/date"
import OutletAPI from "app/api/outlet";
import ContractAPI from "app/api/contract";

export class Contract extends Model {
    id=null
    contract_number=""
    tipe=""
    start_date=""
    end_date=""
    status=""
    content=""
    meta_data=""
    remarks=""
    created_by=0
    id_customer_outlet=0
    id_customer=0
    created_date=""
    updated_by=0
    updated_date=""
    tipe_pelanggan=""

    id_client=0

    loading = false;
  saving = false;
  cached = false;
    init() {
        this._loadJSON(new Contract()._json);
    }


    async load(id: number, editable: boolean = false) {
        if (
          !editable ||
          (!this.cached && !!id) ||
          (!!this.cached && this.id !== id)
        ) {
          this.loading = true;
          let data = await ContractAPI.getContractList();
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

export class ContractRepository extends Model {
    list: Contract[] = [];
  filter: Filter = Filter.childOf(this);
  loading = false;

  async load() {
     
    this._loadJSON({
        list: [],
        loading: true,
      });
      ContractAPI.getContractList().then((list) =>{
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
          (item.contract_number || "").toLowerCase()
        );
        let f2 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.content || "").toLowerCase()
        );
        match = !!f1 || !!f2;
      }
      return match;
    });
  }
}
const ContractStore = ContractRepository.create({
    localStorage: false,
    storageName: "ContractRepository",
  });
  export default ContractStore;