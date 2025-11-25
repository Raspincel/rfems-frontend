import { LoginRequest } from "./types";
import { Login } from "../../../wailsjs/go/bindings/app";

export const loginUser = async (data: LoginRequest) => {
  const response = await Login(data);
  return response;
};
