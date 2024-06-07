import { useNavigation } from "@react-navigation/native";
import UserAPI from "app/api/user";
import { Model } from "libs/model/model";
import { dateFormat } from "libs/utils/date";
import { runInAction } from "mobx";
import { ToastAndroid } from "react-native";
import { Use } from "react-native-svg";
import CacheStore from "./cache";
import { Filter } from "./filter";
import SessionStore from "./session";
import { confirmData } from "./utils";

export class Role extends Model {
  id = null;
  role_name = ""
  role_description = ""
  menu_path = ""
  home_url = ""
  repo_path = ""
}


export class UsersForm extends Model {
  id = null;
  id_outlet = null
  fullname = ""
  email = ""
  username = ""
  password = ""
  confirm_password = ""
  phone = ""
  r = null
  role_description = ""
  outlet_name = ""
  reg_date = ""

  loading = false
  saving = false

  society() {

  }

  async saveX() {
    console.log("xx")
    this._loadJSON({
      saving: true
    });
    let data = this._json;

    data.reg_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    let res: any = await UserAPI.save(data);
    this._loadJSON({
      saving: false,
    });
    if (!!res) {
      this.init();
      alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  };


  init() {
    this._loadJSON(new UsersForm()._json);
  }

  initForm() {
    UsersStore.detailUser = new UsersForm();
  }

  async reset() {
    let save: any = await confirmData();
    let cs = CacheStore.UsersForm.find((x) => x.id === this.id);
    if (!!save) {
      if (!!cs) {
        cs._loadJSON(this._json);
      } else {
        let cs = new UsersForm()._loadJSON(this._json);
        CacheStore.UsersForm.push(cs);
      }
    } else if (save === false) {
      let csIdx = CacheStore.UsersForm.findIndex((x) => x.id === this.id);
      if (csIdx > -1) CacheStore.UsersForm.splice(csIdx, 1);
      this.init();
    }
    return save;
  }


  async save() {
    this._loadJSON({
      saving: true
    });
    let data = this._json;

    data.reg_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    let res: any = await UserAPI.save(data);
    this._loadJSON({
      saving: false,
    });
    if (!!res) {
      this.init();
      alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  }


  async load(id: number) {
    console.log("load detail")
    this._loadJSON({
      loading: true,
    });
    ToastAndroid.show("loading: "+this.loading,ToastAndroid.SHORT)
    let status = false

    let data = await UserAPI.getDetail(id)

    this._loadJSON({
      ...data,
      loading: false,
    });
    ToastAndroid.show("loading: "+this.loading,ToastAndroid.SHORT)
    status = true


    return status;

  }


  async loadDetail() {
    console.log("load detail")
    this._loadJSON({
      loading: true,
    });
    //ToastAndroid.show("loading: "+this.loading,ToastAndroid.SHORT)
    let status = false

    if(!this.id){
      useNavigation().goBack();
    }
    let data = await UserAPI.getDetail(this.id!!)

    this._loadJSON({
      ...data,
      loading: false,
    });
    //ToastAndroid.show("loading: "+this.loading,ToastAndroid.SHORT)
    status = true


    return status;

  }
}

export class UsersRepository extends Model {
  detailUser: UsersForm = UsersForm.childOf(this);
  formUser: UsersForm = UsersForm.childOf(this);
  list: UsersForm[] = UsersForm.hasMany(this);
  roles: Role[] = Role.hasMany(this);
  filter: Filter = Filter.childOf(this);

  listAssign: UsersForm[] = UsersForm.hasMany(this);



  loading = false;
  saving = false;
  cached = true;
  lastPage = false

  async loadMore(offset: number) {

    if (offset == 0) {
      runInAction(() => {
        this.list = []
      })
      this.lastPage = false
    }
    if (this.lastPage) {
      return;
    }

    this.lastPage = true;
    let mode = 1;
    this._loadJSON({
      loading: true,
    });

    UserAPI.getList(this.filter.search, offset).then((data) => {
      if (offset == 0) {
        runInAction(() => {
          this.list = []
        })
        if (data.length > 0) {
          runInAction(() => {
            this.list = data
          })
        }

      } else {

        runInAction(() => {
          this.list.push(...data)
        })
      }
      if (data.length == 0) {
        this.lastPage = true
      }
      this._loadJSON({
        //list: data,
        loading: false,
      });


    });
  }

  async loadAssign() {
    this._loadJSON({
      loading: true,
    });

    UserAPI.getListAssign().then((data) => {
      if (data.length > 0) {
        

        runInAction(() => {
          this.listAssign=[];
          let non = new UsersForm()
          non.fullname = "- None -"
          this.listAssign.push(non)
          this.listAssign.push(...data)
        })
      }
      this._loadJSON({
        loading: false,
      });


    });
  }

  async loadRoles() {
    UserAPI.getRoles().then((data) => {

      runInAction(() => {
        this.roles = data
      })
    });
  }


  async saveX() {
    console.log("xx")
    this.detailUser._loadJSON({
      saving: true
    });
    let data = this.detailUser._json;

    data.reg_date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    let res: any = await UserAPI.save(data);
    this.detailUser._loadJSON({
      saving: false,
    });
    if (!!res) {
      this.detailUser.init();
      alert("Data berhasil tersimpan.");
      return true;
    }
    return false;
  };

}
const UsersStore = UsersRepository.create({
  localStorage: true,
  storageName: "UsersRepository",
});
export default UsersStore;