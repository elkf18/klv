import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import ProductAPI from "app/api/product";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData, generateFileObj } from "./utils";
import CacheStore from "./cache";
import _ from "lodash";
import { runInAction, toJS } from "mobx";
import AppConfig from "libs/config/app";
import { ToastAndroid } from "react-native";
import SalesStore from "./sales";
import { dateFormat } from "libs/utils/date";
export class Product extends Model {
  id = null;
  price = null;
  name = "";
  code = "";
  unit = "";
  unit_1 = "";
  id_category = null;
  id_product_type = 1;
  product_name = "";
  product_group = "";
  url_pic = null;
  description="";
  normal_price : number|null= null;
  valid_price = null;
  grup_price = null;
  usia_pakai = null;

  product_prices: ProductPrice[] = ProductPrice.hasMany(this);
  product_outlet: ProductOutlet[] = ProductOutlet.hasMany(this);
  loading = false;
  saving = false;
  cached = false;

  init() {
    this._loadJSON({...(new Product()._json)});
    //this.id_product_type=1
  }

  addPrices() {
    let a = new ProductPrice();
    a.init();
    a._loadJSON({
      id_product: !!ProductStore.form.id ? ProductStore.form.id : null,
      created_by: SessionStore.user.id,
      valid_from: dateFormat(new Date(), "yyyy-MM-dd")
    });
    this.product_prices.push(a._json);
  }

  async delete() {
    let res: any = await ProductAPI.deleteProduct(this.id);
    if (res==true) {
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
        let cs = new Product()._loadJSON(this._json);
        CacheStore.product.push(cs);
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

    //let res: any = await ProductAPI.save(this._json);
    let data = this._json;
    const foto = await generateFileObj(data.url_pic);
    let res: any = await ProductAPI.savePhoto(SessionStore.jwt, data, foto);
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
  deletePrices(key: number) {
    ProductStore.form.product_prices.splice(key, 1);
  }

  async load(id: number, editable: boolean = false) {
    if (
      !editable ||
      (!this.cached && !!id) ||
      (!!this.cached && this.id !== id)
    ) {
      this.loading = true;
      let data = await ProductAPI.getDetail(id);
      data = {
        ...data,
        loading: false,
      };
      this._loadJSON(data);
    } else if (!this.cached || !id || (!!this.cached && this.id !== id)) {
      this.init();
    }
  }
}

export class ProductPrice extends Model {
  id = null;
  price = 0;
  valid_from = "";
  valid_until = null;
  status = "Aktif";
  unit = "";
  price_non_ppn = 0;
  id_product = 0;
  id_contract = null;
  id_area = null;
  created_by = 0;
  created_date = "";
  id_client = 0;

  init() {
    this._loadJSON(new ProductPrice()._json);
  }
}

export class ProductOutlet extends Model {
  id_outlet = "";
  nama = "";
  price = "";
  init() {
    this._loadJSON(new ProductOutlet()._json);
  }
}
export class CategorySingle extends Model {
  id: number = 0;
  name: string = "";
  description?: string = "";
  sequence: number = 0;
}

export class Category extends Model {
  id: number = 0;
  category: string = "";
  sequence: number = 0;
  product: Product[] = [];

  data: Product[] = [];
  expand = false;
  selected = false;
  selectCount=0;
}

export class ProductRepository extends Model {
  list: Product[] = [];
  filter: Filter = Filter.childOf(this);

  filterCategory: Filter = Filter.childOf(this);

  activeCategory: number = 0;
  activeSubCategory: number = 0;
  detail: Product = Product.childOf(this);
  form: Product = Product.childOf(this);
  categories: Category[] = Category.hasMany(this);
  loading = false;


  productById(i:number):Product|undefined{
    let x = this.list.filter((item) => {
      return item.id==i
    })
    
    if(x.length===0){
      return undefined
    }else{
      return x[0]
    }
    
  }
  get getList(): any[] {
    return this.list.filter((item) => {
      let match = true;
      if (!!this.filter.search) {
        let f1 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.product_name || "").toLowerCase()
        );
        f1 =
          f1 ||
          (item.product_name || "")
            .toLowerCase()
            .includes(this.filter.search.toLowerCase());

        let f2 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.product_group || "").toLowerCase()
        );
        f2 =
          f2 ||
          (item.product_group || "")
            .toLowerCase()
            .includes(this.filter.search.toLowerCase());

        let f3 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.code || "").toLowerCase()
        );

        f3 =
          f3 ||
          (item.code || "")
            .toLowerCase()
            .includes(this.filter.search.toLowerCase());

        match = !!f1 || !!f2 || !!f3;
      }
      return match;
    });
  }

  get getProduct(): any[] {
    const list = [...this._json.categories];
    return list
       .map((d: Category) => {
         let product = d.product
      .filter((x: Product) => {
          const search = this.filterCategory.search.toLowerCase();
          let match = true
          if (!!search && !!x.product_name) {
            const value = x.product_name.toLowerCase();
            match=match&& value.includes(search);
          }
          if (!!this.filterCategory.tab) {
            if(Number(this.filterCategory.tab)>0){
              match = match && (d.id )===(Number(this.filterCategory.tab))
            }
            
          }
          return match;
        });

        return {
          category:d.category,
          data: product,
        };
      })
      .filter((x: any) => x.data.length > 0);
  }


  get getProductModal(): any[] {
    const list = [...this._json.categories];
    return list
       .map((d: Category) => {
         let product = d.product
      .filter((x: Product) => {
          const search = this.filterCategory.search.toLowerCase();
          let match = true
          if (!!search && !!x.product_name) {
            const value = x.product_name.toLowerCase();
            match=match&& value.includes(search);
          }
          return match;
        });
        d.product= product 
        d.data = product
        return d
      })
      .filter((x: any) => x.data.length > 0);
  }

  getProductModalId(id:number): any[] {
    const list = [...this._json.categories];
    return list
       .map((d: Category) => {
         let product = d.product
      .filter((x: Product) => {
          
          let match = true
            const value = x.id;
            match=match&& value==id;
          return match;
        });
        d.product= product 
        d.data = product
        return d
      })
      .filter((x: any) => x.data.length > 0);
  }

  get getCategoryList():any[] {
    return this.categories.filter((item) => {
      let match = true;
      if (!!this.filterCategory.search) {
        item.product = this.getCategoryFilterProduct(item);
        match = item.product.length > 0;
      }
      return match;
    });
  }


  get getCategorySelect() {
    var x : Category[] =[]

    var all=new Category()
    all.category="Semua Kategori"
    all.id=0
    x.push(all)

    x.push(...this.categories)
    
    return x
  }

  get getCategoryPage() {
    return this.categories.filter((item) => {
      let match = true;
      // if (!!this.filterCategory.search) {
      //  // match =(item.category || "").toLowerCase().includes(this.filterCategory.search.toLowerCase())

      //   item.product = this.getCategoryFilterProduct(item);

      //   match = match && item.product.length > 0;
      // }

      if (!!this.filterCategory.tab) {
        if(Number(this.filterCategory.tab)>0){
          match = match && (item.id )===(Number(this.filterCategory.tab))
        }
        
      }
      return match;
    });
  }

  getCategoryFilterProduct(x: Category) {
    return x.product.filter((item) => {
      let match = true;
      if (!!this.filterCategory.search) {
        let f1 = (item.product_name || "")
          .toLowerCase()
          .includes(this.filterCategory.search.toLowerCase());

      
        // let f2 = (item.code || "")
        //   .toLowerCase()
        //   .includes(this.filterCategory.search.toLowerCase());
        match = !!f1 //|| !!f2;
      }
      return match;
    });
  }

  onExpand(y: number){
    let index = this.categories.findIndex(x => x.id ===y);
    if(index>=0){
      runInAction(()=>{
        this.categories[index].expand = !this.categories[index].expand
      })
    }else{
      //alert(y)
    }
  }
  onSelect(item:any,y: Category){
    const select = SalesStore.tempForm.t_sales_order_lines.findIndex(
      (x) => x.id_product === item.id
    );

    let index = this.categories.findIndex(x => x.id ===y.id);
    ToastAndroid.show(select.toString(),ToastAndroid.SHORT)
    if (!this.categories[index].selected) {
      runInAction(() => (this.categories[index].selected = select > -1));
    } else {
      runInAction(() => (this.categories[index].selected = select > -1));
    }
  }


  onSelectX(y: Category){
    const pForm=SalesStore.tempForm.t_sales_order_lines.map((p)=>{
      return p.id_product
    })
    const pList=y.data.map((p)=>{
      return p.id
    })

    const selected = pForm.some(r=> pList.indexOf(r) >= 0)

    let index = this.categories.findIndex(x => x.id ===y.id);
    if(index>=0){
      runInAction(()=>{
        this.categories[index].selected = selected
      })
    }else{
      //alert(y)
    }
  }

  get getStatus() {
    let list = [
      { value: "Aktif", label: "Aktif" },
      { value: "Non Aktif", label: "Non Aktif" },
    ];
    return list;
  }

  async load() {
    this.loading = true;
    let data = await ProductAPI.getList();
    this._loadJSON({
      list: data,
      loading: false,
    });
  }


  async loadCategory(member?:number) {
    this.loading = true;
    console.log("X")
    let data = await ProductAPI.getCategory(member);
    this._loadJSON({
      categories: data,
      loading: false,
    });

    this.categories[0].expand = true;
  }
}
const ProductStore = ProductRepository.create({
  localStorage: true,
  storageName: "ProductRepository",
});
export default ProductStore;
