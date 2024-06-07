import { IRoute, TStackProps } from "libs/routes";

// Public Navigation
export const PublicInitialStack: TStackProps = {
  initialRouteName: "InitPage",
};

export const PublicRoutes: IRoute[] = [

  {
    name: "InitPage",
    component: require("app/pages/InitPage").default,
    roles: [],
  },
  {
    name: "Onboarding",
    component: require("app/pages/Onboarding").default,
    roles: [],
  },
  {
    name: "PostRegist",
    component: require("app/ui/register/PostRegist").default,
    roles: [],
  },
  {
    name: "Login",
    component: require("app/pages/Login").default,
    roles: [],
  },
  {
    name: "MediaWebView",
    component: require("app/pages/MediaWebView").default,
    roles: [],
  },
  {
    name: "Register",
    component: require("app/ui/register/inputnumber").default,
    roles: [],
  },
  {
    name: "RegisterEmail",
    component: require("app/ui/register/inputemail").default,
    roles: [],
  },
  // {
  //   name: "OTP",
  //   component: require("app/ui/register/otp").default,
  //   roles: [],
  // },
  {
    name: "guest/OTP",
    component: require("app/ui/otp/index").default,
    roles: [],
  },
  {
    name: "guest/Register",
    component: require("app/ui/register/Form").default,
    roles: [],
  },
  // {
  //   name: "Register",
  //   component: require("app/pages/Register").default,
  //   roles: [],
  // },
];

// Private Navigation
export const PrivateInitialStack: TStackProps = {
  initialRouteName: "Home",
};

export const PrivateRoutes: IRoute[] = [
  {
    name: "Home",
    component: require("app/pages/Home").default,
    roles: [],
  },
  {
    name: "Setting",
    component: require("app/pages/Setting").default,
    roles: [],
  },
  {
    name: "Inbox",
    component: require("app/pages/Inbox").default,
    roles: [],
  },
  {
    name: "printer",
    component: require("app/pages/Printer").default,
    roles: [],
  },
  {
    name: "changePassword",
    component: require("app/ui/setting/ChangePassword").default,
    roles: [],
  },
  {
    name: "user/customer/Detail",
    component: require("app/ui/customer/Detail").default,
    roles: [],
  },
  {
    name: "user/customer/Form",
    component: require("app/ui/customer/Form").default,
    roles: [],
  },
  {
    name: "user/users/Detail",
    component: require("app/ui/users/Detail.tsx").default,
    roles: [],
  },
  {
    name: "user/users/Form",
    component: require("app/ui/users/Form.tsx").default,
    roles: [],
  },
  {
    name: "user/customer/contact",
    component: require("app/ui/customer/ContactPage").default,
    roles: [],
  },
  {
    name: "user/activity/Detail",
    component: require("app/ui/activity/Detail").default,
    roles: [],
  },
  {
    name: "user/activity/Form",
    component: require("app/ui/activity/Form").default,
    roles: [],
  },
  {
    name: "user/product/Detail",
    component: require("app/ui/product/Detail").default,
    roles: [],
  },
  {
    name: "user/product/Form",
    component: require("app/ui/product/Form").default,
    roles: [],
  },
  {
    name: "user/so/Detail",
    component: require("app/ui/so/Detail").default,
    roles: [],
  },
  {
    name: "user/so/DetailDelivery",
    component: require("app/ui/so/DetailDelivery").default,
    roles: [],
  },
  {
    name: "user/so/FormDelivery",
    component: require("app/ui/so/FormDelivery").default,
    roles: [],
  },
  {
    name: "user/so/Form",
    component: require("app/ui/so/Form").default,
    roles: [],
  },
  {
    name: "user/opportunity/Detail",
    component: require("app/ui/opportunity/Detail").default,
    roles: [],
  },
  {
    name: "user/opportunity/Form",
    component: require("app/ui/opportunity/Form").default,
    roles: [],
  },
  {
    name: "user/outlet/Detail",
    component: require("app/ui/outlet/Detail").default,
    roles: [],
  },
  {
    name: "user/outlet/Form",
    component: require("app/ui/outlet/Form").default,
    roles: [],
  },
  {
    name: "MediaWebView",
    component: require("app/pages/MediaWebView").default,
    roles: [],
  }
];
