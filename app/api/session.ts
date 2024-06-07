import AppConfig from "app/config/app";
import SessionStore from "app/model/session";
import { AxiosRequestConfig } from "axios";
import api from "libs/utils/api";
import { runInAction, toJS } from "mobx";
import LogAPI from "./log";

export interface IAPI extends AxiosRequestConfig {
  onError?: (res: any) => void;
}

const login = async (data: any) => {
  const params: any = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/LoginMobile",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      data,
    },
  };


  console.log(JSON.stringify({
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/LoginMobile",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      data,
    },
  }));
  
  const res: any = await api(params);
  if (typeof res === "object") {
    if (!!res.status) {
      return res.data;
    } else {
      //alert(res.message);
      return {};
    }
  } else {
    LogAPI.saveLog({
      data: {
        ...params,
        result: res,
      },
    });
  }
};


const changePassword = async (data: any, token: string) => {
  const params: any = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/changePassword",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      data,
    },
  };
  const res: any = await api(params);
  if (typeof res === "object") {
    alert(res.message);
    if (!!res.status) {
      return res.reauth;
    } else {
      return {};
    }
  } else {
    LogAPI.saveLog({
      data: {
        ...params,
        result: res,
      },
    });
  }
};



const changePass = async (oldp: string, newp: string) => {
  const params: any = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/changePass",
    
    data: {
      id_user:SessionStore.user.id,
      new:newp,
      username:SessionStore.user.username,
      password:oldp
      
    },
  };
  const res: any = await api(params);
  console.log({
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/changePass",
    
    data: {
      id_user:SessionStore.user.id,
      new:newp,
      username:SessionStore.user.username,
      password:oldp
      
    },
  })
  //console.log(JSON.stringify(res))
  if (typeof res === "object") {
    alert(res.message);
    if (!!res.status) {
      return res.status;
    } else {
      return {};
    }
  } else {
    // LogAPI.saveLog({
    //   data: {
    //     ...params,
    //     result: res,
    //   },
    // });
  }
};



const requestOTP = async (data: any) => {
  const params: IAPI = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/RequestOTP",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: AppConfig.client,
      data,
    },
  };
  console.log(JSON.stringify(params))
  const res: any = await api(params);
  if (typeof res === "object") {
    if (!!res.status) {
      return String(res.otp || "");
    } else {
      return "";
    }
  } else {
    LogAPI.saveLog({
      data: {
        ...params,
        result: res,
      },
    });
  }
};

const requestMailOTP = async (data: any) => {
  const params: IAPI = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/RequestMailOTP",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: AppConfig.client,
      data,
    },
  };
  console.log(JSON.stringify(params))
  const res: any = await api(params);
  console.log(res)
  if (typeof res === "object") {
    if (!!res.status) {
      return String(res.otp || "");
    } else {
      return "";
    }
  } else {
    LogAPI.saveLog({
      data: {
        ...params,
        result: res,
      },
    });
  }
};



const register = async (id:any) => {

  const res:any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiAuth/registerAPI`,
    method: "post",
    data: {
      AppRegistration:{
        password:SessionStore.formRegist.password,
        pic_name:SessionStore.formRegist.pic_name,
        client_name:SessionStore.formRegist.client_name,
        username:SessionStore.formRegist.username,
        email:SessionStore.formRegist.email,
        phone:SessionStore.formRegist.phone
      }
    },
  });
  
    console.log(res)
    console.log(toJS(res))
  if (!!res&& res.status==true) {
    //alert("Silahkan Login")
    runInAction(()=>{
      SessionStore.username = SessionStore.formRegist.username
      SessionStore.password = SessionStore.formRegist.password
    })
    
    SessionStore.initFormRegist()
    return res
  }
  //alert("Wajib isi data yang bertanda(*)")
  
  var error="";

  if(res.message.password){
    error = error+"-"+res.message.password+"\n"
  }
  if(res.message.pic_name){
    error = error+"-"+res.message.pic_name+"\n"
  }
  if(res.message.client_name){
    error = error+"-"+res.message.client_name+"\n"
  }
  if(res.message.username){
    error = error+"-"+res.message.username+"\n"
  }
  if(res.message.email){
    error = error+"-"+res.message.email+"\n"
  }
  if(res.message.phone){
    error = error+"-"+res.message.phone+"\n"
  }

  alert(error)
  return false;
};

const validationOTP = async (data: any) => {
  const params: IAPI = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/validationOTP",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: AppConfig.client,
      data,
    },
  };

  console.log(JSON.stringify(params))

  
  const res: any = await api(params);
  if (typeof res === "object") {
    if (!!res.status) {
      return true;
    } else {
      alert(res.message);
      return false;
    }
  }
  LogAPI.saveLog({
    data: {
      ...params,
      result: res,
    },
  });
  return false;
};

const isRegistered = async (data: any) => {
  const params: IAPI = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuthCustomer/isUserExistNoClient",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      
      data,
    },
  };
  const res: any = await api(params);
  console.log({
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuthCustomer/isUserExistNoClient",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      
      data,
    },
  })
  console.log(toJS(data));
  console.log(toJS(res));
  if (typeof res === "object") {
    if (res.status) {
      return res.exist;
    } else {
      alert(res.message);
      return false;
    }
  } else {
    LogAPI.saveLog({
      data: {
        ...params,
        result: res,
      },
    });
  }
};



const getDetailClient = async () => {
  const res:any = await api({
    url: `${AppConfig.serverUrl}index.php?r=Api`,
    method: "post",
    data: {
      token: AppConfig.appToken,
      user_token: SessionStore.user.user_token,
      mode : "find",
      model : "MClient",
      condition:`id=${SessionStore.user.id_client}`
    },
  });
  
  if (!!res&& res.status==200) {
    
    return res.data[0];
  }
  alert(toJS(res))
  return [];
};

const updateDevice = async (jwt: string, data: any) => {
  const params: IAPI = {
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiAuth/updateDevice",
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    data,
  };
  const res: any = await api(params);
  if (typeof res === "object") {
    if (!!res.status) {
      return true;
    }
  } 
  return false;
};

const SessionAPI = {
  login,
  isRegistered,
  register,
  requestOTP,
  requestMailOTP,
  changePassword,
  validationOTP,
  changePass,
  getDetailClient,
  updateDevice
};

export default SessionAPI;
