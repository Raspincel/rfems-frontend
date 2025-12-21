import {
  ChooseFolder,
  StartHosting,
  StopHosting,
} from "../../../wailsjs/go/bindings/app";

export const pickFolder = async () => {
  const folderPath = await ChooseFolder();
  return folderPath;
};

export const startHosting = async (folderName: string, isPublic: boolean) => {
  return await StartHosting({ folderName, isPublic });
};

export const stopHosting = async () => {
  return await StopHosting("online");
};
