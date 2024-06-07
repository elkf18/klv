import { Model } from "libs/model/model";
import { dateFormat } from "libs/utils/date";

export class Filter extends Model {
  search = "";
  date = "";
  tab = "";
  showSearch = false;
}
