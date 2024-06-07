import SessionStore from "app/model/session";
import AppConfig from "libs/config/app";
import api from "libs/utils/api";


const load = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}/index.php?r=apiServicePOS/getPromoList`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      id_outlet: SessionStore.user.id_outlet,
    },
  });

    //console.log(JSON.stringify(res))
  
  
    if (typeof res === "object") {
      return res;
    }
    return [];
  };
  
  const PromoAPI = {
      load,
    };
    
    export default PromoAPI;