import {
  ConnectToHost,
  RequestFilesList,
  ExitHostingSession,
  SendUpdateOnClientPath,
} from "../../../wailsjs/go/bindings/app";

export const connectToHost = async (hostId: string) => {
  return await ConnectToHost(hostId);
};

export const requestFiles = async (path: string[]) => {
  return await RequestFilesList(path);
};

export const exitHostingSession = async () => {
  return await ExitHostingSession();
};

export const sendUpdateOnPath = async (path: string[]) => {
  return await SendUpdateOnClientPath(path);
};
