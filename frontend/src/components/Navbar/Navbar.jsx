import React, {useState} from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../Notification/Notification';
import apiClient from '../../services/apiClient';


function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error?.response?.data || error.message);
    } finally {
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('contestId');
      localStorage.removeItem('contestDate');
      localStorage.removeItem('contestEntryFee');
      localStorage.removeItem('exchange');
      localStorage.removeItem('teamId');
      localStorage.removeItem('selectedStocks');
      localStorage.removeItem('captain');
      localStorage.removeItem('viceCaptain');
      localStorage.removeItem('buyStocks');
      localStorage.removeItem('sellStocks');
      navigate('/login');
    }
  };

  return (
    <>
    <div className='navbar1'>
        <img src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738654508/oj7qqwdo1uimyam74bvh.png" alt="Trazex-logo" />

        <div className="elements">
           <Link to="/home"> <div className='element1'>Home</div></Link>
            <Link to="/newcontents"> <div className='element1'>Contents</div></Link>
           <Link to="/mycontest"> <div className='element1'>My Contents</div></Link>
           <Link to='/myteams'><div className='element1'>Teams</div></Link>
           <Link to='/leaderboard'> <div className='element1'>LeaderBoard</div></Link>
           <Link to="/screener"> <div className='element1'>Screener</div></Link>
           <Link to="/aboutus"> <div className='element1'>About us</div></Link>
        </div>

        <div className="icons">
           <Link to="/wallet"> <img src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738735332/romxcfbmkjipvlo9cxuv.png" alt="Wallet" /></Link>
           <Link to=""> <img onClick={() => setShowNotifications(!showNotifications)} src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738735235/g1mx54wxmywg4livi0lr.png" alt="Bell" /></Link>
           <Link to=""> <img src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738735114/jlsr9c1sfzufu3krjlql.png" alt="Profile-Icon" /></Link>
            <button type="button" className="logout-btn" onClick={handleLogout}>
             Logout
            </button>
        </div>
        
        <Notification isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

    </div>
    </>
  )
}

export default Navbar