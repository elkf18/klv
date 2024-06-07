import AppConfig from "app/config/app";
import api, { IAPI } from "libs/utils/api";
import SessionStore from "app/model/session";
import { toJS } from "mobx";

const session = SessionStore;

const getList = async (offset: number = 0) => {

  console.log(JSON.stringify({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getNotif`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      offset:offset
    },
  }))
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getNotif`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      offset:offset
    },
  });
  console.log(JSON.stringify(res))
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const NotificationAPI = {
    getList
  };
  
  export default NotificationAPI;