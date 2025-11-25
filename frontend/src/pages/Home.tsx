import { DashboardLayout } from "../layouts/DashboardLayout";

export function HomePage() {
  return (
    <DashboardLayout currentRoute="home">
      <div>Welcome to the Home Page</div>
    </DashboardLayout>
  );
}
