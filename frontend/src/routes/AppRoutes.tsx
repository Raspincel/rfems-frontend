import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login';
import { HomePage } from '../pages/Home';
import { ProtectedRoute } from '../features/auth';
import { AccessFilesPage } from '../pages/AccessFilesPage';
import { HostFolderPage } from '../pages/HostFolderPage';

export default function AppRoutes() {  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route path="" element={<HomePage />} />
          <Route path="access-files" element={<AccessFilesPage />} />
          <Route path="host-folder" element={<HostFolderPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}