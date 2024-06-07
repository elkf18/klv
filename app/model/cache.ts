import { Model } from "libs/model/model";
import { Activity } from "./activity";
import { Contact } from "./contact";
import { Customer } from "./customer";
import { Delivery } from "./delivery";
import { Opportunity } from "./opportunity";
import { Outlet } from "./outlet";
import { Payment } from "./payment";
import { Product } from "./product";
import { Sales } from "./sales";
import { UsersForm } from "./users";

export class Cache extends Model {
  activity: Activity[] = [];
  customer: Customer[] = [];
  sales: Sales[] = [];
  opportunity: Opportunity[] = [];
  delivery: Delivery[] = [];
  payment: Payment[] = [];
  product: Product[] = [];

  outlet:Outlet[]=[];

  contact:Contact[]=[];

  UsersForm:UsersForm[]=[];
}
const CacheStore = Cache.create({ localStorage: true, storageName: "Cache" });
export default CacheStore;
