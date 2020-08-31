import * as React from "react";
import { Dropdown } from "semantic-ui-react";

import { ResidentListItem } from "~types/Resident";

type Props = {
  residents: ResidentListItem[];
  kerberos: string;
  setKerb: (newKerb: string) => void;
};

const ResidentSelector = ({ residents, kerberos, setKerb }: Props) => {
  return (
    <Dropdown
      className="checkin-resident"
      placeholder="Resident"
      search
      selection
      fluid
      onChange={(_e, { value }) => setKerb(value as string)}
      options={residents}
      value={kerberos}
    />
  );
};

export default React.memo(ResidentSelector);
