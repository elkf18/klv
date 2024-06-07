
import api from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";
import { toJS } from "mobx";


const session = SessionStore;


const getContractList = async () => {
    const res:any = await api({
      url: `${AppConfig.serverUrl}index.php?r=Api`,
      method: "post",
      data: {
        token: AppConfig.appToken,
        user_token: SessionStore.user.user_token,
        mode : "find",
        model : "MContract"
        //,condition:`id_client=${session.user.id_client}`
      },
    });
  
    
    if (!!res&& res.status==200) {
      return res.data;
    }
    alert(toJS(res))
    return [];
  };



const ContractAPI ={
    getContractList
  }
  export default ContractAPI;