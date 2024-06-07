import { observer, useLocalObservable } from 'mobx-react';
import { Modal, TextInput, View, Text,StyleSheet, TouchableOpacity, Pressable, Linking, Platform, Alert } from 'react-native';
import React from 'react';
import { Icon } from 'libs/ui';
import { action } from 'mobx';
import Fonts from 'libs/assets/fonts';
import ActivityStore from 'app/model/activity';
import { dateFormat } from "libs/utils/date";


interface props{
    custId: null,
    custName: string
    status: boolean,
    phoneNumber?: string,
    typeActivity?: string,
    email?: string,
    latitude: number,
    longitude: number,
    handleClose: () => void
}

const DialogComponent = observer((props: props) => {
    const meta = useLocalObservable(() => ({
        titleInput: 'Contact Customer',
        noteInput: '',
        statusAlert: false,
        storeStatus: false,
        lat: 0,
        long: 0,
        buttonStatus: false,
    }))

    const handleTitleInput = action((title: string) => {
        meta.titleInput = title;
    })
    const handleNoteInput = action((text: string) => {
        meta.noteInput = text;
    })

    const updateStatusAlert = action((status: boolean) => {
        meta.statusAlert = status;
    })

    const updateStoreStatus = action((status: boolean) => {
        meta.storeStatus = status;
    })

    const handelClicked = () => {
        changeButtonStatusDisabled(true);

        if(meta.titleInput.length == 0) {
            updateStatusAlert(true);
            changeButtonStatusDisabled(false);
        } else if(meta.titleInput.length != 0) {
            handleCondition();
        }
    }

    const closeDialog = () => {
        updateStatusAlert(false);
        updateStoreStatus(false);
        changeButtonStatusDisabled(false);
        clearInputValue();
        props.handleClose();
    }

    const clearInputValue = () => {
        handleNoteInput('');
    }

    const handleCondition = () => {
        storeActivity();
        
        setTimeout(() => {
            if(meta.storeStatus) {
                openApp();
                closeDialog();
            } else {
                changeButtonStatusDisabled(false);
            }
        }, 2000)
    }

    const storeActivity = () => {
        setStoreData();

        ActivityStore.detail.save().then((res: boolean) => {
            updateStoreStatus(!!res);
        })
    }

    const changeButtonStatusDisabled = action((status: boolean) => {
        meta.buttonStatus = status;
    })

    const setStoreData = () => {
        ActivityStore.detail.initForm();
        ActivityStore.detail.title = meta.titleInput;
        ActivityStore.detail.remarks = meta.noteInput;
        ActivityStore.detail.status = "Selesai";
        ActivityStore.detail.type = "Tlp";
        ActivityStore.detail.date_visit = dateFormat(new Date(), "yyyy-MM-dd HH:mm");
        ActivityStore.detail.latitude = props.latitude;
        ActivityStore.detail.longitude = props.longitude;
        ActivityStore.detail.id_customer = props.custId;
    }

    const openApp = () => {
        if(props.typeActivity == 'email') {
            sentEmail();
        } else if(props.typeActivity == 'call') {
            makeCall();
        } else if(props.typeActivity == 'message') {
            sentMessage();
        } else if(props.typeActivity == 'whatsapp') {
            sentWhatssApp();
        }
    }

    const sentEmail = () => {
        let url = "mailto:" + props.email + "?subject=" + meta.titleInput + "&body=" + meta.noteInput;

        if (Platform.OS === "ios") {
           url = "mailto:" + props.email + "?subject=" + meta.titleInput + "&body=" + meta.noteInput;
        }

        openLinkURL('Email', url);
    }

    const makeCall = () => {
        let url = "tel:" + props.phoneNumber;

        if (Platform.OS === "ios") {
          url = "tel://" + props.phoneNumber;
        }

        openLinkURL('phone', url);
    }

    const sentMessage = () => {
        let url = "sms:" + props.phoneNumber + "?body=" + meta.noteInput;

        if (Platform.OS === "ios") {
          url = "sms:" + props.phoneNumber + "&body=" + meta.noteInput;
        }

        openLinkURL('message', url);
    }

    const sentWhatssApp = () => {
        let url = "https://wa.me/" + props.phoneNumber + "?text=" + meta.noteInput;

        if (Platform.OS === "ios") {
          url = "https://wa.me/" + props.phoneNumber + "?text=" + meta.noteInput;
        }

        openLinkURL('Whatsapp', url);
    }

    const openLinkURL = (type:string, url: string) => {
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
              try{
                Linking.openURL(url);
              }catch(e:any){  
                alert(`Oops can't open ${type}.`);
              }
            }
          });
    }

    return(
            <Modal transparent={true}
                visible={props.status}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.headerWrapper}>
                                <Text style={styles.textAktivitasStyle}>Aktivitas</Text>
                                <Pressable
                                onPress = {() => {
                                  closeDialog();
                                }}
                                >
                                <Icon 
                                    style={styles.exitIconStyle}
                                    name='close'
                                    size={18}
                                    color={'#333333'}
                                />
                                </Pressable>
                        </View>
                        <View style={styles.contenWrapper}>
                            <View>
                                <Text style={styles.labelStyle}>
                                    Nama Aktivitas *
                                </Text>
                                <TextInput 
                                    style={styles.TextInputStyle}
                                    placeholder={'judul aktivitas'}
                                    value={meta.titleInput}
                                    onChangeText={(text) => handleTitleInput(text)}
                                />
                                {meta.statusAlert && 
                                <Text
                                    style={{
                                        color: 'red',
                                        fontFamily: 'Poppins-Medium'
                                    }}
                                >
                                    Judul Tidak Boleh Kosong
                                </Text>}
                            </View>
                            <View style={styles.marginBetweenContent}>
                                <Text style={styles.labelStyle}>Catatan</Text>
                                <TextInput
                                    style={[styles.TextInputStyle, styles.alignTextInputCatatan]}
                                    numberOfLines={3}
                                    multiline={true}
                                    placeholder={'Catatan Aktivitas'}
                                    onChangeText={(text) => handleNoteInput(text)}
                                />
                            </View>
                            <TouchableOpacity
                            disabled={meta.buttonStatus}
                            style={[styles.buttonStyle, styles.marginBetweenContent, meta.buttonStatus ? styles.buttonDisabledColor : styles.buttonEnabledColor]}
                            onPress={() => {
                                handelClicked();
                            }
                            }
                            >
                                <Text style={styles.textButtonStyle}>
                                    Tambahkan Aktivitas
                                </Text>
                            </TouchableOpacity>
                        </View>   
                    </View>
                </View>
            </Modal>
    )
    
})

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 22,
        backgroundColor: '#FFFFFF',
        width: '85%',
        borderRadius: 8,
    },
    headerWrapper: {
        height: 48,
        shadowColor: '#000000',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        elevation: 2,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        marginTop: -3,
        marginLeft: -2,
        marginRight: -2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textAktivitasStyle: {
      fontFamily: Fonts.poppinsmedium,
        fontSize: 16,
        color: '#333333',
        marginLeft: 10,
        marginTop: 6
    },
    exitIconStyle: {
        marginTop: 1,
        marginRight: 10
    },
    contenWrapper:{
        marginVertical: 10,
        marginHorizontal: 15
    },
    labelStyle: {
      fontFamily: Fonts.poppinsmedium,
        fontSize: 14,
        color: '#333333'
    },
    TextInputStyle: {
        borderRadius: 5,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        fontFamily: Fonts.poppins,
        fontSize: 14,
        paddingHorizontal: 10
    },
    alignTextInputCatatan: {
        textAlignVertical: 'top'
    },
    buttonStyle: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44
    },
    buttonDisabledColor: {
        backgroundColor: 'rgba(0, 179, 255, 0.5)',
    },
    buttonEnabledColor: {
        backgroundColor: 'rgb(0, 179, 255)',
    },
    textButtonStyle: {
        fontFamily: Fonts.poppinsbold,
        color: '#FFFFFF',
        fontSize: 16,
        paddingTop: 5
    },
    marginBetweenContent: {
        marginTop: 9
    },
    textAlert: {
        color: 'red',
        fontFamily: Fonts.poppinsmedium,
        fontSize: 15
    }

})

export default DialogComponent;