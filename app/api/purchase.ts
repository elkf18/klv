import api from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";

const session = SessionStore;

const getList = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListVendor`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      limit: "",
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};
const getDetail = async (id: any) => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailVendor`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      customer: id,
    },
  });
  return res;
};
const QueryPurchase = {
  getList,
  getDetail,
};

export default QueryPurchase;
