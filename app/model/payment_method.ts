import PaymentMethodAPI from "app/api/payment_method";
import { Model } from "libs/model/model";


export class PaymentMethodSingle extends Model {
    id: string = "";
    name: string = "";
    img_url: string = "";
    id_client	: number = 0;
  }
  

export class PaymentMethodRepository extends Model {
    list: PaymentMethodSingle[] = PaymentMethodSingle.hasMany(this);
  
    public async reload() {
      await PaymentMethodAPI.getList().then((res: any) =>
      this._loadJSON({
        list: res,
      })
    );
    }
  }
  
  const PaymentMethodStore = PaymentMethodRepository.create({
    localStorage: false,
    storageName: "PaymentMethodRepository",
  });
  export default PaymentMethodStore;