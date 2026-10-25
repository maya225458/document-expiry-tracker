import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddDocument from "./pages/AddDocument";
import EditDocument from "./pages/EditDocument";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/add-document"
          element={<AddDocument />}
        />

        <Route
          path="/edit-document/:id"
          element={<EditDocument />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;