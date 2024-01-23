import "./App.css";
import NavBar from "./Components/Navbar";
import ChatBox from "./Components/ChatBox";
import Welcome from "./Components/Welcome.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.js";
import axios from "axios";

// axios.defaults.baseURL = "http://192.168.1.19:8000/api";
axios.defaults.baseURL = "http://192.168.1.2:8000/api";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.withCredentials = true;

function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <NavBar /> {!user ? <Welcome /> : <ChatBox />}
    </div>
  );
}

export default App;