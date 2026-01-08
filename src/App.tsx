import { Navigate, Route, Routes } from "react-router-dom";
import HandleUserDetailPage from "./pages/user-detail-page";
import HandleUserListPage from "./pages/user-list-page";

export default function HandleApp() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Live weather feed</p>
          <h1 className="app-title">User Weather Dashboard</h1>
          <p className="app-subtitle">
            Ten randomly generated users with live weather snapshots.
          </p>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HandleUserListPage />} />
          <Route path="/users/:userId" element={<HandleUserDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
