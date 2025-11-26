import { DashboardLayout } from "../layouts/DashboardLayout";

export function HomePage() {
  return (
    <DashboardLayout currentRoute="dashboard">
      <div>Welcome to the Home Page</div>
    </DashboardLayout>
  );
}
