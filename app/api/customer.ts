import AppConfig from "app/config/app";
import api, { IAPI } from "libs/utils/api";
import SessionStore from "app/model/session";
import { toJS } from "mobx";

const session = SessionStore;

const getList = async (limit: string = "") => {

  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListCustomer`,
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
const getDetail = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailCustomer`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      customer: id,
    },
  });

  if (typeof res === "object" && !!res.id) {
    return res;
  }
  return {};
};
const save = async (data: any) => {
  let url = `${AppConfig.serverUrl}index.php?r=apiService/saveCustomer`;
  console.log(JSON.stringify({
    url,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      data: data,
    },
  }))
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

const savePhoto = async (jwt: string, data: any, foto?: any) => {
  data = clean(data)
  const fdata = generateFormData(data);
  if (!!session.user.id_client) {
    fdata.append("client", String(session.user.id_client));
  }

  if (!!foto) {
    fdata.append("foto", foto);
  }
  const params: IAPI = {
    method: "post",
    url: `${AppConfig.serverUrl}index.php?r=apiService/saveCustomerPhoto`,
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    data: fdata,
    onError: (e) => console.log(e),
  };
  console.log(JSON.stringify(params.headers))
  const res: any = await api(params);
  console.log(JSON.stringify(res))
  if (typeof res === "object") {
    if (!!res.status) {
      return res.status;
    } else {
      alert(res.errors);
      return null;
    }
  } else {
    alert(JSON.stringify(res));
  }
}

const editData = async (data: any) => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/editCustomer`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      customer: data.id,
      address: data.address,
      phone1: data.phone1,
      phone2: data.phone2,
      fax: data.fax,
      credit_limit: data.credit_limit,
      contact_person_name: data.contact_person_name,
      contact_person_phone: data.contact_person_phone,
      npwp: data.npwp,
      tax_address: data.tax_address,
      payment_term: data.payment_term,
      id_segment: data.id_segment,
      identity: data.identity,
      email: data.email,
      is_customer: data.is_customer,
      is_vendor: data.is_vendor,
    },
  });
  return res;
};

const getOutlets = async (id: any, limit: string = "") => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListCustomerOutlet`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      customer: id,
      limit: limit,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};
const getDetailOutlet = async (id: any) => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailCustomerOutlet`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      userToken: SessionStore.user.user_token,
      client: SessionStore.user.id_client,
      outlet: id,
    },
  });
  return res;
};
const checkOutletKey = async (id: any, key: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/checkOutletKey`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      outlet: id,
      key,
    },
  });
  if (!!res) {
    return res === 1;
  }
  return false;
};
const getListSegment = async () => {
  let res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/listCustomerSegment`,
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

const postDelete = async (data: any) => {
  data.id_client = session.user.id_client
  data = clean(data)
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=Api`,
    method: "post",
    data: {
      token: AppConfig.appToken,
      user_token: SessionStore.user.user_token,
      mode: "delete",
      findByPk: "MCustomer",
      model: "MCustomer",
      attributes: data
    },
  });
  //console.log(JSON.stringify(res))
  if (!!res && !!res.data.code) {
    return res;
  }
  alert(toJS(res))
  return {};
};

function clean(obj: any) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
      delete obj[propName];
    }
  }
  return obj
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


const CustomerAPI = {
  getList,
  getDetail,
  save,
  editData,
  getOutlets,
  getDetailOutlet,
  checkOutletKey,
  getListSegment,
  postDelete,
  savePhoto
};

export default CustomerAPI;
