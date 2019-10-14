import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import NavLink from 'react-bootstrap/NavLink';
import './ExploreMajors.css'




class ExploreMajors extends React.Component {
  render() {
    return(
      <div className = "Website">
        <Navbar variant = "light" className = "BearTracksHeader" fixed = 'top'>
          <Navbar.Brand href='./index.html' className = 'Brand'>
            <img className = 'Logo' src={require("../Images/HeaderLogo.png")} height="40" width="240"/>
            {/* <h1 className = 'BearTracks'>BearTracks</h1> */}
          </Navbar.Brand>
          <Navbar.Collapse className = 'HeaderNavBar'>
            <Nav>
              <NavLink href = './ProfilePage.html'>My Profile</NavLink>
              <NavLink disabled style = {{color: 'black', fontWeight: 600}}>Explore Degrees</NavLink>
              <NavLink href = './AboutPage.html'>About BearTracks</NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Navbar variant = 'light' className = "Footer" fixed = 'bottom'>
          © BearTracks 2019
        </Navbar>
      </div>

    );
  }
}



export default ExploreMajors;