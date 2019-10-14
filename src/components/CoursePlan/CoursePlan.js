import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import {Button, Modal, SplitButton, Card, Dropdown, DropdownItem, Popover, PopoverContent, Overlay, OverlayTrigger} from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

 
const coursePlanSource = {
  beginDrag(props) {
    console.log('dragging')
    return props.Course
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    } else {
       return (
        props.handleDropOut(props.Course));
    }
  }
}

function collect(connect, monitor) {
  return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
  }
}
  
  class CoursePlan extends Component {

    constructor(props) {
      super(props);
      this.state = {
        exists: true,
        dropNum: 0,
        hovering: false,
        showOptions: false,
        showDetails: false,
        currentTarget: false
      }

      this.toggleHoverOn = this.toggleHoverOn.bind(this);
      this.toggleHoverOff = this.toggleHoverOff.bind(this);
      this.showOptions = this.showOptions.bind(this);
      this.hideOptions = this.hideOptions.bind(this);
      this.showDetails = this.showDetails.bind(this);
      this.closeDetails = this.closeDetails.bind(this);
    }

    toggleHoverOn() {
      this.setState({hovering: true})
    }

    toggleHoverOff() {
      this.setState({hovering: false})
    }

    showDetails() {
      this.setState({
        showDetails: true,
        showOptions: false
      })
    }

    showOptions = event => {
      this.setState({
        showOptions: true,
        anchor: event.currentTarget
      })
    }

    hideOptions() {
      this.setState({
        showOptions: false,
      })
    }

    closeDetails() {
      this.setState({
        showDetails: false,
        showOptions: false
      })
    }


    render() {

        const { isDragging, connectDragSource, Course} = this.props;
        const opacity = isDragging ? {opacity: 0} : {};
        
        
        return (
          <> 
            <Card
              className = "CoursePlanButton"
              border="primary"
              style = {opacity} 
              onMouseEnter = {() => this.toggleHoverOn()} 
              onMouseLeave = {() => this.toggleHoverOff()} 
              ref={instance => {
              const node = findDOMNode(instance);
              connectDragSource(node);
              }}>
                  <h2 className = 'CoursePlanNumber'>{this.props.number}</h2>
                  <h2 className = "CoursePlanUnits">{this.props.units}</h2>
                {this.state.hovering &&
                <img className = 'courseOptionsButton' src={require("../../Images/vertEllipsisWhite.png")} onClick={this.showOptions}/>}
                <Menu
                className = 'CoursePlanOptionsMenu'
                anchorEl = {this.state.anchor}
                open = {this.state.showOptions}
                onClose = {()=>this.hideOptions()}>
                  <MenuItem
                  className = "CoursePlanInfoButton" onClick = {()=>this.showDetails()}>Course Details
                  </MenuItem>
                  <MenuItem
                  className = "DeleteCourseButton" onClick = {()=>this.props.deleteCourse()}>Remove Course
                  </MenuItem>
                </Menu>
            </Card>


            <Modal size = 'lg' show={this.state.showDetails} onHide={this.closeDetails}>
              <Modal.Header closeButton>
                <Modal.Title>{this.props.number}: {this.props.title} ({this.props.units} units)</Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.props.description}</Modal.Body>
            </Modal>
          </>
        );
  }
}

export default DragSource("Course", coursePlanSource, collect)(CoursePlan);