import AuthenticationPage from "@/components/Auth";
/*import editFile from "./components/editFile";*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import DashboardPage from "@/components/Dashboard"
import "@/styles/globals.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/dashboard" element={<AuthenticationPage />}/>
        <Route path="/editfile" element={<AuthenticationPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
