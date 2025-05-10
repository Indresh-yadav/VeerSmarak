import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/NavBar";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminPanel from "../pages/AdminPanel";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import HeroDetail from "../components/HeroDetail";
import Home from "../pages/Home";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/:heroId" element={<AdminPanel />} />
        <Route path="/savedPosts" element={<Profile type="saved" />} />
        <Route path="/likedPosts" element={<Profile type="liked" />} />
        <Route path="/hero/:id" element={<HeroDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
