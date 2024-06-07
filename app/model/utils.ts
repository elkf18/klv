import { Alert, Linking, Platform } from "react-native";
import * as mime from "mime-types";

export const confirmData = async () =>
  await new Promise((resolve) => {
    Alert.alert(
      "Data belum tersimpan.",
      "Apakah anda ingin kembali ke halaman sebelumnya? data yang belum disimpan saat ini akan hilang",
      [
        {
          text: "Kembali",
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: "Batal",
          onPress: () => {
            resolve(null);
          },
        },
        // {
        //   text: "Simpan",
        //   onPress: () => {
        //     resolve(true);
        //   },
        // },
      ]
    );
  });


export const limitDialog = async () =>
  await new Promise((resolve) => {
    Alert.alert(
      "Fitur Terbatas",
      "Upgrade package akun anda dengan menghubungi kami",
      [
        {
          text: "Kembali",
          onPress: () => {
            resolve(null);
          },
        },
        {
          text: "Hubungi",
          onPress: () => {
            Linking.openURL("https://api.whatsapp.com/send/?phone=6281553889920&text&type=phone_number&app_absent=0")
            // Linking.canOpenURL("https://api.whatsapp.com/send/?phone=6281330602613&text&type=phone_number&app_absent=0")
            //   .then(supported => {
            //     if (!supported) {
            //       Alert.alert(
            //         'Please install whats app to send direct message via whatsapp'
            //       );
            //     } else {
            //       return Linking.openURL("https://api.whatsapp.com/send/?phone=6281330602613&text&type=phone_number&app_absent=0");
            //     }
            //   })
            //   .catch(err => console.error('An error occurred', err));
            resolve(null);
          },
        },
        // {
        //   text: "Simpan",
        //   onPress: () => {
        //     resolve(true);
        //   },
        // },
      ]
    );
  });
export const confirmRequestOTP = async (phone: string) =>
  await new Promise((resolve) => {
    Alert.alert(
      "Pastikan nomor kamu aktif.",
      `Kami akan mengirim kode OTP ke nomor ${phone}.`,
      [
        {
          text: "KEMBALI",
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: "OK",
          onPress: () => {
            resolve(true);
          },
        },
      ]
    );
  });

export const confirmRequestMailOTP = async (email: string) =>
  await new Promise((resolve) => {
    Alert.alert(
      "Pastikan email kamu aktif.",
      `Kami akan mengirim kode OTP ke ${email}.`,
      [
        {
          text: "KEMBALI",
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: "OK",
          onPress: () => {
            resolve(true);
          },
        },
      ]
    );
  });
export const confirmLoadData = async () =>
  await new Promise((resolve) => {
    Alert.alert(
      "Data sebelumnya terdeteksi.",
      "Apakah anda ingin memuat data sebelumnya yang belum disimpan?",
      [
        {
          text: "Tidak",
          onPress: () => {
            resolve(false);
          },
        },
        {
          text: "Iya",
          onPress: () => {
            resolve(true);
          },
        },
      ]
    );
  });

export const generateFileObj = async (path: string) => {
  if (!path || path.indexOf("file://") === -1) {
    return null;
  }
  const uri = path;
  const uripath = uri.split("/");
  const fileName = uripath[uripath.length - 1];
  const file: any = {
    name: fileName,
    type: mime.lookup(fileName),
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
  };

  return file;
};
