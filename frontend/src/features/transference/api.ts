import { RequestFileDownload } from "../../../wailsjs/go/bindings/app";

export const requestFileDownload = async (path: string[]) => {
  return await RequestFileDownload(path);
};
