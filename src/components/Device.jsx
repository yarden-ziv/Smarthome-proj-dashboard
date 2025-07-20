import DeviceOptions from "./DeviceOptions";
import TextInput from "./TextInput";

// Displays the information of a single device, and allows editing it.
export default function Device({
  id,
  type, // e.g. water heater, light, etc.
  name,
  room,
  status,
  parameters,
  updateDevice, // Function for updating device configuration
  removeDevice, // Function for removing the device
  deviceAction, // Function for applying an action on the device
  disabled, // Whether or not input fields should be disabled
}) {
  // What components to display for the device status,
  // based on the device type.
  let statusInput = null;

  function handleStatusChange(nextStatus) {
    updateDevice({
      id: id,
      changes: {
        status: nextStatus,
      },
    });
  }

  function handleRemoveDevice() {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      removeDevice(id);
    }
  }

  // What components to display for the device status,
  // based on the device type.
  switch (type) {
    case "curtain":
      statusInput = (
        <label>
          <input
            type="checkbox"
            checked={status === "open"}
            onChange={() => {
              handleStatusChange(status === "open" ? "closed" : "open");
            }}
            disabled={disabled}
          />
          Open
        </label>
      );
      break;
    case "door_lock":
      statusInput = (
        <label>
          <input
            type="checkbox"
            checked={status === "locked"}
            onChange={() => {
              handleStatusChange(status === "unlocked" ? "locked" : "unlocked");
            }}
            disabled={disabled}
          />
          Locked
        </label>
      );
      break;
    default:
      statusInput = (
        <label>
          <input
            type="checkbox"
            checked={status === "on"}
            onChange={() => {
              handleStatusChange(status === "on" ? "off" : "on");
            }}
            disabled={disabled}
          />
          On/Off
        </label>
      );
      break;
  }
  return (
    <div id={id}>
      <TextInput
        initValue={name}
        onSave={(newName) => {
          updateDevice({
            id: id,
            changes: {
              name: newName,
            },
          });
        }}
        disabled={disabled}
      />{" "}
      {statusInput}
      {" - "}
      <label>
        Room:{" "}
        <TextInput
          initValue={room}
          onSave={(newRoom) => {
            updateDevice({
              id: id,
              changes: {
                room: newRoom,
              },
            });
          }}
        />
      </label>{" "}
      <button disabled={disabled} onClick={handleRemoveDevice}>
        Remove
      </button>
      <DeviceOptions
        type={type}
        parameters={{ ...parameters }}
        onSave={(newParameters) => {
          deviceAction({
            id: id,
            changes: { ...newParameters },
          });
        }}
        disabled={disabled}
      />
    </div>
  );
}
