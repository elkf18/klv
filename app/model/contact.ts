import { Model } from "libs/model/model";
import fuzzyMatch from "libs/utils/fuzzy-match";
import CustomerAPI from "app/api/customer";
import { Alert, PermissionsAndroid } from "react-native";
import { Filter } from "./filter";
import Contacts from 'react-native-contacts';
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";

export class Contact extends Model {
    recordID = null;
    prefix = "";
    suffix = "";
    familyName = "";
    givenName = "";
    middleName = "";
    jobTitle = "";
    company="";
    displayName="";
    postalAddresses:PostalAddress[] = PostalAddress.hasMany(this);
    phoneNumbers:PhoneNumber[] = PhoneNumber.hasMany(this);
    emailAddresses:EmailAddress[] = EmailAddress.hasMany(this);

    loading = false;
    saving = false;
    cached = false;

    checked = false;

   

    init() {
        this._loadJSON(new Contact()._json);
      }

    //   async load(recordID: number, editable: boolean = false) {
    //     if (
    //       !editable ||
    //       (!this.cached && !!recordID) ||
    //       (!!this.cached && this.recordID !== recordID)
    //     ) {
    //       this.loading = true;
    //       let data = await this.getPhoneNumber();
          
    //       this._loadJSON(data);
    //     } else if (!this.cached || !recordID || (!!this.cached && this.recordID !== recordID)) {
    //       this.init();
    //     }
    //   }

      getPhoneNumber() {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts.',
            'buttonPositive': 'Accept'
          }
        )
        .then(()=>{
            Contacts.getAll().then(contacts => {
                this._loadJSON(contacts)
                this.checked=false
                this.loading= false
                // console.log(toJS(contacts))
                // console.log(JSON.stringify(contacts))

                
              })
              
            })
        
      }
}

export class PhoneNumber extends Model {
    id:any= "";
    label:any= "";
    number:any= "";
}

export class EmailAddress extends Model {
  id:any="";
  label:any= "";
  email:any= "";
}

export class PostalAddress extends Model {
  id:any="";
    label:any= "";
    email:any= "";
    city:any= "";
    country:any= "";
    formattedAddress:any= "";
    postCode:any= "";
    street:any= "";
}

export class ContactRepository extends Model {
    list: Contact[] = [];
    filter: Filter = Filter.childOf(this);

    loading = false;
    isUploading = false;
    uploaded = 0;

  get getList() {
    
    return this.list.filter((item) => {
      let match = true;
      
      if (!!this.filter.search) {
        
        let f6 = fuzzyMatch(
          this.filter.search.toLowerCase(),
          (item.displayName || "").toLowerCase()
        );
        let f7 = item.displayName.toLowerCase().includes(this.filter.search.toLowerCase())
        match = !!f6 || !!f7;
      }
      return this.clean(match);
    });
  }


  get getChecked() {
    return this.list.filter((item) => {
      let match = item.checked;
      
      return this.clean(match);
    });
  }

  clean(obj:any) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
        obj[propName]="";
      }
    }
    return obj
  }

  async load() {
    this.loading = true;
    this.getPhoneNumber()
  }


  getContact(contacts:any){
      contacts=this.clean(contacts)
        this._loadJSON({
            list: contacts,
            loading: false
        });
        this.list=this.clean(this.list)
        this.list=this.list.sort((a, b) => (a.displayName > b.displayName ? 1 : -1))
        
        this.loading= false
  }

  async getPhoneNumber() {
    this.loading = true;
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Accept'
      }
    )
    .then((e:any)=>{
      console.log("vvv")
      if(e!=="granted"){
        console.log(e)
        this.loading = false;
        return false;
      }
      try{
        Contacts.getAll().then(contacts => {
          contacts=this.clean(contacts)
            this._loadJSON({
                list: contacts,
                loading: false
            });
            this.list=this.clean(this.list)
            this.list=this.list.sort((a, b) => (a.displayName > b.displayName ? 1 : -1))
            
            this.loading= false
            
            
          })
      }catch(e:any){
        return false; 
      }
      return true;
        
          
        })
    
  }
}
const ContactStore = ContactRepository.create({
    localStorage: true,
    storageName: "ContactRepository",
  });
  export default ContactStore;