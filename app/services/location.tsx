import * as Location from "expo-location";
import { Platform, ToastAndroid } from "react-native";
import { Constants, Permissions } from "react-native-unimodules";

export interface ILocation {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

const getLastKnownLocation = async () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      alert(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
      return null
    }
    await Permissions.askAsync(Permissions.LOCATION).then((res) => {
      
      if (res.status == "granted") {
        
        return lastKnownLocation()
      } else {
        alert("Permission to access location was denied");
        return (null);
      }
    });
  
};

const lastKnownLocation = async () => {  
  
  let location = await Location.getLastKnownPositionAsync()
  
  if(location!!){
    return (location.coords);
  }else{
    return null
  }
};


const getCurrentLocation = async () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      alert(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
      return null
    }

    await Permissions.askAsync(Permissions.LOCATION).then((res) => {
      
      if (res.status == "granted") {
        
        return currentLocation()
      } else {
        alert("Permission to access location was denied");
        return (null);
      }
    });
  
};



const askPermission = async () => {
  if (Platform.OS === "android" && !Constants.isDevice) {
    alert(
      "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
    );
    return false
  }
  await Permissions.askAsync(Permissions.LOCATION).then((res) => {
    
    if (res.status == "granted") {
      return true
    } else {
      alert("Permission to access location was denied");
      return false
    }
  });

};


const currentLocation = async () => {
  // console.log("det1")
  let location:Location.LocationObject = await Location.getCurrentPositionAsync({accuracy:4})
  // console.log("det2")
  // console.log(JSON.stringify(location.coords))
  return location.coords;

};

const locationService = {
  getLastKnownLocation,
  getCurrentLocation,
  currentLocation,
  lastKnownLocation,
  askPermission
};

export default locationService;

