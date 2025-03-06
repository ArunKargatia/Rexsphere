import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Signin";
import { AuthProvider } from "./AuthContext";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import CreateRec from "./components/CreateRec";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post" element={<PostDetail />} />
          <Route path="/create-rec" element={<CreateRec />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App