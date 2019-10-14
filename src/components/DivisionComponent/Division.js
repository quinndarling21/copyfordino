import React, {Component} from 'react';
import { Nav } from 'react-bootstrap';


class Division extends Component {
    render() {
        return (  
            <Nav.Link className="DivisionButton" onClick = {() => this.props.onClick()} style = {(this.props.clicked) ? {color: 'white', fontWeight: 'bold'} : {fontWeight: 'bold'}}>
            {this.props.name}
            </Nav.Link>           
        )  
    } 
}

export default Division;