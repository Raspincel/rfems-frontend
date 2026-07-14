import Breadcrumb from "./Breadcrumb";
import HeaderMetadata from "./HeaderMetadata";
import HeaderNavigation from "./HeaderNavigation";

export default function ExplorerHeader() {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <HeaderNavigation />
        <Breadcrumb />
      </div>
      <HeaderMetadata />
    </div>
  );
}
