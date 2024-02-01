import AuthenticationPage from "./components/Auth";
/*import editFile from "./components/editFile";*/
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthenticationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
