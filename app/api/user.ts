import AppConfig from "app/config/app";
import { Filter } from "app/model/filter";
import SessionStore from "app/model/session";
import { AxiosRequestConfig } from "axios";
import api from "libs/utils/api";
import { runInAction, toJS } from "mobx";
import LogAPI from "./log";

const session = SessionStore;

const getList = async (search: string="", offset: number = 0) => {
  
    const res = await api({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getListUser`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: SessionStore.user.user_token,
        offset: offset,
        search:search
      },
    });
  
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  };


  const getDetail = async (id:number) => {
  
    const res = await api({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailUser`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: SessionStore.user.user_token,
        id: id,
      },
    });

    console.log({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailUser`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: SessionStore.user.user_token,
        id: id,
      },
    })
  
    if (typeof res === "object") {
      return res;
    }
    alert("Gagal memuat.");
    return {};
  };
  

  const getRoles = async () => {
  
    const res = await api({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getRoles`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: session.user.user_token
      },
    });
  
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  };

  const save = async (data: any) => {

    let url = `${AppConfig.serverUrl}index.php?r=apiService/SaveUser`;

    console.log({
      url,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        userToken: SessionStore.user.user_token,
        client: SessionStore.user.id_client,
        data: data,
      },
    })
    const res: any = await api({
      url,
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
    alert("Gagal menyimpan.");
    return false;
  };

  const getListAssign = async () => {
    console.log(JSON.stringify({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getSalesAssign`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: session.user.user_token
      },
    }))
  
    const res = await api({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getSalesAssign`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: session.user.user_token
      },
    });
  
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  };

  const UserAPI = {
    getList,
    save,
    getRoles,
    getDetail,
    getListAssign
  };
  
  export default UserAPI;
  