import React from 'react'
import { NavLink } from 'react-router-dom'

const mainNavigation = props => (
  <header>
    <div className='main-navigation__logo'>
      <h1>EasyEvent</h1>
    </div>
    <div className='main-navigation__item'>
      <ul>
        <li>
          <NavLink to='/auth'>Authenticate</NavLink>
        </li>
        <li>
          <NavLink to='/events'>Events</NavLink>
        </li>
        <li>
          <NavLink to='/bookings'>Bookings</NavLink>
        </li>
      </ul>
    </div>
  </header>
)

export default mainNavigation
