interface Resident {
  _id: string;
  name: string;
  kerberos: string; // Note that for non-students, kerberos may not be a real kerberos. Use email
  email: ?string;
  room: number;
  current: boolean;
  numPackages: ?number;
}

export interface ResidentListItem {
  key: number;
  value: string;
  text: string;
}

export default Resident;
