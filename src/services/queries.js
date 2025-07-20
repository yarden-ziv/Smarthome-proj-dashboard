import { useQuery, useQueries } from "@tanstack/react-query";
import { getDeviceIds, getDevice } from "./api";

// Get the data on a list of devices based on their IDs, in parallel form.
export function useDevices(ids) {
  const normalizedIds = Array.isArray(ids)
    ? ids
    : ids === null || ids === undefined
    ? []
    : [ids];
  return useQueries({
    queries: normalizedIds.map((id) => {
      return {
        queryKey: ["device", id],
        queryFn: () => getDevice(id),
      };
    }),
    combine: combineDevices,
  });
}

function combineDevices(results) {
  return {
    data: results.map((result) => result.data),
    isPending: results.some((result) => result.isPending),
    isError: results.some((result) => result.isError),
    errors: results.map((result) => result.error ?? ""),
  };
}

// Get a list of all device IDs from the server
export function useDeviceIds() {
  return useQuery({
    queryKey: ["device_ids"],
    queryFn: getDeviceIds,
  });
}
