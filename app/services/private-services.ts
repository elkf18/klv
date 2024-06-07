import ActivityStore from "app/model/activity";
import AdditionalStore from "app/model/additional";
import CustomerStore from "app/model/customer";
import DashboardStore from "app/model/dashboard";
import OpportunityStore from "app/model/opportunity";
import ProductStore from "app/model/product";
import SalesStore from "app/model/sales";
import printer from "./printer";

const PrivateService = () => {
  
  AdditionalStore.load()

  CustomerStore.load();
  CustomerStore.loadSegment();
  ActivityStore.loadBaru();
  ActivityStore.loadBerjalan();
  ActivityStore.loadSelesai();
  DashboardStore.load();
  OpportunityStore.load();
  ProductStore.load();
  SalesStore.load();

  printer();
};

export default PrivateService;
