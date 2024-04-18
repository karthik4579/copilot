import AuthenticationPage from "@/components/Auth";
import TextEditor from "./components/EditingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/components/Dashboard";
import "@/styles/globals.css";
import "@fontsource/inter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/edit" element={<TextEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
