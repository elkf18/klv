import SessionStore from "app/model/session";
import AppConfig from "libs/config/app";
import api from "libs/utils/api";
import _ from "lodash";
import { Platform } from "react-native";
import mime from "mime-types";


export default async (value:any, path:any) => {
    if (!value) {
      return null;
    }
    const data = new FormData();
    const uri = value;
    const uripath = uri.split("/");
    const fileName = uripath[uripath.length - 1];
    const type = fileName.slice(fileName.length - 3);
    const file: any = {
      name: fileName,
      //type: "image/" + type,
      type: mime.lookup(fileName),
      uri: Platform.OS === "android" ? uri : uri.replace("file://", "")
    };
    data.append("path", path);
    data.append("file", file);
    data.append("appName", AppConfig.appName);
    data.append("appToken", AppConfig.appToken);
    data.append("client", SessionStore.user.id_client || "");
    data.append("userToken", SessionStore.user.user_token);
  
    console.log("Bearer "+SessionStore.jwt)
    const res = await api({
      url: `${AppConfig.serverUrl}index.php?r=apiService/postUpload`,
      data: data,
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${SessionStore.jwt}`
      },
      method: "post",
    });
    return _.get(res,"path", null);
  };
  