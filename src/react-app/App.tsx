import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import MapPage from "@/react-app/pages/Map";
import SuggestionsPage from "@/react-app/pages/Suggestions";
import AdminPage from "@/react-app/pages/Admin";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/sugestoes" element={<SuggestionsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
