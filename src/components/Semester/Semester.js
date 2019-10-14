import React, { Component } from 'react';
import { DropTarget } from 'react-dnd'
import CoursePlan from '../CoursePlan/CoursePlan.js';
import {removeCustomCourse} from '../../UserPlans/User';
import {Card, Button, Dropdown} from 'react-bootstrap'
import { findDOMNode } from 'react-dom';


function collect(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      hovered: monitor.isOver(),
      Course: monitor.getItem()
    }
  }

const targetSpec = {
    drop(props, monitor, component) {
        if(component.checkCanDrop(monitor.getItem())) {
        component.handleDrop(monitor.getItem());
    };
    }
}

function calculateUnits(courses) {
    var sum = [0, 0];
    for (let i = 0; i < courses.length; i++) {
        sum.push(courses[i]['Course']['Units'])
    }
    return sum.reduce(getSum)
}

function getSum(total, num) {
    return total + Math.round(num);
}

function getCorrectIndex(date) {
    return date.semDate === this.props.semDate;
}

class Semester extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: this.props.courses,
            unitCount: calculateUnits(this.props.courses),
            shouldUpdate: this.props.shouldUpdate,
            hovering: false,
            selectedPlan: this.props.selectedPlan
        }

        this.handleDrop = this.handleDrop.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
        this.toggleHoverOn = this.toggleHoverOn.bind(this);
        this.toggleHoverOff = this.toggleHoverOff.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ 
            selectedPlan: nextProps.selectedPlan,
            shouldUpdate: nextProps.shouldUpdate,
            courses: nextProps.courses,
            unitCount: calculateUnits(nextProps.courses)}) 
      }

    checkSameSemester(rootSem) {
        return this.props.numSem ===rootSem;
    }

    concatUserSems() {
        var userSemCopy = this.state.selectedPlan.semesters.slice();
        return [].concat.apply([], userSemCopy);
    }

    deleteCourse(course) {
        for (let i = 0; i < this.state.selectedPlan.semesters.length; i++) {
            if (this.state.selectedPlan.semesters[i][0]===this.props.date) {
                for (let j = 0; j < this.state.selectedPlan.semesters[i][1].length; j++) {
                    if (this.state.selectedPlan.semesters[i][1][j]===course) {
                        this.state.selectedPlan.semesters[i][1].splice(j, 1)
                    }
                }
            }
        }
        if (course['Course']['Title'] === 'Custom Course') {
            removeCustomCourse(course['Course']['Course'], this.props.selectedPlanNum)
        }

        // var coursesCopy = this.state.courses;
        // var filtered = coursesCopy.filter(a => a['Course'] !== course['Course']);
        // this.setState({
        //     courses: filtered,
        //     unitCount: this.state.unitCount - course["Units"]
        // })
        // var userSemCopy = this.state.selectedPlan.semesters[this.props.semNum].slice();
        // var index;
        // for (let i = 0; i < userSemCopy.length; i++) {
        //     if (userSemCopy[i]['Course'] === ["Course"]) {
        //         index = i;
        //     }
        // }
        // userSemCopy.splice(index,1);
        // plans[this.props.planIndex].semesters[this.props.semNum] = userSemCopy;
        this.props.onDelete();
    }

    checkCanDrop(droppedCourse) {
        for(let i = 0; i < this.state.courses.length; i++) {
            if (this.state.courses[i]["RootSem"]===droppedCourse["RootSem"] && this.state.courses[i]['Course']["Course"]===droppedCourse['Course']["Course"]) {
                return true;
            }
            if (this.state.courses[i]['Course']["Course"]===droppedCourse['Course']["Course"])  {
                return false;
            }
        }
        return true;
    }

    handleDrop(droppedCourse) {
        /* receives course in the following form: {'Course' : {'Course': COMPSCI C100,
                                                            'Units': ...,
                                                             'Title: ...,
                                                             'Desc': ... }}]*/
        this.setState(prevState => ({
            courses: [...prevState.courses, droppedCourse],
            unitCount: this.state.unitCount + droppedCourse['Course']['Units']
          }))
        //the following code updates the user object
        let userSemCopy = this.state.selectedPlan.semesters.slice();
        for(let i = 0; i<userSemCopy.length; i++) {
            if(userSemCopy[i][0]===this.props.date) {
                this.props.selectedPlan.semesters[i][1].push(droppedCourse)
            }
        }
        // const thisSem = userSemCopy[this.props.semNum].slice();
        // thisSem.push(droppedCourse);
        // userSemCopy[this.props.semNum] = thisSem;
        // this.props.selectedPlan.semesters = userSemCopy
        /*semesters get info in form of /*{courseInfo: {'Course': COMPSCI C100,
                                                        'Units: ...,
                                                        'Title': ...,
                                                        'Desc': ...}}*/
    }
    
    deleteDraggedCourse = (course) => { 
        var index = null;
        const userSemCopy = this.state.selectedPlan.semesters.slice();
        for(var i = (this.state.courses.length - 1); i >= 0; i--) {
            if (this.state.courses[i]['Course'] === course['Course']) {
                index = i;
                for (let j = 0; j < userSemCopy.length; j++) {
                    if (userSemCopy[j][0]===this.props.date) {
                        this.state.selectedPlan.semesters[j][1].splice(i,1)
                    }
                }
                break;
            }
        }
        const courses = []
        for(var i = 0; i < this.state.courses.length; i++) {
            if (i!==index) {
                courses.push(this.state.courses[i])
            }
            }
        this.setState({
            courses: courses,
            unitCount: this.state.unitCount - course["Units"]
        })
    }

    toggleHoverOn() {
        this.setState({hovering: true})
      }
  
      toggleHoverOff() {
        this.setState({hovering: false})
      }

    calcWidth() {
        if (this.state.selectedPlan.semesters.length > 10) {
            return '15.75%'
        }
        if (this.state.selectedPlan.semesters.length > 8) {
            return '19%'
        }
        return '24%'
    }


        

    render() {
        const { connectDropTarget, hovered, Course} = this.props;
        const backgroundColor = hovered ? 'lightgrey' : 'white';
        return (
                <Card className = 'SemesterCard' bg = "light" variant = "light" ref={instance => {
                    const node = findDOMNode(instance);
                    connectDropTarget(node);}}
                    style = {{width: this.calcWidth()}}>
                    <Card.Header className="SemesterHeader" onMouseEnter = {() => this.toggleHoverOn()} onMouseLeave = {() => this.toggleHoverOff()}>
                        <>
                            <h1 className="SemDate"> {this.props.date.toUpperCase()} </h1>
                            {this.state.hovering && <img className = 'deleteSemesterButton' onClick = {()=>this.props.removeSemester()} src={require("../../Images/x.png")} height="15" width="15"/>}
                        </>
                        
                    </Card.Header>
                    <Card.Body className = "CourseTarget" style={{ background: backgroundColor}}>
                        {this.state.courses.map((course, index)=>{
                            course["RootSem"] = this.props.semNum;
                                return <CoursePlan 
                                key = {course['Course']["Course"] + ' ' + this.props.date }
                                handleDropOut= {(course) => this.deleteDraggedCourse(course)}
                                Course = {course}
                                semNum = {this.props.semNum}
                                number = {course['Course']["Course"]} 
                                units = {course['Course']["Units"]}
                                title = {course['Course']['Title']}
                                description = {course['Course']['Desc']}
                                deleteCourse = {() => this.deleteCourse(course)}
                                />
                            })}
                    </Card.Body>
                    <Card.Footer className = "SemesterFooter">
                        <h1 className='unitCount'>Total Units: </h1>
                        <h1 className="unitNum"> {this.state.unitCount}</h1>
                    </Card.Footer>
                </Card>
        )
    }
} 

export default DropTarget("Course", targetSpec, collect)(Semester);