import React from 'react'
import { NavLink } from 'reactstrap'

// Images
import uPortLogo from '../../../img/uport-logo.svg'

const LoginButton = ({ onLoginUserClick }) => {
  return(
    <div>
      <NavLink href="#" onClick={(event) => onLoginUserClick(event)}>
        Login with UPort
      </NavLink>
    </div>
  )
}

export default LoginButton
