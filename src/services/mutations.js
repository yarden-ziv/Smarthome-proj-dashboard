import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevice, deleteDevice, deviceAction, updateDevice } from "./api";

// Our API sends errors with a JSON object containing an 'error' key
// with an error message as its value. If the error is returned by our API
// then we want to access that error message. Otherwise, some other error
// occurred, so we access its message directly.
function handleError(error) {
  if (typeof error.response === "object") {
    if (typeof error.response.data === "object") {
      alert(error.response.data.error);
      return;
    }
  }
  alert(error.message);
}

// When a new device is created successfully, the app needs to reset the new
// device form. That is what the 'resetForm' function that is passed as an
// argument to this mutation does.
export function useCreateDevice(resetForm) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device) => createDevice(device),
    onError: (error) => handleError(error),
    onSuccess: async () => {
      resetForm();
      // Fetch updated device data
      await queryClient.invalidateQueries({ queryKey: ["device_ids"] });
      await queryClient.invalidateQueries({ queryKey: ["device"] });
    },
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device) => updateDevice(device),
    onError: (error) => handleError(error),
    onSuccess: async (data, variables) => {
      // Fetch updated device data
      await queryClient.invalidateQueries({ queryKey: ["device_ids"] });
      await queryClient.invalidateQueries({
        queryKey: ["device", variables.id],
      });
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteDevice(id),
    onError: (error) => handleError(error),
    onSuccess: async () => {
      // Fetch updated device data
      await queryClient.invalidateQueries({ queryKey: ["device_ids"] });
    },
    onSettled: (data, error, variables, context) =>
      queryClient.removeQueries({ queryKey: ["device", variables] }),
  });
}

export function useDeviceAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device) => deviceAction(device),
    onError: (error) => handleError(error),
    onSuccess: async (data, variables) => {
      // Fetch updated device data
      await queryClient.invalidateQueries({
        queryKey: ["device", variables.id],
      });
    },
  });
}
