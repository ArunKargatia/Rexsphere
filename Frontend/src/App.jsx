import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./AuthContext";
import SignUp from "./pages/SignUp";
import Feed from "./pages/Feed";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-[var(--color-background)] min-h-screen">
          <Routes>
            <Route
              path="/*"
              element={  
                <>
                  <Navbar />
                  <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                  </Routes>
                </>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App