import { GetUsersList, Me } from "../../../wailsjs/go/bindings/app";

export const getUsersList = async () => {
  const response = await GetUsersList();
  return response;
};

export const getMe = async () => {
  const response = await Me();
  return response;
};
