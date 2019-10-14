import React, {Component} from 'react';
import { Card, Collapse } from 'react-bootstrap';


class CompletedCourseButton extends Component {
    render() {

        return (
            <Card className="CompletedCourseButton" border='success'
                onClick = {()=> this.props.handleClick()}>
                <Card.Header  className="CompletedCourseButtonHeader" >{
                    this.props.courseNumber}: {this.props.courseTitle} ({this.props.courseUnits} units)
                    {(this.props.overlapping.length > 0) &&
                    <img className = 'OverlapAlertIcon' src={require("../../Images/completedOverlapAlert.png")} height="20" width="20"/>}
                </Card.Header>
                    {/* {this.props.isSelected &&  */}
                <Collapse in={this.props.isSelected}>
                <Card.Body className='CompletedCourseDescription'>
                <>
                    {this.props.courseDescription && 
                    <div className = "CompDescDiv">
                    <h1 className = 'CompDescHeader'> DESCRIPTION </h1>
                    <p className='CompCourseDescBody'>
                        {this.props.courseDescription}
                     </p>
                     </div>
                    }
                    {this.props.courseTerms && 
                    <div className = "CompTermDiv">
                    <h1 className = 'CompTermHeader'>TERMS OFFERED</h1>
                    <p className = 'CompCourseTerms'> {this.props.courseTerms} </p>
                    </div>
                    }
                    {this.props.coursePres && 
                    <div className = "CompPresDiv">
                    <h1 className = 'CompPresHeader'> PREREQUISITES </h1>
                    <p className = 'CompCoursePres'> {this.props.coursePres} </p>
                    </div>
                    }
                    {(this.props.overlapping.length > 0) &&
                    <div className = "CompOverlapDiv">
                    <h1 className = 'CompOverlapHeader'>OTHER REQUIREMENTS SATISFIED</h1>
                    {this.props.overlapping.map((requirment, index) => 
                    <p className = 'CompOverlappingReqs'>{requirment}</p>)}
                    </div>}
                    </>
                </Card.Body>
                </Collapse>
            </Card>
        )
    }
}

    export default CompletedCourseButton;