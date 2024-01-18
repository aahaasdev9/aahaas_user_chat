import './App.css';
import NavBar from './Components/Navbar';
import ChatBox from './Components/ChatBox';
import Welcome from './Components/Welcome.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase.js';

function App() {

  const [user] = useAuthState(auth);
 
  return (
    <div>
      <NavBar />  {!user ? (<Welcome />) : (<ChatBox />)}
    </div>
  );
}

export default App;
