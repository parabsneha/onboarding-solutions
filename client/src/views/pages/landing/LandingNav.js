import React, { useState, useEffect } from 'react';
// import { Button } from './Button';
import { Link } from 'react-router-dom';
import './LandingNav.css';
import jwt_decode from "jwt-decode";

function LandingNav() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

const [userName, setUserName] = useState();
const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
   
      console.log("useEffect working");
      var token = localStorage.getItem("token");
      if(token){
        var decoded = jwt_decode(token);
        console.log("token decoded == ", decoded);
        if(decoded.user_name){
          setUserName(decoded.user_name);
          setIsLoggedIn(true);
        }
      }
   
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            Onboarding Solutions
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
           
            <li className='nav-item'>
              <Link to='/blogs' className='nav-links' onClick={closeMobileMenu}>
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to='/login'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                {/* Login */}
                {
                  isLoggedIn ? userName : <p>Login</p>
                }
              </Link>
            </li>
          </ul>

        </div>
      </nav>
    </>
  );
}

export default LandingNav;