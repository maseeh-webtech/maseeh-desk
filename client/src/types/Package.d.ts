import User from "~types/User";
import Resident from "~types/Resident";

interface Package {
  _id: string;
  resident: Resident;
  checkedInBy?: User;
  location: string;
  trackingNumber: string;
}

export default Package;
