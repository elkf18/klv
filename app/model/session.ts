import AsyncStorage from "@react-native-async-storage/async-storage";
import SessionAPI from "app/api/session";
import AppConfig from "app/config/app";
import { isThursday } from "date-fns";
import { Model } from "libs/model/model";
import DeviceInformation from "libs/utils/device-info";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { Alert, ToastAndroid } from "react-native";
import CodePush from "react-native-code-push";
import GlobalStore, { Global } from "./global";
import { confirmRequestMailOTP, confirmRequestOTP } from "./utils";
import DeviceInfo from "react-native-device-info";
import { Outlet } from "./outlet";

const wrongPassword = "Maaf username/password yang anda masukkan tidak sesuai";
const notAccessable = "Maaf akun tidak bisa di gunakan pada applikasi ini.";
export class User extends Model {
  id = null;
  id_client = null;
  fullname = "";
  user_token = "";
  client = null;
  roles = [];

  name = "";
  gender = "";
  date = "";
  phone1 = "";
  email = "";
  password = "";
  phone = "";
  username = "";
  confirmPassword = "";
  oldPassword = "";
  otp = "";
  otpValue = "";
  foto = "";
  reg_date = "";

  id_outlet = 0;
  id_package = 0;
}

export class Role extends Model {
  id = null;
  role_name = "";
  role_desc = "";
  menu_path = "";
}

export class Client extends Model {
  id = null;
  client_name = "";
  name = "";
  address = "";
  telp = "";
}

export class Package extends Model {
  id = 0;
  package_name = "";
  fee = "";
  menu_prefix = "";
}

export class PackageConf extends Model {
  id=null
  m_package=0
  model_class=""
  max_value=null
}

export class Form extends User {
  password = "";
  repassword = "";
  isRegister = false;
  saving = false;
  canSubmit = false;
}

export class FormRegist extends User {
  password = "";
  confpassword = "";
  pic_name = "";
  client_name = "";
  username = "";
  email = "";
  phone = "";

  isAgee = false;

  isRegister = false;
  isForgot = false;
  get isValidOTP() {
    if (this.otp.length === 6) {
      return this.otp == this.otpValue;
    }
    return true;
  }

  containsSpecialCharacters(str: string){
    var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    return regex.test(str);
  }

  isValid() {
    let valid = true;
    if (this.password == "") {
      valid = false;
    }
    if (this.password.length>5) {
      valid = false;
    }
    if (this.confpassword == "") {
      valid = false;
    }
    if (this.password != this.confpassword) {
      valid = false;
    }
    if (this.pic_name == "") {
      valid = false;
    }
    if (this.client_name == "") {
      valid = false;
    }
    if (this.username == "") {
      valid = false;
    }

    if (this.containsSpecialCharacters(this.username)) {
      valid = false;
    }

    if (this.email == "") {
      valid = false;
    }
    if (this.phone == "") {
      valid = false;
    }

    if (this.isAgee == false) {
      valid = false;
    }

    return valid;
  }
  errorMessage() {
    let valid = "Harap mengisi ";
    let message =[];
    if (this.password == "") {
      message.push("Password")
    }
    if (this.confpassword == "") {
      message.push("Konfirmasi Password")
    }
    if (this.password != this.confpassword) {
      message.push("Konfirmasi tidak sama")
    }
    if (this.pic_name == "") {
      message.push("Nama Lengkap")
    }
    if (this.client_name == "") {
      message.push("Nama Perusahaan")
    }
    if (this.username == "") {
      message.push("Username")
    }
    if (this.email == "") {
      message.push("Email")
    }
    if (this.phone == "") {
      message.push("Telepon")
    }

    if (this.isAgee == false) {
      message.push("Syarat dan Ketentuan")
    }

    return valid+(message.join(", "));
  }
}

export class Session extends Model {
  form = Form.childOf(this);
  formRegist = FormRegist.childOf(this);

  formUser = User.childOf(this);
  listRole: Role[] = [];

  isLoggedIn = false;
  jwt = "";
  user = User.childOf(this);
  role = Role.childOf(this);
  client = Client.childOf(this);
  package = Package.childOf(this);
  package_conf :PackageConf[] = []
  roles: Role[] = [];

  outlet = Outlet.childOf(this);

  setting = {
    description: "",
  };
  // roles = new HasManyClass(this, Role);
  expired = null;

  username = "";
  password = "";
  loading = false;
  saveUserPass = false;

  firstOpened = true;

  get AuthContext() {
    return {
      isLoggedIn: this.isLoggedIn,
      role: this.role.role_name,
    };
  }

  init() {
    let old = {
      username: this.username,
      password: this.password,
      saveUserPass: this.saveUserPass,
    };
    let s = new Session()._loadJSON(old);
    this._loadJSON(s._json);
  }

  initForm() {
    this._loadJSON({
      form: new Form()._json,
    });
  }

  initFormRegist(data: any = null) {
    let a = new FormRegist();
    if (!!data) a._loadJSON(data);
    this._loadJSON({
      formRegist: a._json,
      loading: false,
    });
  }

  checkSession() {
    let self = this._json;
    if (!!self.isLoggedIn && !!self.jwt && !!self.user) {
      if (!self.role || !self.role.menu_path) {
        alert(wrongPassword);
      } else {
        let role = self.role.menu_path.split(".");
        if (role.length !== 3 && AppConfig.appRoles.indexOf(role[2]) === -1) {
          alert(wrongPassword);
        } else {
          return;
        }
      }
    }
    this.init();
  }

  
  async login() {
    if(GlobalStore.deviceToken==""){
      CodePush.restartApp();
    }
    this.loading = true;
    let saveUserPass: boolean = this.saveUserPass;
    // if (!saveUserPass) {
    //   saveUserPass = await new Promise((resolve) => {
    //     Alert.alert(
    //       "Perhatian",
    //       "Apakah anda ingin menyimnpan username dan password?",
    //       [
    //         {
    //           text: "Simpan",
    //           onPress: () => {
    //             resolve(true);
    //           },
    //         },
    //         {
    //           text: "Tidak",
    //           onPress: () => {
    //             resolve(false);
    //           },
    //         },
    //       ]
    //     );
    //   });
    //   this._loadJSON({
    //     saveUserPass,
    //   });
    // }
    
    const uname = this.username;
    const device_info = await DeviceInformation();
    //const device_info = await DeviceInfo.getDeviceId();
    const unique_id = await DeviceInfo.getUniqueId();
    let uniqueId = DeviceInfo.getUniqueId();
    
    await SessionAPI.login({
      username: this.username,
      password: this.password,
      device_token: GlobalStore.deviceToken,
      unique_id:uniqueId,
      device_info,
    }).then((res: any) => {
      let data: any = {
        loading: false,
        saveUserPass,
      };
      if (!!res && !!res.jwt) {
        data = {
          ...data,
          ...res,
          isLoggedIn: true,
          role: res.user.roles[0],
          roles: res.user.roles,
          package_conf:res.package_conf,
          outlet:res.outlet
        };
      }
      
      if (!saveUserPass) {
        data = {
          ...data,
          username: "",
          password: "",
        };
      }

      let canLogin = true;

      if (!data.role || !data.role.menu_path) {
        alert(wrongPassword);
        canLogin = false;
      } else {
        let role = data.role.menu_path.split(".");
        if (role.length !== 3 && AppConfig.appRoles.indexOf(role[2]) === -1) {
          alert(wrongPassword);
          canLogin = false;
        }
      }

      if (!!canLogin) {
        this._loadJSON(data);
        this.user.username = uname;
      } else {
        this.init();
      }
    });
  }

  getConfig(model:string):number|null{

    let x : PackageConf[] = this.package_conf.filter((item:PackageConf) => {
      return item.model_class === model
    })

    if(x.length>0){
      return x[0].max_value
    }else{
      return null
    }
  }

  // async loginCore(res:any){
  //   let data: any = {
  //     loading: false,
  //   };
  //   console.log(JSON.stringify(res))
  //   if (!!res && !!res.jwt) {
  //     data = {
  //       ...data,
  //       ...res,
  //       isLoggedIn: true,
  //       role: res.user.roles[0],
  //       roles: res.user.roles,
  //       package_conf:res.user.package_conf
  //     };
  //   }
    
  //   console.log("......")
  //   console.log(this.package_conf)

  //   let canLogin = true;

  //   if (!data.role || !data.role.menu_path) {
  //     alert(wrongPassword);
  //     canLogin = false;
  //   } else {
  //     let role = data.role.menu_path.split(".");
  //     if (role.length !== 3 && AppConfig.appRoles.indexOf(role[2]) === -1) {
  //       alert(wrongPassword);
  //       canLogin = false;
  //     }
  //   }

  //   if (!!canLogin) {
      
  //     this._loadJSON(data);
  //     console.log("......")
  //     console.log(this.package_conf)
  //   } else {
  //     this.init();
  //   }
  // }
  async logout() {
    let res = await new Promise((resolve) => {
      Alert.alert("Logout", "Are you sure?", [
        {
          text: "Cancel",
          onPress: () => resolve(false),
        },
        {
          text: "OK",
          onPress: () => resolve(true),
        },
      ]);
    });
    if (!!res) {
      let old = {};
      if (!!this.saveUserPass) {
        old = {
          username: this.username,
          password: this.password,
          saveUserPass: this.saveUserPass,
        };
      }
      let data = new Session()._loadJSON(old)._json;
      this._loadJSON(data);
      let global = new Global()._json;
      GlobalStore._loadJSON(global);
      AsyncStorage.clear();

      SessionStore.firstOpened = false;
      this.firstOpened = false;
    }
  }
  async requestOTP(forgot: boolean = false) {
    const form = this.form._json;
    let res = await confirmRequestOTP(this.formRegist.phone);
    if (!!res) {
      this._loadJSON({
        loading: true,
      });
      let otp = await SessionAPI.requestOTP({
        phone: this.formRegist.phone,
      });
      this._loadJSON({
        loading: false,
        form: {
          isForgot: forgot,
          otp: "",
          otpValue: otp,
        },
      });
      if (AppConfig.mode !== "production") {
        if (!!otp) {
          alert(`Masukkan kode OTP berikut: ${otp}`);
        }
      }
    }
    return res;
  }

  async requesMailtOTP(forgot: boolean = false) {
    const form = this.form._json;
    let res = await confirmRequestMailOTP(this.formRegist.email);
    if (!!res) {
      this._loadJSON({
        loading: true,
      });
      let otp = await SessionAPI.requestMailOTP({
        email: this.formRegist.email,
      });
      this._loadJSON({
        loading: false,
        form: {
          isForgot: forgot,
          otp: "",
          otpValue: otp,
        },
      });
      if (AppConfig.mode !== "production") {
        // if(!!otp){
        alert(`Masukkan kode OTP berikut: ${otp}`);
        // }
      }
    }
    return res;
  }

  async validationOTP() {
    const res = await SessionAPI.validationOTP({
      phone: this.formRegist.phone,
      token: this.formRegist.otp,
    });

    return res;
  }

  async validationMailOTP() {
    const res = await SessionAPI.validationOTP({
      phone: this.formRegist.email,
      token: this.formRegist.otp,
    });

    return res;
  }

  async loadClientInfo() {
    const res = await SessionAPI.getDetailClient().then((res) => {
      this._loadJSON({
        client: res,
        loading: false,
      });
    });

    return res;
  }
  async changePassword() {
    this.form.saving = true;
    await SessionAPI.changePassword(
      {
        password: this.form.password,
      },
      this.jwt
    ).then((res: any) => {
      let data: any = {
        loading: false,
      };
      if (!!res && !!res.jwt) {
        data = {
          ...data,
          ...res,
          isLoggedIn: true,
          role: res.user.roles[0],
          roles: res.user.roles,
        };
        this._loadJSON(data);
      }
      this.initForm();
    });
  }

  async changePass() {
    this.form.saving = true;
    let result: any;
    await SessionAPI.changePass(
      this.form.oldPassword,
      this.form.repassword
    ).then((res: any) => {
      let data: any = {
        loading: false,
      };
      // if (!!res && !!res.jwt) {
      //   data = {
      //     ...data,
      //     ...res,
      //     isLoggedIn: true,
      //     role: res.user.roles[0],
      //     roles: res.user.roles,
      //   };
      //   this._loadJSON(data);
      // }
      this.initForm();
      result = res;
    });
    return result;
  }

  async isRegistered() {
    this.loading = true;
    const form = this.form;
    let status = await SessionAPI.isRegistered({
      username: this.formRegist.phone,
    });
    this._loadJSON({
      loading: false,
      form: {
        isRegister: !status,
      },
    });
    return status;
  }

  async register() {
    this.loading = true;
    const form = this.form;
    //const device_info = await DeviceInformation();

    let res = await SessionAPI.register(this.formRegist);
    console.log(res);

    this.loading = false;
    let data = new Session()._loadJSON({
      ...this._json,
    });

    this._loadJSON(data._json);

    return res;
  }

  async updateDeviceToken() {
    if (!!this.jwt) {
      const device_info = await DeviceInformation();
      SessionAPI.updateDevice(this.jwt, {
        device_token: GlobalStore.deviceToken,
        device_info,
      });
    }
  }
}
const SessionStore = Session.create({
  localStorage: true,
  storageName: "Session",
});
export default SessionStore;
