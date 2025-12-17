import { useEffect } from "react";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { useDispatch } from "react-redux";
import { updateUserHostingStatus, updateUserStatus } from "../features/user";

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
    ];

    return () => events.forEach((off) => off());
  }, [dispatch, updateUserStatus]);
}
