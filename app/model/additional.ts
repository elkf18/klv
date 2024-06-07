import AdditionalAPI from "app/api/additional";
import { Model } from "libs/model/model";
import { runInAction } from "mobx";
import SessionStore from "./session";

export class FieldSingle extends Model {
    variable = "";
    type = "";
    label = "";
    placeholder = "";
    value = "";

    subtype = "";
    list = List.hasMany(this);
  }

  export class List extends Model {
    label="";
    value=""
  }

  export class FieldRole extends Model {
    role = "";
    fields: FieldSingle[] = FieldSingle.hasMany(this);

    
  }
  
  export class AdditionalRepository extends Model {
    activity: FieldRole[] = FieldRole.hasMany(this);
    sales: FieldRole[] = FieldRole.hasMany(this);
    customer: FieldRole[] = FieldRole.hasMany(this);
    
    loading = false;

    get getList() {
      return this._json.list;
    }

    async load() {
      this.loading = true;
      AdditionalAPI.getList().then((res:any) => {
        // console.log("vvvvvvvvvv")
        // console.log(JSON.stringify(res))
        runInAction(()=>{
          if(!!res.activity){
            this.activity = res.activity
          }else{
            this.activity = []
          }

          if(!!res.sales){
            this.sales = res.sales
          }else{
            this.sales = []
          }

          if(!!res.customer){
            this.customer = res.customer
          }else{
            this.customer = []
          }
          
        })
        //this._loadJSON(res._json);

        this._loadJSON({
          
          loading:false
        });
      });
    }

  
    get activityFields():FieldSingle[] {
      var r = SessionStore.role.role_desc
      // var f = this.activity.filter((item) => {
      //   let match = false;
      //   if (!!r) {
      //     let f1 = r.toLowerCase() == item.role.toLowerCase()
      //     match = !!f1 
      //   }else{
      //     let f1 = "*" == item.role.toLowerCase()
          
      //     match = !!f1 
      //   }
        
      //   return match;
      // });

      // if(f.length==0){
      //   f = this.activity.filter((item) => {
      //     return "*" == item.role.toLowerCase()
      //   });
      // }
      return this.activity[0].fields
    }

    
  }
  
  const AdditionalStore = AdditionalRepository.create({
    localStorage: true,
    storageName: "AdditionalRepository",
  });
  export default AdditionalStore;
  