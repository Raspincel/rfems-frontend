import {
  ConnectToHost,
  RequestFilesList,
  ExitHostingSession,
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
