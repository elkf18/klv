import { Model } from "libs/model/model";

export class Device extends Model {
  address = "";
  name = "";
}

export class Global extends Model {
  menuList: any[] = [];
  activeMenu: any = {
    label: "",
    path: "",
    icon: {},
  };
  expandMenu: boolean = false;
  timer = 0;
  loadingScanDV = false;
  enabledBT = false;
  pairedBT: Device[] = [];
  foundBT: Device[] = [];
  connectedDV = Device.childOf(this);
  printQty = 1;


  deviceToken = "";

  initConnectedDV() {
    let a = new Device();
    this.connectedDV._loadJSON(a._json);
  }
}
const GlobalStore = Global.create({
  localStorage: true,
  storageName: "Global",
});
export default GlobalStore;
