import api from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";

const session = SessionStore;
const getSalesFunnel = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/dashboardSalesFunnel`,
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

const getSalesFunnelReverse = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/dashboardSalesFunnel`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
    },
  });
  if (Array.isArray(res)) {
    if(res.length>0){
      return res.reverse();
    }else{
      return res;
    }
    
  }
  return [];
};

const getAtivity = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/dashboardJumlahAktivitas`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      period: new Date(),
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getOpportunitySales = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/dashboardTop10OpportunitySalesman`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      period: new Date(),
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getOpportunityCustomer = async () => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/dashboardTop10OpportunityPelanggan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      period: new Date(),
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};


const getDashboard = async () => {
  // console.log(JSON.stringify({

  //   url: `${AppConfig.serverUrl}index.php?r=apiService/getDashboardMobile`,
  //   method: "post",
  //   data: {
  //     appName: AppConfig.appName,
  //     appToken: AppConfig.appToken,
  //     client: SessionStore.user.id_client,
  //     userToken: SessionStore.user.user_token,
  //     period: new Date(),
  //   },
  // }))
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDashboardMobile`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      period: new Date(),
    },
  });
  if (typeof res === "object") {
    return res;
  }
  return {};
};

const DashboardAPI = {
  getSalesFunnel,
  getSalesFunnelReverse,
  getAtivity,
  getOpportunityCustomer,
  getOpportunitySales,
  getDashboard
};

export default DashboardAPI;
