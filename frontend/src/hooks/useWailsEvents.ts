import { useEffect } from "react";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { useDispatch } from "react-redux";
import { updateUserStatus } from "../features/user";

export function useWailsEvents() {
  const dispatch = useDispatch();

  useEffect(() => {
    const events = [
      EventsOn("user:status_update", (data) => {
        dispatch(updateUserStatus(data));
      }),
    ];

    return () => events.forEach((off) => off());
  }, [dispatch, updateUserStatus]);
}
