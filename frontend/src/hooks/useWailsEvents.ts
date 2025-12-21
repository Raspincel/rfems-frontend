import { useEffect } from "react";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { useDispatch } from "react-redux";
import { updateUserHostingStatus, updateUserStatus } from "../features/user";
import { updateConnectedUser } from "../features/hosting";
import { disconnectFromHost } from "../features/explorer";

export function useWailsEvents() {
  const dispatch = useDispatch();

  useEffect(() => {
    const events = [
      EventsOn("user:status_update", (data) => {
        dispatch(updateUserStatus(data));
      }),
      EventsOn("user:hosting_update", (data) => {
        dispatch(updateUserHostingStatus(data));
      }),
      EventsOn("user:connected_user_update", (data) => {
        dispatch(updateConnectedUser(data));
      }),
      EventsOn("user:kicked_by_host", (data) => {
        dispatch(disconnectFromHost(data));
      }),
    ];

    return () => events.forEach((off) => off());
  }, [dispatch, updateUserStatus]);
}
