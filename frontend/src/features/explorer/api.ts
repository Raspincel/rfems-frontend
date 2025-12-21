import { ConnectToHost } from "../../../wailsjs/go/bindings/app";

export const connectToHost = async (hostId: string) => {
  return await ConnectToHost(hostId);
};
