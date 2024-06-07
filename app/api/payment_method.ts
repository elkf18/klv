import SessionStore from "app/model/session";
import AppConfig from "libs/config/app";
import api from "libs/utils/api";


const getList = async (limit: string = "") => {
    const res = await api({
      url: `${AppConfig.serverUrl}/index.php?r=apiService/getListPaymentMethod`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: SessionStore.user.user_token,
        limit: limit,
      },
    });

    if (Array.isArray(res)) {
        //console.log(JSON.stringify(res))
        
      return res;
    }
    console.log(res)
    return [];
  };



const PaymentMethodAPI = {
  getList,
  
};

export default PaymentMethodAPI;