import api, { IAPI } from "libs/utils/api";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";
import { toJS } from "mobx";
import { Product } from "app/model/product";



const getList = async () => {
  console.log(JSON.stringify({
    url: `${AppConfig.serverUrl}index.php?r=apiService/listProductVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      outlet:SessionStore.user.id_outlet
    },
  }))
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/listProductVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      outlet:SessionStore.user.id_outlet
    },
  });

  
  
  //console.log(JSON.stringify(res))
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};
const getDetail = async (id: any) => {


  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailProductVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      product: id,
      outlet:SessionStore.user.id_outlet
    },
  });
  if (!!res && !!res.id) {
    return res;
  }
  return {};
};

const getCategoryProduct = async () => {
  
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=Api`,
    method: "post",
    data: {
      token: AppConfig.appToken,
      user_token: SessionStore.user.user_token,
      mode : "find",
      model : "MProductCategory",
      condition:`id_client=${SessionStore.user.id_client}`
    },
  });
  
  if (!!res && res.status=="200") {
    
    return res.data;
  }
  return {};
};

const getTypeProduct = async () => {
  
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=Api`,
    method: "post",
    data: {
      token: AppConfig.appToken,
      user_token: SessionStore.user.user_token,
      mode : "find",
      model : "MProductType"
    },
  });
  
   
  if (!!res && res.status=="200") {
     if(!!res.data){
      return res.data;
     }else{
      return {};
     }
  }
  return {};
};

const deleteProduct = async (id: any) => {
  console.log(JSON.stringify({
    url: `${AppConfig.serverUrl}index.php?r=apiService/deleteProductVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      product: id,
    },
  }))
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/deleteProductVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      product: id,
    },
  });
  if (!!res && res.status==true) {
    return res.status;
  }else if(!!res && res.status==false){
    alert(res.message);
  }
  return {};
};


// const save = async (data: any) => {
//   data.created_by=SessionStore.user.id
//   data.created_date=new Date()
//   data.id_client=SessionStore.user.id_client

//   const res: any = await api({
//     url: `${AppConfig.serverUrl}index.php?r=Api`,
//     method: "post",
//     data: {
//       token: AppConfig.appToken,
//       user_token: SessionStore.user.user_token,
//       mode : "edit",
//       model : "MProduct",
//       attributes : data
//     },
//   });
   

//   if (!!res && !!res.data.code) {
//     return res;
//   }
//   alert(toJS(res))
//   return {};
// };


const save = async (data: any) => {
  data.created_by=SessionStore.user.id
  data.created_date=new Date()
  data.id_client=SessionStore.user.id_client

  data=clean(data)

  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/saveProductVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      data: data,
    },
  });
   

  console.log(res);
  if (typeof res === "object" && res.status === "success") {
    return { status: true, res };
  }

  let myMap = new Map(Object.entries(res.errors));
  let error=""
  myMap.forEach((value: any, key: any) => {
    error=error+key+"- "+value+"\n"
});

  alert(error);
  return false;
};

const getCategory = async (member?: number) => {
  const res = await api({
    url: `${AppConfig.serverUrl}/index.php?r=apiService/getListCategory_update`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      outlet: SessionStore.user.id_outlet,
      limit: "",
      customer: member,
    },
  });

  console.log(JSON.stringify({
    url: `${AppConfig.serverUrl}/index.php?r=apiService/getListCategory_update`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      outlet: SessionStore.user.id_outlet,
      limit: "",
      customer: member,
    },
  }))
  
  
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const savePhoto = async (jwt: string, data: any, foto?: any) => {
  data=clean(data)
  const fdata = generateFormData(data);
  if(!!SessionStore.user.id_client){
    fdata.append("id_client", String(SessionStore.user.id_client));
    fdata.append("created_by", String(SessionStore.user.id));
    fdata.append("id_product_type", String(data.id_product_type));
    fdata.append("user_token", String(SessionStore.user.user_token));
    fdata.append("id_outlet", String(SessionStore.user.id_outlet));
  }
  
  if (!!foto) {
    fdata.append("url_pic", foto);
  }
  const params: IAPI = {
    method: "post",
    url : `${AppConfig.serverUrl}index.php?r=apiService/saveProductVisitPhoto`,
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    data: fdata,
    onError: (e) => console.log(e),
  };
  
   //console.log(JSON.stringify(params))
  const res: any = await api(params);
  
  
  if (typeof res === "object" && res.status === "success") {
    return { status: true, res };
  }
  // alert(JSON.stringify(res))

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

const ProductAPI = {
  getList,
  getDetail,
  deleteProduct,
  save,
  savePhoto,
  getCategoryProduct,
  getTypeProduct,
  getCategory
};

export default ProductAPI;
