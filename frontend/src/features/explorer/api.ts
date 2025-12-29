import {
  ConnectToHost,
  RequestFilesList,
} from "../../../wailsjs/go/bindings/app";

export const connectToHost = async (hostId: string) => {
  return await ConnectToHost(hostId);
};

export const requestFiles = async (path: string[]) => {
  return await RequestFilesList(path);
};
