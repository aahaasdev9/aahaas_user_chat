import './App.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightAndDownLeftFromCenter, faPaperPlane, faUserTie, faCircleUser, faMagnifyingGlass, faGear, faUserPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import NavBar from './Components/Navbar';
import ChatBox from './Components/ChatBox';
import Welcome from './Components/Welcome.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase.js';

function App() {

  const [user] = useAuthState(auth);
 

  return (
    <div className="App">
      <NavBar />  {!user ? (<Welcome />) : (<><ChatBox /></>)}
    </div>
  );
}

export default App;
