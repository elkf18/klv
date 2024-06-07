import { TMode } from "libs/config/app";

const mode: TMode = "dev"; // production//"staging"

const AppConfig = {
  mode,
  appName: "mbl_apps_sfa",
  appToken: "4edc0073edc7cb832246685be0ae3518",
  client: -1,
  serverUrl:
    mode === "production"
      ? "https://crm.kelava.id/sfa/"
      : "https://dev.kelava.id/sfa/",
  appRoles: [] as string[],
};

export default AppConfig;
