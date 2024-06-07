import ProductAPI from "app/api/product";
import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import { Filter } from "./filter";
import SessionStore from "./session";

export class ProductType extends Model {
    id=0;
    type="";
    sequence= 0
    cached = false;
    loading = false;
    init() {
      this._loadJSON(new ProductType()._json);
    }
}

export class ProductTypeRepository extends Model {
    list: ProductType[] = [];
    filter: Filter = Filter.childOf(this);
    loading = false;

    async load() {
         
        this._loadJSON({
            list: [],
            loading: true,
          });
          ProductAPI.getTypeProduct().then((list) =>{
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
              (item.type || "").toLowerCase()
            );


            
            match = !!f1;
          }


          if(SessionStore.package.id==1){
            match = (item.id==1)
          }

          return match;
        });
      }
}
const ProductTypeStore = ProductTypeRepository.create({
    localStorage: false,
    storageName: "ProductTypeRepository",
  });
  export default ProductTypeStore;