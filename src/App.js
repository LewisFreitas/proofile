import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {SimpleSigner} from 'uport-connect'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

import ipfs from './ipfs'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
import './App.css'

/*
<li className="pure-menu-item">
  <Link to="/profile" className="pure-menu-link">Profile</Link>
</li>
*/

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <UncontrolledDropdown nav inNavbar className="navbar-dropdown">
        <DropdownToggle nav caret>
        {
        this.props.user !== null &&
        this.props.user !== undefined &&
        this.props.user.avatar
          ? (
            <div>
              <p className="user-name">{this.props.user.name}</p>
              <img className="user-avatar" src={this.props.user.avatar.uri}></img>
            </div>
          )
          : <p className="user-name">Menu</p>
        }

        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <NavLink tag={Link} to="/dashboard">
              Dashboard
            </NavLink>
          </DropdownItem>
          <DropdownItem>
            <NavLink tag={Link} to="/profile">
              Profile
            </NavLink>
          </DropdownItem>
          <DropdownItem>
            <NavLink tag={Link} to="/license">
              Licenses
            </NavLink>
          </DropdownItem>
        <DropdownItem divider />
        <DropdownItem>
          <LogoutButtonContainer />
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
        <NavItem>
          <LoginButtonContainer />
        </NavItem>
    )

    return (
      <div>
        <Navbar color="light" fixed="top" light expand="md" className="navbar">
          <NavbarBrand tag={Link} to="/">proofile.</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>

              <OnlyGuestLinks />

              <OnlyAuthLinks />

            </Nav>
          </Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.data
  };
};

export default connect(mapStateToProps)(App);
