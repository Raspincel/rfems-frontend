import { useAppSelector } from "../../../app/hooks";
import { selectNumberOfFiles, selectNumberOfFolders } from "../store/slices";

export default function HeaderMetadata() {
  const numberOfFolders = useAppSelector(selectNumberOfFolders);
  const numberOfFiles = useAppSelector(selectNumberOfFiles);

  return (
    <div className="text-sm text-gray-500">
      {numberOfFolders} folder{numberOfFolders !== 1 ? "s" : ""},{" "}
      {numberOfFiles} file{numberOfFiles !== 1 ? "s" : ""}
    </div>
  );
}
