import React from 'react'
import { NavLink } from 'reactstrap'

const LogoutButton = ({ onLogoutUserClick }) => {
  return(
    <NavLink href="#" onClick={(event) => onLogoutUserClick(event)}>
      Logout
    </NavLink>
  )
}

export default LogoutButton
