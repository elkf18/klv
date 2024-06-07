import { Model } from "libs/model/model";
import DashboardAPI from "app/api/dashboard";
import { dateFormat } from "libs/utils/date";

export class Dashboard extends Model {
  activity: any[] = [];
  opCustomer: any[] = [];
  opSales: any[] = [];
  salesFunnel: any[] = [];
  reversedSalesFunnel: any[] = [];
  loading = false;

  //dash:DashItem = new DashItem()
  so:Content = new Content();
  opportunity:OppItem = new OppItem();
  this_month=""
  last_month=""

  async loadOld() {
    DashboardAPI.getAtivity().then((activity) => {
      this._loadJSON({
        activity,
      });
    });
    DashboardAPI.getOpportunityCustomer().then((opCustomer) => {
      this._loadJSON({
        opCustomer,
      });
    });
    DashboardAPI.getOpportunitySales().then((opSales) => {
      this._loadJSON({
        opSales,
      });
    });
    DashboardAPI.getSalesFunnel().then((x) => {
      try {
        this._loadJSON({
          salesFunnel:x,
        });
      } catch (e) {
        console.log('Error')
      }
      
    });
    DashboardAPI.getSalesFunnelReverse().then((x) => {
      try {
          this._loadJSON({
            reversedSalesFunnel:x
          });
      } catch (e) {
      console.log('Error')
      }  
    });

  }

  async load() {
    DashboardAPI.getDashboard().then((d) => {
      this._loadJSON({
        ...d,
      });
      
      
    });
  }


}


export class DashItem extends Model {
  so:Content = new Content();
  opportunity:OppItem = new OppItem();
}

export class OppItem extends Model {
  new:Content = new Content();
  won:Content = new Content();
  lose:Content = new Content();
}

export class Content extends Model {
  current="";
  last="";
  percent="";

  get percentage(){
    let x = Number(this.percent)
    if(x>100){
      x=100
    }
    return x.toFixed(0)
  }

  get over(){
    let x = Number(this.percent)
    if(x<=100){
      x=0
    }else{
      x=x-100
    }
    return x.toFixed(0)
  }
}

const DashboardStore = Dashboard.create({
  localStorage: true,
  storageName: "Dashboard",
});
export default DashboardStore;
