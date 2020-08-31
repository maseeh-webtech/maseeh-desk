import * as React from "react";
import { Button, Input, Form } from "semantic-ui-react";

import { post } from "~utilities";
import ResidentSelector from "~modules/ResidentSelector";
import LocationSelector from "~modules/LocationSelector";

import Package from "~types/Package";
import { ResidentListItem } from "~types/Resident";

const { useState } = React;

type Props = {
  addPackage: (pack: Package) => void;
  closeCheckIn: () => void;
  residents: ResidentListItem[];
};

const Checkin = ({ addPackage, closeCheckIn, residents }: Props) => {
  const [kerberos, setKerberos] = useState("");
  const [location, setLocation] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [disableCheckin, setDisableCheckin] = useState(false);

  const reset = () => {
    setKerberos("");
    setLocation("");
    setTrackingNumber("");
    setDisableCheckin(false);
  };

  const handleSubmit = () => {
    setDisableCheckin(true);
    post("/api/checkin", {
      kerberos: kerberos,
      location: location,
      trackingNumber: trackingNumber,
      // TODO: typecheck this at runtime somehow?
    }).then((res: Package) => {
      addPackage(res);
      reset();
    });
  };

  return (
    <div className="checkin-container">
      <h1>
        Check in packages
        <div className="checkin-close">
          <Button onClick={closeCheckIn}>Close</Button>
        </div>
      </h1>
      <Form>
        <div className="checkin-form checkin-resident">
          <ResidentSelector residents={residents} kerberos={kerberos} setKerb={setKerberos} />
        </div>
        <div className="checkin-form">
          <LocationSelector location={location} setLocation={setLocation} />
        </div>
        <div className="checkin-form">
          <Input
            className="checkin-tracking"
            placeholder="Tracking number"
            onChange={(event) => setTrackingNumber(event.target.value)}
            value={trackingNumber}
          />
        </div>
        <div className="checkin-form">
          <Button
            className="checkin-form checkin-submit"
            positive
            content="Check in"
            icon="checkmark"
            labelPosition="right"
            disabled={!kerberos || !location || !trackingNumber || disableCheckin}
            onClick={handleSubmit}
          />
        </div>
      </Form>
    </div>
  );
};

export default Checkin;
