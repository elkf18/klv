import api from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";

const session = SessionStore;

const getListProduct = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/listProductVisit`,
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
const getDetail = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      visit: id,
    },
  });
  if (!!res && !!res.id) {
    return res;
  }
  return {};
};

const getListBroken = async () => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getVisitListField1`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getListVisitorStatus = async () => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getVisitListField2`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getListDisplayStatus = async () => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getVisitListField3`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const QueryVisit = {
  getListProduct,
  getDetail,
  getListBroken,
  getListVisitorStatus,
  getListDisplayStatus,
};

export default QueryVisit;
