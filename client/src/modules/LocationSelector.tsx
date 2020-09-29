import * as React from "react";
import { Dropdown } from "semantic-ui-react";

const locations = [
  { key: 0, value: "At desk", text: "At desk" },
  { key: 0, value: "Floor", text: "Floor" },
  { key: 0, value: "Perishable", text: "Perishable" },
  { key: 0, value: "G", text: "G" },
  { key: 0, value: "1", text: "1" },
  { key: 0, value: "2", text: "2" },
  { key: 0, value: "3", text: "3" },
  { key: 0, value: "4", text: "4" },
  { key: 0, value: "5", text: "5" },
  { key: 0, value: "6", text: "6" },
  { key: 0, value: "BG", text: "BG" },
  { key: 0, value: "B1", text: "B1" },
  { key: 0, value: "B2", text: "B2" },
  { key: 0, value: "B3", text: "B3" },
  { key: 0, value: "B4", text: "B4" },
  { key: 0, value: "B5", text: "B5" },
  { key: 0, value: "B6", text: "B6" },
  { key: 0, value: "Library book", text: "Library book" },
];

for (let i = 0; i < locations.length; i++) {
  locations[i].key = i;
}

type Props = {
  location: string;
  setLocation: (newLocation: string) => void;
};

const LocationSelector = ({ location, setLocation }: Props) => {
  return (
    <Dropdown
      className="checkin-location"
      placeholder="Location"
      selection
      onChange={(_e, { value }) => setLocation(value as string)}
      options={locations}
      value={location}
    />
  );
};

export default React.memo(LocationSelector);
