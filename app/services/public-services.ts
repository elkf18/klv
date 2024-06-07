import CustomerStore from "app/model/customer";
import UsersStore from "app/model/users";

const PublicService = () => {
    CustomerStore.load()
    UsersStore.loadAssign()
};

export default PublicService;
