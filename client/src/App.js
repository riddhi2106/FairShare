import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext"; // ✅ import AuthProvider

// ✅ Page imports
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import GroupPage from "./pages/GroupPage";
import ExpensePage from "./pages/ExpensePage";
import BillsPage from "./pages/bills"; // ✅ added import for BillsPage

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<GroupPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/bills" element={<BillsPage />} /> {/* ✅ new Bills route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
