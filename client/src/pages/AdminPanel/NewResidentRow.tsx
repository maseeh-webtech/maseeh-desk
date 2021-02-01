import * as React from "react";
import { Table, Button } from "semantic-ui-react";
import { post } from "~utilities";
import ControlledTextInput from "~modules/ControlledTextField";
import Resident from "~types/Resident";

const { useState } = React;

type NewResidentRowProps = {
  fetchResidents: () => void;
  residents: Resident[];
};
export const NewResidentRow = ({ fetchResidents, residents }: NewResidentRowProps) => {
  // State for new input fields
  const [newResidentName, setNewResidentName] = useState("");
  const [newResidentKerberos, setNewResidentKerberos] = useState("");
  const [newResidentEmail, setNewResidentEmail] = useState("");
  const [newResidentRoom, setNewResidentRoom] = useState("");

  const handleNewResident = () => {
    for (const resident of residents) {
      if (
        newResidentName === resident.name ||
        newResidentKerberos === resident.kerberos ||
        newResidentEmail === resident.email
      ) {
        const confirm = window.confirm(
          `There is already a resident "${resident.name}" (${
            resident.kerberos || resident.email
          }). Are you sure you want to add "${newResidentName}" (${
            newResidentKerberos || newResidentEmail
          })?`
        );
        if (!confirm) return;
      }
    }

    post("/api/resident/new", {
      name: newResidentName,
      kerberos: newResidentKerberos,
      email: newResidentEmail,
      room: newResidentRoom,
    })
      .then(() => {
        fetchResidents();
        setNewResidentName("");
        setNewResidentKerberos("");
        setNewResidentEmail("");
        setNewResidentRoom("");
      })
      .catch((err: Error) => {
        console.log(err);
        alert(
          "Something went wrong!\nPlease try again, reload the page, or contact maseeh-webtech@mit.edu."
        );
      });
  };

  return (
    <Table.Row>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Name"
          value={newResidentName}
          setValue={setNewResidentName}
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Kerberos"
          value={newResidentKerberos}
          setValue={setNewResidentKerberos}
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Email (leave blank for <kerberos>@mit.edu)"
          value={newResidentEmail}
          setValue={setNewResidentEmail}
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Room #"
          value={newResidentRoom}
          setValue={setNewResidentRoom}
        />
      </Table.HeaderCell>
      <Table.HeaderCell colSpan="2" textAlign="center">
        <Button
          primary
          onClick={handleNewResident}
          disabled={!(newResidentName && newResidentKerberos && newResidentRoom)}
        >
          Add
        </Button>
      </Table.HeaderCell>
    </Table.Row>
  );
};
