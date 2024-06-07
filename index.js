import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import PushNotification from "react-native-push-notification";
import { AppState, ToastAndroid } from "react-native";

import App from './App';

import messaging from '@react-native-firebase/messaging';
import NotificationStore from "app/model/notification";
import { useNavigation } from '@react-navigation/native';



function onMessageReceived(message) {
  console.log("onMessageReceived: "+JSON.stringify(message))
  console.log("onMessageReceived: "+JSON.stringify(AppState.currentState))
  if(AppState.currentState!=="active"){
   // ToastAndroid.show(message.notification.title+": "+ message.notification.body, ToastAndroid.LONG)
  }else{
    ToastAndroid.show(message.notification.title+": "+ message.notification.body, ToastAndroid.LONG)
  }
  NotificationStore.receiveNotif(message);
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log("AAAAAA")
  // switch (remoteMessage.notification.type) {
  //   case "BIRTHDAY":
  //     CustomerStore.detail.load(item.ref_data);
  //     nav.navigate("user/customer/Detail", {
  //         id: item.ref_data
  //       });
  //     break;
  //     case "NEXT ORDER":
  //      SalesStore.detail.load(item.ref_data);
  //       nav.navigate("user/so/Form", {
  //         id_product: item.ref_data,
  //         id_customer: item.ref_data_ii
  //       });
  //       break;

  //   default:
  //     // NotificationStore.detail.init(item._json);
  //     // nav.navigate("DetailInbox");
  //     break;
  // }
});

// messaging().getInitialNotification().then( ​initialMessage => {
//   console.log("Initial Message: ", initialMessage); 
// })


// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      
  
      // process the notification
  
      // (required) Called when a remote is received or opened, or local notification is opened
      //notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      
      console.log("ACTION:", token);
      // process the action
    },
  
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      
      //console.error(err.message, err);
    },

    onRemoteFetch: function(notificationData) {
      
      //console.error(err.message, err);
    },
  
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
  
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  // PushNotification.createChannel(
  //   {
  //     channelId: "reminder", // (required)
  //     channelName: "Activity Reminder", // (required)
  //     channelDescription: "Reminder for Activity", // (optional) default: undefined.
  //     playSound: false, // (optional) default: true
  //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //   },
  //   () => console.log(`createChannel returned`) // (optional) callback returns whether the channel was created, false means it already existed.
  // );

  // PushNotification.createChannel(
  //   {
  //     channelId: "channel-idX", // (required)
  //   channelName: "My channelX", // (required)
  //     channelDescription: "Reminder for Activity", // (optional) default: undefined.
  //     playSound: false, // (optional) default: true
  //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //   },
  //   () => console.log(`createChannel returned`) // (optional) callback returns whether the channel was created, false means it already existed.
  // );


  PushNotification.createChannel(
    {
      channelId: "FULLSCREEN", // (required)
    channelName: "FULLSCREEN", // (required)
      channelDescription: "Reminder", // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: "trial_notification.wav", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    () => console.log(`FULLSCREEN created`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.createChannel(
    {
      channelId: "Reminder_Notif", // (required)
    channelName: "Reminder_Notif", // (required)
      channelDescription: "Reminder Notification", // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: "trial_notification.wav", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    () => console.log(`FULLSCREEN created`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

registerRootComponent(App);
