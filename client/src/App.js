import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext"; // ✅ import AuthProvider
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import GroupPage from "./pages/GroupPage";
import ExpensePage from "./pages/ExpensePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<GroupPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
