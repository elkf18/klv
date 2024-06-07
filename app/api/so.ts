import api from "libs/utils/api";
import { dateFormat } from "libs/utils/date";
import { moneyFormat } from "libs/utils/string-format";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";
import { toJS } from "mobx";

const session = SessionStore;

const getList = async (filter: any = null, limit: string = "") => {
  let filterDate = !!filter ? dateFormat(new Date(filter.date), "yyyy-MM-dd") : "";
  let search = !!filter.search
      ? filter.search
      : "";
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListSalesOrder`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date: filterDate,
      search:search,
      limit: limit,
    },
  });


  if (Array.isArray(res)) {
    return res;
  }
  return [];
};


const getListPage = async (filter: any = null, limit: number = 20, offset:number=0, id_sales:number =0) => {
  let filterDate = !!filter ? dateFormat(new Date(filter.date), "yyyy-MM-dd") : "";
  let search = !!filter.search
      ? filter.search
      : "";

    
    console.log(JSON.stringify({
      url: `${AppConfig.serverUrl}index.php?r=apiService/getListSalesOrder`,
      method: "post",
      data: {
        appName: AppConfig.appName,
        appToken: AppConfig.appToken,
        client: SessionStore.user.id_client,
        userToken: SessionStore.user.user_token,
        date: filterDate,
        search:search,
        limit,
        offset,
        id_sales:(id_sales==0?null:id_sales),
        user: { id: session.user.id, role: session.role.role_name },
      },
    }))

  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListSalesOrder`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date: filterDate,
      search:search,
      limit,
      offset,
      id_sales:(id_sales==0?null:id_sales),
      user: { id: session.user.id, role: session.role.role_name },
    },
  });


  if (Array.isArray(res)) {
    return res;
  }
  return [];
};


const getReport = async (filter1: any = null, filter2: any = null, limit: string = "") => {
  let date1 = !!filter1 ? dateFormat(new Date(filter1), "yyyy-MM-dd") : "";
  let date2 = !!filter2 ? dateFormat(new Date(filter2), "yyyy-MM-dd") : "";
  console.log(JSON.stringify({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListSalesOrderReport`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date1: date1,
      date2: date2,
      limit: limit,
    },
  }))
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListSalesOrderReport`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date1: date1,
      date2: date2,
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
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailSalesOrder`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      sales_order: id,
    },
  });

  console.log(JSON.stringify({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailSalesOrder`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      sales_order: id,
    },
  }))

  if (!!res && !!res.id) {
    return res;
  }
  return {};
};

const save = async (data: any) => {
  let url = `${AppConfig.serverUrl}index.php?r=apiService/savePenjualan`;
  console.log(JSON.stringify({
    url,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      data: data,
    },
  }))
  const res: any = await api({
    url,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      data: data,
    },
  });

  if (typeof res === "object" && res.status === "success") {
    return { status: true, res };
  }
  alert("Gagal menyimpan.");
  return { status: false };
};

const saveDelivery = async (data: any) => {
  let url = `${AppConfig.serverUrl}index.php?r=apiService/saveDelivery`;
  const res: any = await api({
    url,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      data: data,
    },
  });
  if (typeof res === "object" && res.status === "success") {
    return true;
  }
  alert("Gagal menyimpan.");
  return false;
};

const savePembayaran = async (data: any) => {
  let url = `${AppConfig.serverUrl}index.php?r=apiService/savePembayaran`;
  const res: any = await api({
    url,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      data: data,
    },
  });

  
  if (typeof res === "object" && res.status === "success") {
    return true;
  } else if (typeof res === "object" && res.status === "failed") {
    if (!!res.errors.total_payment) {
      alert(
        `${res.errors.total_payment} Maksimal pembayaran sebesar ${moneyFormat(
          res.errors.max,
          "Rp. "
        )}.`
      );
    } else {
      alert("Gagal menyimpan.");
    }
  }
  return false;
};

const getListDelivery = async (
  sales_order: number = 0,
  filter: any = null,
  limit: string = ""
) => {
  let filterDate =
    filter instanceof Date ? dateFormat(new Date(filter), "yyyy-MM-dd") : "";
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getAllDelivery`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date: filterDate,
      limit: limit,
      sales_order,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};
const getProductUndelivered = async (
  sales_order: number = 0,
  filter: any = null,
  limit: string = ""
) => {
  let filterDate =
    filter instanceof Date ? dateFormat(new Date(filter), "yyyy-MM-dd") : "";
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getUndelivered`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date: filterDate,
      limit: limit,
      sales_order,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getDeliveryDetail = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDeliveryDetail`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      delivery: id,
    },
  });
  if (!!res && !!res.id) {
    return res;
  }
  return {};
};
const getListInvoice = async (
  delivery: number = 0,
  filter: any = null,
  limit: string = ""
) => {
  let filterDate =
    filter instanceof Date ? dateFormat(new Date(filter), "yyyy-MM-dd") : "";
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getPembayaran`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      date: filterDate,
      limit: limit,
      delivery,
    },
  });
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};
const getTotalPembayaran = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getTotalPembayaran`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      delivery: id,
    },
  });
  if (!!res && typeof res == "object") {
    return res;
  }
  return {};
};

const getReceipt = async (id: number = 0) => {
  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getReceiptSO`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      id,
    },
  });

  console.log({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getReceiptSO`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      id,
    },
  })
  if (!!res) {
    return res;
  }
  return null;
};

const saveAndPay = async (data: any, invoice: any) => {
  // alert(JSON.stringify(invoice))
  // return 
  let url = `${AppConfig.serverUrl}index.php?r=apiService/SaveAndDelivery`;
  
  // console.log(JSON.stringify(
  //   {
  //     url,
  //     method: "post",
  //     data: {
  //       appName: AppConfig.appName,
  //       appToken: AppConfig.appToken,
  //       client: SessionStore.user.id_client,
  //       userToken: SessionStore.user.user_token,
  //       data: data,
  //       invoice: invoice,
  //     },
  //   } 
  // ))
  
  const res: any = await api({
    url,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      data: data,
      invoice: invoice,
    },
  });

  // console.log(JSON.stringify(res))

  if (!!res && typeof res === "object") {
    if (res.status === "success") {
      return {
        status: true,
        res,
      };
    }
  }
  return { status: false };
};

const postDelete = async (data: any) => {
  data = clean(data)
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/deleteSO`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      data: data,
    },
  });
  

  if (!!res && !!res.status) {
    return res;
  }
  alert(toJS(res))
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

const SalesAPI = {
  getList,
  getListPage,
  getDetail,
  save,
  getListDelivery,
  getProductUndelivered,
  getDeliveryDetail,
  saveDelivery,
  getListInvoice,
  savePembayaran,
  getTotalPembayaran,
  getReceipt,
  saveAndPay,
  getReport,
  postDelete
};

export default SalesAPI;
