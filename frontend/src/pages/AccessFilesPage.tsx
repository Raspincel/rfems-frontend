import { useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { UsersTable, selectProfileStatus, selectUsersStatus, fetchBasicUsersInfosThunk } from "../features/user";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export function AccessFilesPage() {
  const dispatch = useAppDispatch();

  const usersStatus = useAppSelector(selectUsersStatus);
  const profileStatus = useAppSelector(selectProfileStatus);

  useEffect(() => {
    if (usersStatus === "idle" && profileStatus === "succeeded") {
      dispatch(fetchBasicUsersInfosThunk());
    }
  }, [usersStatus, dispatch, profileStatus]);

  return (
    <DashboardLayout currentRoute="access-files">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Access Remote Files
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage connections and view hosted folders.
            </p>
          </div>
        </div>

        <UsersTable />
      </div>
    </DashboardLayout>
  );
}
