import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../images/logo.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='header-container'>
      <div>
        <ul>
          <li>
            <NavLink exact to="/"><img src={logo} alt='SleepMe' id='logo'/></NavLink>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </ul>
      </div>
    </div >
  );
}

export default Navigation;
