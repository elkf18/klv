import api from "libs/utils/api";
import { dateFormat } from "libs/utils/date";
import SessionStore from "app/model/session";
import AppConfig from "app/config/app";
import { toJS } from "mobx";

const session = SessionStore;

interface Filter {
  mode?: number;
  visit_date?: string;
  created_date?: string;
  status?: string;
  search?: string;
}

const getList = async (filter: Filter, limit: string = "") => {
  let { mode = 1, status } = filter;
  let vdate = !!filter.visit_date
    ? dateFormat(new Date(filter.visit_date), "yyyy-MM-dd")
    : null;

  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListRoadPlan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      visitDate: vdate,
      limit,
      planStatus: !!status ? status : null,
      mode,
    },
  });

  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getListPage = async (filter: Filter, limit: number = 20, offset: number = 0, id_sales: number = 0) => {
  let { mode = 1, status } = filter;

  let vdate = !!filter.visit_date
    ? dateFormat(new Date(filter.visit_date), "yyyy-MM-dd")
    : null;
  let search = !!filter.search
    ? filter.search
    : "";

  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getListRoadPlan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      visitDate: vdate,
      search: search,
      limit,
      offset,
      planStatus: !!status ? status : null,
      mode,
      id_sales: (id_sales == 0 ? null : id_sales),
      user: { id: session.user.id, role: session.role.role_name },
    },
  });

  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const getRemainder = async () => {
  let mode = 1;

  const res = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getRemainderRoadPlan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      mode,
    },
  });

  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

const save = async (data: any) => {
  let url = `${AppConfig.serverUrl}index.php?r=apiService/saveActivity`;

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
    return res;
  }
  alert("Gagal menyimpan.");
  return false;
};
const getDetail = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getDetailRoadPlan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      road_plan: id,
    },
  });

  if (!!res && !!res.id) {

    return res;
  }
  return {};
};
const getRecord = async (id: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/getRecordRoadPlan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      road_plan: id,
    },
  });
  if (!!res && !!res.id) {
    return res;
  }
  return {};
};
const canCheckin = async () => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/canCheckInRoadPlan`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
    },
  });
  if (!!res) {
    return res === 1;
  }
  return false;
};
const checkedIn = async (data: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/setCheckInVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      ...data,
    },
  });
  if (!!res && res === 1) {
    return true;
  }
  return false;
};
const checkedOut = async (data: any) => {
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/setCheckOutVisit`,
    method: "post",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      ...data,
    },
  });
  if (!!res && res === 1) {
    return true;
  }
  return false;
};
const approval = async (data: any) => {
  let approve_date = dateFormat(new Date(data.approve_date), "yyyy-MM-dd");
  const res: any = await api({
    url: `${AppConfig.serverUrl}index.php?r=apiService/approveRoadPlan`,
    method: "post",
    data: JSON.stringify({
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      client: SessionStore.user.id_client,
      userToken: SessionStore.user.user_token,
      ...data,
      approve_date,
    }),
  });
  if (!!res && res === 1) {
    return true;
  }
  return false;
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
      findByPk: "TRoadPlan",
      model: "TRoadPlan",
      attributes: data
    },
  });

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

const ActivityAPI = {
  getList,
  getDetail,
  save,
  getRecord,
  canCheckin,
  checkedIn,
  checkedOut,
  approval,
  postDelete,
  getRemainder,
  getListPage
};

export default ActivityAPI;
