import PromoAPI from "app/api/promo";
import { Model } from "libs/model/model";


export class Promo extends Model {
    id: number = 0;
    name: string = "";
    info: string = "";
    is_active: string = "N";
    type: string = "";
    discount_percent: number =0;
    max_discount_value: number=0;
    discount_amount: number=0;
    created_time: string = "";
    id_client: number = 0;
}

export class PromoRepository extends Model {
    list: Promo[] = Promo.hasMany(this);

    public async reload() {
        this.list=[]
        await PromoAPI.load().then((res:any) => {
            this._loadJSON({
                list:res.data
            })
        })
    }
}

const PromoStore = PromoRepository.create({
    localStorage: false,
    storageName: "PromoRepository",
  });
  export default PromoStore;