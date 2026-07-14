import { LoginRequest } from "./types";
import { Login, Logout } from "../../../wailsjs/go/bindings/app";

export const loginUser = async (data: LoginRequest) => {
  const response = await Login(data);
  return response;
};

export const logoutUser = async () => {
  const response = await Logout();
  return response;
};
