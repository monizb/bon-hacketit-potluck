import './App.css';
import Landing from './Components/Landing';
import Profile from './Pages/Profile';
import Dashboard from './Pages/Dashboard';
import New from './Pages/New';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { initializeApp } from 'firebase/app';
import Pot from './Pages/Pot';

const firebaseConfig = {
  apiKey: "AIzaSyDIjIH_1Ov_HbZfDWXBUd1o4-7gFEBKMRI",
  authDomain: "potluck-63627.firebaseapp.com",
  databaseURL: "https://potluck-63627-default-rtdb.firebaseio.com",
  projectId: "potluck-63627",
  storageBucket: "potluck-63627.appspot.com",
  messagingSenderId: "100167836989",
  appId: "1:100167836989:web:4f0b6988182ad920bf5154",
  measurementId: "G-DC160W1QDB"
};

function App() {
  initializeApp(firebaseConfig);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/new" element={<New />} />
        <Route exact path="/pots/:potid" element={<Pot />} />
      </Routes>
    </Router>
  );
}

export default App;
