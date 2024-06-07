import api, { IAPI } from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";
import { toJS } from "mobx";




const getList = async () => {
    const res :any = await api({
      url: `${AppConfig.serverUrl}index.php?r=apiService/listOutlet`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        userToken: SessionStore.user.user_token,
        client: SessionStore.user.id_client,
        limit:""
      },
    });

    
    
  
    if (!!res&& Array.isArray(res)) {
      return res;
    }
    
    return [];
  };


  const getAreaList = async () => {
    const res:any = await api({
      url: `${AppConfig.serverUrl}index.php?r=Api`,
      method: "post",
      data: {
        token: AppConfig.appToken,
        user_token: SessionStore.user.user_token,
        mode : "find",
        model : "MArea",
        condition:`id_client=${SessionStore.user.id_client}`
      },
    });
  
    
    if (!!res&& res.status==200) {
      return res.data;
    }
    alert(toJS(res))
    return [];
  };

  const getDetail = async (id:any) => {

    const res:any = await api({
      url: `${AppConfig.serverUrl}index.php?r=Api`,
      method: "post",
      data: {
        token: AppConfig.appToken,
        user_token: SessionStore.user.user_token,
        mode : "function",
        function:"detailOutletApi",
        model : "MOutlet",
        params:{
          client:SessionStore.user.id_client,
          id:id,
        }
      },
    });
    
    if (!!res) {
      
      return res;
    }
    alert(toJS(res))
    return [];
  };

  const save = async (data: any) => {
    data.created_by=SessionStore.user.id
    data.created_date=new Date()
    data.id_client=SessionStore.user.id_client
    data.created_time=new Date()

    data = clean(data)
    const res: any = await api({
      url: `${AppConfig.serverUrl}index.php?r=Api`,
      method: "post",
      data: {
        token: AppConfig.appToken,
        user_token: SessionStore.user.user_token,
        mode : "edit",
        model : "MOutlet",
        attributes : data
      },
    });
    
  
    if (!!res && res.status=="200") {
      return res;
    }
    
    alert(JSON.stringify(res))
    
    return {};
  };


  const savePhoto = async (jwt: string, data: any, foto?: any) => {
    data=clean(data)
    const fdata = generateFormData(data);
    if(!!SessionStore.user.id_client){
      fdata.append("id_client", String(SessionStore.user.id_client));
      fdata.append("client", String(SessionStore.user.id_client));
      fdata.append("user_token", String(SessionStore.user.user_token));
      fdata.append("created_by", String(SessionStore.user.id));
    }
    
    if (!!foto) {
      fdata.append("img_url", foto);
    }
    const params: IAPI = {
      method: "post",
      url : `${AppConfig.serverUrl}index.php?r=apiService/saveOutletPhoto`,
      headers: {
        authorization: `Bearer ${jwt}`,
      },
      data: fdata,
      onError: (e) => console.log(e),
    };
    
     //console.log(JSON.stringify(params))
    const res: any = await api(params);
    console.log(JSON.stringify(res.status))
    
    if (typeof res === "object" && res.status) {
      console.log("------")
      return { status: true, res };
    }
   
  
    if (typeof res === "object"){
      let myMap = new Map(Object.entries(res.errors));
      let error=""
      myMap.forEach((value: any, key: any) => {
        error=error+key+"- "+value+"\n"
      });
      if(error===""){
        error=res
      }
      alert(error);
    }else{
      alert(res);
    }
    
    return false;
  }


  const postDelete = async (data: any) => {
    data.created_by=SessionStore.user.id
    data.created_date=new Date()
    data.id_client=SessionStore.user.id_client
    data.created_time=new Date()

    data = clean(data)
    const res: any = await api({
      url: `${AppConfig.serverUrl}index.php?r=Api`,
      method: "post",
      data: {
        token: AppConfig.appToken,
        user_token: SessionStore.user.user_token,
        mode : "delete",
        findByPk : "MOutlet",
        attributes : data
      },
    });
    
  
    if (!!res && !!res.data.code) {
      return res;
    }
    alert(toJS(res))
    return {};
  };

  export const generateFormData = (data: any) => {
    const fdata = new FormData();
  
    for (const key in data) {
      let v = data[key];
      if (Array.isArray(v)) {
        v = JSON.stringify(v);
      }
      fdata.append(key, v);
    }
    return fdata;
  };
  
  function clean(obj:any) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
        delete obj[propName];
      }
    }
    return obj
  }

  const OutletAPI ={
    getList,
    save,
    getDetail,
    getAreaList,
    postDelete,
    savePhoto
  }
  export default OutletAPI;