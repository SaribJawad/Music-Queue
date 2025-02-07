import { Route, Routes } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import StreamPage from "./page/StreamPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/stream" element={<StreamPage />} />
    </Routes>
  );
}

export default App;
