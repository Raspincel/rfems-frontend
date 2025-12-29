import {
  ChooseFolder,
  StartHosting,
  StopHosting,
} from "../../../wailsjs/go/bindings/app";

export const pickFolder = async () => {
  const folderPath = await ChooseFolder();
  return folderPath;
};

export const startHosting = async (folderPath: string, isPublic: boolean) => {
  return await StartHosting({ folderPath, isPublic });
};

export const stopHosting = async () => {
  return await StopHosting("online");
};
