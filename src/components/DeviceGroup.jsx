import Device from "./Device";
import {
  useDeleteDevice,
  useDeviceAction,
  useUpdateDevice,
} from "../services/mutations";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export default function DeviceGroup({
  // The label for this group of devices
  label,
  // The list of devices in this group
  deviceList,
}) {
  // The number of queries currently pending
  const isFetching = useIsFetching();
  // The number of mutations currently pending
  const isMutating = useIsMutating();

  const deleteDeviceMutation = useDeleteDevice();
  const updateDeviceMutation = useUpdateDevice();
  const deviceActionMutation = useDeviceAction();

  // Convert device objects into React components
  const devices = (deviceList ?? []).map((device) => {
    return (
      <li key={device.id}>
        <Device
          id={device.id}
          type={device.type}
          name={device.name}
          status={device.status}
          room={device.room}
          parameters={{ ...device.parameters }}
          updateDevice={(update) => {
            updateDeviceMutation.mutate(update);
          }}
          removeDevice={(idToDelete) => {
            deleteDeviceMutation.mutate(idToDelete);
          }}
          deviceAction={(action) => {
            deviceActionMutation.mutate(action);
          }}
          // Disable input fields while there are pending requests
          disabled={isFetching > 0 || isMutating > 0}
        />
      </li>
    );
  });

  return (
    <li>
      {label}:<ul>{devices}</ul>
    </li>
  );
}
