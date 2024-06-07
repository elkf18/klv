import { Model } from "libs/model/model";
import { Filter } from "./filter";
import NotificationAPI from "app/api/notification";
import { runInAction } from "mobx";

export class Data extends Model {
  id = null;
  created_date = "";
  group="";
  type: "BIRTHDAY" | "NEXT ORDER" | null = null;
  msg_i = "";
  msg_ii = "";
  msg_iii = "";
  id_user = "";
  ref_data=0;
  ref_data_ii=0;
  title="";
  body="";
  android_channel_id="";
  channelId="";
  isRead = false;
}

export class Notification extends Model {
  collapseKey = "";
  data = Data.childOf(this);
  from = "";
  messageId = "";
  notification = {};
  sentTime = 0;
  ttl = 0;
  isRead = false;

  init(data?: any) {
    let a = new Notification()._json;
    if (!!data) {
      a = data;
    }
    this._loadJSON(data);
  }
}

export class NotificationRepository extends Model {
  list: Notification[] = Notification.hasMany(this);
  dataList: Data[] = Data.hasMany(this);
  detail: Notification = Notification.childOf(this);

  filter: Filter = Filter.childOf(this);
  loading = false;
  lastPage = false;

  get isNew() {
    return this.list.filter((x) => !x.isRead).length > 0;
  }

  get getList(): Notification[] {
    
    return this.list;
  }

  load(offset: number){
    console.log("--->"+offset)
    console.log("Loading "+this.loading)
    console.log("LastPage "+this.lastPage)
    if (offset == 0) {
      
    }
    if (this.lastPage || this.loading) {
      return;
    }
    this._loadJSON({
      loading: true,
    });

    NotificationAPI.getList(offset).then((data) => {
      
      if (data.length>0){
        let arr3 = data.map((item, i) => Object.assign({}, item, this.dataList[i]));
        console.log("Result Merged")
        console.log(JSON.stringify(arr3))
        this.dataList = arr3
      }
      if (data.length === 0) {
        runInAction(()=>{
          this.lastPage = true
        })
        
      }

      this._loadJSON({
        //list: data,
        loading: false
      });
    });
  }

  updateRead() {
    this.list.forEach((x) =>
      x._loadJSON({
        isRead: true,
      })
    );
  }

  receiveNotif(notif: any) {
    
    let idx = this.list.findIndex((x) => x.messageId === notif.messageId);
    let idExist = -1;
    if(!!notif.data.id){
      idExist = this.dataList.findIndex((x) => x.id === notif.data.id);
    }

    if (idx === -1 && idExist===-1) {
      let list = [...this.list];
      list.unshift({
        ...notif,
        isRead: false,
      });

      let dataList = [...this.dataList];
      dataList.unshift({
        ...notif.data,
        isRead: false,
      });

      this._loadJSON({
        list,
        dataList
      });
      
    }
  }
}

const NotificationStore = NotificationRepository.create({
  localStorage: true,
  storageName: "NotificationRepository",
});
export default NotificationStore;
