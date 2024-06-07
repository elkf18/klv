import api from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";

const session = SessionStore;

const getList = async (limit: string = "") => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListOpportunity`,
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
    return res;
  }
  return [];
};

const getListStage = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListOpportunityStage`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const save = async (data: any) => {
  //data = clean(data)
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/saveOpportunity`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      data: data,
    },
  });
  

  if (typeof res === "object" && res.status === "success") {
    return true;
  }
  //console.log(JSON.stringify(res))
  alert("Gagal menyimpan.");
  return false;
};

const getDetail = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailOpportunity`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      id: id,
    },
  });
  if (typeof res === "object" && !!res.id) {
    return res;
  }
  return {};
};


function clean(obj:any) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
      delete obj[propName];
    }
  }
  return obj
}

const OpportunityAPI = {
  getList,
  getListStage,
  save,
  getDetail,
};

export default OpportunityAPI;
