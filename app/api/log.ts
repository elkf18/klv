import AppConfig from "app/config/app";
import api, { IAPI } from "libs/utils/api";
interface IData extends Partial<IAPI> {
  result: any;
}

interface ILog {
  data: IData;
  client?: number;
}

const saveLog = async (log: ILog) => {
  api({
    method: "post",
    url: AppConfig.serverUrl + "index.php?r=apiService/saveLog",
    data: {
      appName: AppConfig.appName,
      appToken: AppConfig.appToken,
      ...log,
    },
  });
};

const LogAPI = {
  saveLog,
};

export default LogAPI;
