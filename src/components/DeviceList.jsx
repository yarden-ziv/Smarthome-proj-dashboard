import { useState, useEffect, useCallback, useRef } from "react";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";
import NewDeviceForm from "./NewDeviceForm";
import DeviceGroup from "./DeviceGroup";
import { useDeviceIds, useDevices } from "../services/queries";
import { useCreateDevice } from "../services/mutations";

// The main component of the app.
// Displays a status message at the top, below it a list of all device
// information, which allows editing device information and automatically
// updating the server. Below that are buttons to manually reload device
// information or display a form for adding a new device.
// Device information is automatically reacquired after one minute
// without any user actions.
export default function DeviceList() {
  // Query to fetch all device IDs from the server
  const deviceIdsQuery = useDeviceIds();
  // Query to fetch all device data based on their IDs
  const devicesQuery = useDevices(deviceIdsQuery.data);

  // Whether or not to display the new device form
  const [showForm, setShowForm] = useState(false);
  // Used for resetting the new device form after a new device is added
  const [formKey, setFormKey] = useState(Date.now().toString());
  // Group devices either by room or by type
  const [groupBy, setGroupBy] = useState("type");

  // ID for the timeout used to refresh the data
  const timeoutId = useRef(null);

  // The number of queries currently pending
  const isFetching = useIsFetching();
  // The number of mutations currently pending
  const isMutating = useIsMutating();

  const createDeviceMutation = useCreateDevice(() => {
    // Resets the new device form upon successful device creation
    setFormKey(Date.now().toString());
    setShowForm(false);
  });

  const queryClient = useQueryClient();

  // Reload all device information
  const handleReload = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["device_ids"] });
    await queryClient.invalidateQueries({ queryKey: ["device"] });
  }, [queryClient]);

  // Restart the timer until automatic reloading of device data
  const restartAutoReload = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(handleReload, 60000);
  }, [handleReload]);

  // Auto-reload device information
  useEffect(() => {
    // If no requests are pending, start the timer
    if (isFetching === 0 && isMutating === 0) {
      restartAutoReload();
    }

    // Restart the timer upon any user action
    window.addEventListener("mousemove", restartAutoReload);
    window.addEventListener("keydown", restartAutoReload);

    return () => {
      // Cleanup
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      window.removeEventListener("mousemove", restartAutoReload);
      window.removeEventListener("keydown", restartAutoReload);
    };
  }, [isFetching, isMutating, restartAutoReload]);

  // Used to display when device information was last retrieved
  const currentTime = new Date().toLocaleTimeString("en-GB");

  const devices = devicesQuery.data.filter((result) => result !== undefined);

  let groups = {};
  switch (groupBy) {
    case "type":
      groups = Object.groupBy(devices ?? [], (device) => device.type ?? null);
      break;
    case "room":
      groups = Object.groupBy(devices ?? [], (device) => device.room ?? null);
      break;
    default:
      return <h1>Error: Unknown groupBy</h1>;
  }

  // Convert a string made up of words separated by either spaces or underscores
  // into a string in title format, i.e. capitalize the first letter of every
  // word and the rest are lowercase.
  function capitalize(string) {
    string = string.replace(/_/, () => " ");
    return string
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  let deviceGroups = [];
  for (const label in groups ?? {}) {
    if (label !== null) {
      deviceGroups.push(
        <DeviceGroup
          key={label}
          label={capitalize(label)}
          deviceList={groups[label]}
        />
      );
    }
  }

  if (deviceIdsQuery.isError || devicesQuery.isError) {
    return (
      <>
        <h1>Error loading data</h1>
        {deviceIdsQuery.isError && <p>{deviceIdsQuery.error.message}</p>}
        {devicesQuery.isError && <p>{devicesQuery.errors[0].message}</p>}
      </>
    );
  }

  return (
    <div
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "fit-content",
      }}
    >
      {/* Status message */}
      {(isFetching > 0 || isMutating > 0) && <h1>Loading...</h1>}
      {isFetching === 0 && isMutating === 0 && (
        <h1>{`Data retrieved at ${currentTime}`}</h1>
      )}
      <hr />
      {/* Device groups list */}
      <ul>{deviceGroups}</ul>
      <hr />
      {/* Buttons */}
      <button
        onClick={() => {
          setGroupBy(groupBy === "room" ? "type" : "room");
        }}
      >
        {groupBy === "room" ? "Group by type" : "Group by room"}
      </button>{" "}
      <button
        onClick={() => {
          if (!showForm) {
            setShowForm(true);
          }
        }}
      >
        Add device
      </button>{" "}
      <button onClick={handleReload}>Reload</button>
      <br />
      <br />
      {/* New device form */}
      {showForm && (
        <NewDeviceForm
          key={formKey}
          addDevice={(newDevice) => {
            createDeviceMutation.mutate(newDevice);
          }}
          verifyId={(newId) => {
            // Disallow existing IDs
            for (const device of devicesQuery.data ?? []) {
              if (device.id === newId) {
                return false;
              }
            }
            return true;
          }}
          // Disable input fields while there are pending requests
          disabled={isFetching > 0 || isMutating > 0}
        />
      )}
    </div>
  );
}
