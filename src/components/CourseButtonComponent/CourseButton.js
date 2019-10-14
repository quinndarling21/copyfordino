import React, {Component} from 'react';
import { DragSource } from 'react-dnd';
import { Card, Collapse } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
// import { Accordion, AccordionToggle, AccordionCollapse } from 'react-bootstrap';
// import callAPI from '../../pages/apiCall';
 
const courseButtonSource = {
    beginDrag(props) {
        course = callAPI(props.Course);
        return {'Course': course};
        /* returns course in the form of: {'Course': { 'Course': COMPSCI C100,
                                                        'Units': ...,
                                                        'Title: ...,
                                                        'Desc': ... }}]*/
    },

    endDrag(props, monitor, component) {
        return props.handleDrop();
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(), 
    }
}

class CourseButton extends Component {
    render() {
        const { isDragging, hovered, connectDragSource, Course } = this.props;
        const opacity = isDragging ? {opacity: .5} : {};
        const course = callAPI(this.props.Course);

        return (
            <Card className="CourseButton" border='primary'
                ref={instance => {
                const node = findDOMNode(instance);
                connectDragSource(node);
                }}
                onClick = {()=> this.props.handleClick()}>
                <Card.Header  className="CourseButtonHeader" >
                    {course['Course']}: {course['Title']} ({course['Units']} units)
                    {(this.props.overlapping.length > 0) &&
                    <img className = 'OverlapAlertIcon' src={require("../../Images/overlapAlert.png")} height="20" width="20"/>}
                </Card.Header>
                <Collapse in={this.props.isSelected}>
                <Card.Body className='CourseDescription'>
                    <>
                    {course['Desc'] && 
                    <div className = "DescDiv">
                    <h1 className = 'DescHeader'> DESCRIPTION </h1>
                    <p className='CourseDescBody'>
                        {course['Desc']}
                     </p>
                     </div>
                    }
                    {course['Terms'] && 
                    <div className = "TermDiv">
                    <h1 className = 'TermHeader'>TERMS OFFERED</h1>
                    <p className = 'CourseTerms'> {Course['Terms']} </p>
                    </div>
                    }
                    {course['Pres'] && 
                    <div className = "PresDiv">
                    <h1 className = 'PresHeader'> PREREQUISITES </h1>
                    <p className = 'CoursePres'> {Course['Pres']} </p>
                    </div>
                    }
                    {(this.props.overlapping.length > 0) &&
                    <div className = "OverlapDiv">
                    <h1 className = 'OverlapHeader'>OTHER REQUIREMENTS SATISFIED</h1>
                    {this.props.overlapping.map((requirment, index) => 
                    <p className = 'OverlappingReqs'>{requirment}</p>)}
                    </div>}
                    </>
                    
                    
                </Card.Body>
                </Collapse>
            </Card>
        )
    }
}

    export default DragSource("Course", courseButtonSource, collect)(CourseButton);