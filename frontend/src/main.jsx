// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Homepage from './components/Main Home/mainhome';
import Aboutus from './components/Aboutus/Aboutus';
import Card from './components/New Contents/card';
import Guaranteed from './components/GuaranteedPlus/Guaranteed';
import CreateTeamsPage from './components/CreateTeams/CreateTeampage';
import CaptainPage from './components/Captain-Page/CaptainPage';
import MyTeamPage from './components/MyTeam/Teampage.';
import JoinContent from './components/JoinContent/JoinContent';
import MyContest from './components/MyContest/MyContest';
// import MycontestTeam from './components/MycontentsTeam/MycontestTeam';
import ScrennerCard from './components/Screener/ScreenerCard';
import Wallet from './components/Wallet/Wallet';
import Leaderboard from './components/Leaderboard/Leaderboard';
import SocketProvider from './components/common/SocketProvider';
// import ContestDetails from './components/ContestDetails/ContestDetails';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* <Navbar /> */}
    <SocketProvider>
      <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/aboutus" element={<Aboutus />} />
          {/* <Route path="/contents" element={<Contents />} /> */}
          <Route path="/newcontents" element={<Card />} />
          <Route path="/createteams" element={<CreateTeamsPage />} />
          <Route path="/captainpage" element={<CaptainPage />} />
          <Route path="/myteams" element={<MyTeamPage />} />
          <Route path="/joincontent" element={<JoinContent />} />
          <Route path="/mycontest" element={<MyContest />} />
          {/* <Route path="/mycontestteam" element={<MycontestTeam />} /> */}
          <Route path="/screener" element={<ScrennerCard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contestdetails/date/:date/exchange/:exchange" element={<Guaranteed />} />
        </Routes>
    </SocketProvider>
    {/* <Footer /> */}
  </BrowserRouter>
);
