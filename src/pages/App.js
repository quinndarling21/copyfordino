import React from 'react';
import './App.css';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Planner from '../components/PlannerComponent/Planner'
import { Navbar, Nav } from 'react-bootstrap'
import NavLink from 'react-bootstrap/NavLink';



class App extends React.Component {
  render() {
    return(
      <div className = "Website">
        <Navbar variant = "light" className = "BearTracksHeader" fixed = 'top'>
          <Navbar.Brand className = 'Brand'>
            <img className = 'Logo' src={require("../Images/HeaderLogo.png")} height="40" width="240"/>
          </Navbar.Brand>
          <Navbar.Collapse className = 'HeaderNavBar'>
            <Nav>
              <NavLink href='./ProfilePage.html'>My Profile</NavLink>
              <NavLink href = './ExploreMajorsPage.html'>Explore Degrees</NavLink>
              <NavLink href = './AboutPage.html'>About BearTracks</NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Planner />
        <Navbar variant = 'light' className = "Footer" fixed = 'bottom'>
          © BearTracks 2019
        </Navbar>
      </div>

    );
  }
}



export default DragDropContext(HTML5Backend)(App);
