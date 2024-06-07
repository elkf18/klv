import ProductAPI from "app/api/product";
import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import { Filter } from "./filter";


export class ProductCategory extends Model {
    id=0;
    category="";
    id_client="";
    sequence= 0
    cached = false;
    loading = false;
    init() {
      this._loadJSON(new ProductCategory()._json);
    }

    
}

export class ProductCategoryRepository extends Model {
    list: ProductCategory[] = [];
  filter: Filter = Filter.childOf(this);
  loading = false;

  async load() {
     
    this._loadJSON({
        list: [],
        loading: true,
      });
      ProductAPI.getCategoryProduct().then((list) =>{
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
          (item.category || "").toLowerCase()
        );
        let f2 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.category || "").toLowerCase()
        );
        match = !!f1 || !!f2;
      }
      return match;
    });
  }
}

const ProductCategoryStore = ProductCategoryRepository.create({
    localStorage: false,
    storageName: "ProductCategoryRepository",
  });
  export default ProductCategoryStore;