import { Button, Icon, Text } from "libs/ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import ContactStore, { Contact } from "app/model/contact";
import { observer } from "mobx-react";
import React from "react";
import { Linking, Platform } from "react-native";
import { ITheme } from "libs/config/theme";
import CustomerStore from "app/model/customer";
import Fonts from "libs/assets/fonts";
export default observer((props: { item: Contact;index: number;}) => {
  const Theme: ITheme = useTheme() as any;
  const { item,index} = props;
  const nav = useNavigation();

  

  return (
    <Button
      style={{
        backgroundColor: ContactStore.list.find(x => x.recordID ==item.recordID)!!.checked ? "#E5F7FF":"#fff",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        margin: ((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?5:0,
        display:((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?"flex":undefined,
        flexGrow: ((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?1:undefined,
        flexShrink: ((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?1:undefined,
        borderRadius: ((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?10:0,
        overflow: "hidden",
        padding: ((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?10:0,
        borderWidth: ContactStore.list.find(x => x.recordID ==item.recordID)!!.checked ? 1:1,
        borderColor: ContactStore.list.find(x => x.recordID ==item.recordID)!!.checked ? "#00B3FF": "#E6E6E6",
        height:((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?undefined:0,
        width:((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?undefined:0,
        position:((!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number))?undefined:"absolute",
        
        
      }}
      
      onPress={() => {  
        // CustomerStore.detail.name=item.displayName;
        // CustomerStore.detail.contact_person_name=item.displayName;

        // if(!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number){
        //     CustomerStore.detail.phone1=item.phoneNumbers[0].number
        //     CustomerStore.detail.contact_person_phone=item.phoneNumbers[0].number
        // }
        // if(!!item.phoneNumbers[1]  && !!item.phoneNumbers[1].number){
        //     CustomerStore.detail.phone2=item.phoneNumbers[1].number
        // }
        // if(!!item.emailAddresses[0]  && !!item.emailAddresses[0].email){
        //     CustomerStore.detail.email=item.emailAddresses[0].email
        // }
        
        // if(!!item.postalAddresses[0]  && !!item.postalAddresses[0].formattedAddress){
        //     CustomerStore.detail.address=item.postalAddresses[0].formattedAddress
            
        //     if(!!item.postalAddresses[0].city){
        //         CustomerStore.detail.new_city=item.postalAddresses[0].city
        //     }
        //     if(!!item.postalAddresses[0].country){
        //         CustomerStore.detail.new_country=item.postalAddresses[0].country
        //     }

        // }

        
        //   nav.navigate("user/customer/Form", {
            
        //   });
        //ContactStore.list[index].checked = (!ContactStore.list[index].checked)

        ContactStore.list.find(x => x.recordID ==item.recordID)!!.checked=(!ContactStore.list.find(x => x.recordID ==item.recordID)!!.checked);
        //.find(x => x.id === '45').foo
        }
    }
    >
      <Text
        style={{
          fontSize: 14,
          color: "#333333",
          marginRight: 40,
          fontFamily:Fonts.poppinsmedium,
        }}
      >
        {item.displayName}
      </Text>

      <Text
            style={{
              color: "#8c8c8c",
              marginTop: 5,
            }}
          >
      {((!!item.emailAddresses[0]  && !!item.emailAddresses[0].email) ||(!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number)) && (
        <>
          
            {!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number && (
                <>
            <Text
              style={{
                color: "#333333",
                flex: 1,
                fontSize:14,
                fontFamily:Fonts.poppins
              }}
              
            >
              {item.phoneNumbers[0].number}
            </Text>
            </>
            )}
            {!!item.phoneNumbers[1]  && !!item.phoneNumbers[1].number &&!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number ?
            "  |  ":""}
            {/* {!!item.emailAddresses[0]  && !!item.emailAddresses[0].email &&!!item.phoneNumbers[0]  && !!item.phoneNumbers[0].number ?
            "  |  ":""} */}
            
            {!!item.phoneNumbers[1]  && !!item.phoneNumbers[1].number && (
                <>
            <Text
              style={{
                color: "#333333",
                flex: 1,
                fontSize:14,
                fontFamily:Fonts.poppins
              }}
              
            >
              {item.phoneNumbers[1].number}
            </Text>
            </>
            )}
              
            
          
        </>
      )}
      </Text>
      <Icon
        name="check-circle"
        source="FontAwesome"
        size={45}
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          color: ContactStore.list.find(x => x.recordID ==item.recordID)!!.checked ?  '#00B3FF' : '#ddd',
        }}
      />
    </Button>
  );
});
