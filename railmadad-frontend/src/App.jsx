import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FileComplaintPage from "./pages/FileComplaintPage";
import TrackStatusPage from "./pages/TrackStatusPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/file-complaint" element={<FileComplaintPage />} />
      <Route path="/track" element={<TrackStatusPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}

export default App;
