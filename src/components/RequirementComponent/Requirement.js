import React, {Component} from 'react';
import CourseButton from '../CourseButtonComponent/CourseButton';
import { Accordion, Form} from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import SubGroup from '../SubGroupComponent/SubGroup';
import DepartmentSubGroup from '../DepartmentSubGroup/DepartmentSubGroup'
import CompletedCourseButton from '../CompletedCourseButton/CompletedCourseButton';
import {Modal} from 'react-bootstrap';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import {plans, addAutocomplete, removeAutocomplete, addCustomCourse} from '../../UserPlans/User.js'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';


function createName(courseList) {
    const name = [courseList[0]['Course']];
    for (let i = 1; i < courseList.length - 1; i++) {
        name.push(', ' + courseList[i]['Course'])
    }
    name.push(' & ' + courseList[courseList.length - 1]['Course'])
    return name.join('')
}

function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

function getCoursesFromSemesters(semesters) {
    var courseLists = [];
    for (let i = 0; i < semesters.length; i++) {
        courseLists.push(semesters[i][1])
    }
    return ([].concat.apply([], courseLists))
}

function checkAutoCompleted(category, requirement, planNum) {
    for (let j = 0; j < plans[planNum]['autoCompleted'].length; j++ ) {
        if (plans[planNum]['autoCompleted'][j][0]===category && plans[planNum]['autoCompleted'][j][1]===requirement){
            return plans[planNum]['autoCompleted'][j][2]
        }
    } return 'false'
}

function getSum(total, num) {
    return total + Math.round(num);
}

class Requirement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isClicked: this.props.isClicked,
            coursesData: this.props.courseData,
            selectedCourse: "",
            shouldUpdate: this.props.shouldUpdate,
            selectedPlan: this.props.selectedPlan,
            rotation: true,
            hovering: false,
            showReqModal: false,
            autoCompleted: checkAutoCompleted(this.props.selectedCategory, this.props.requirementTitle, this.props.selectedPlanNum),
            customCourse:['', '', '']
        };
        this.checkCompletedCourses = this.checkCompletedCourses.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.setSelectedCourse = this.setSelectedCourse.bind(this);
        this.toggleHoverOn = this.toggleHoverOn.bind(this);
        this.toggleHoverOff = this.toggleHoverOff.bind(this);
        this.showReqModal = this.showReqModal.bind(this);
        this.hideReqModal = this.hideReqModal.bind(this);
        this.AutoComplete = this.AutoComplete.bind(this);
        this.RemoveAutoComplete = this.RemoveAutoComplete.bind(this);
        this.updateCustomCourseName = this.updateCustomCourseName.bind(this);
        this.updateCustomCourseSemester = this.updateCustomCourseSemester.bind(this);
        this.updateCustomCourseUnits = this.updateCustomCourseUnits.bind(this);
        this.AutoCompleteWithCourse = this.AutoCompleteWithCourse.bind(this);
    } 

    componentWillReceiveProps(nextProps) {
        this.setState({ 
            semDates: nextProps.semDates,
            isClicked: nextProps.isClicked,
            shouldUpdate: nextProps.shouldUpdate,
            selectedPlan: nextProps.selectedPlan,
            autoCompleted: checkAutoCompleted(this.props.selectedCategory, this.props.requirementTitle, this.props.selectedPlanNum)})  
      }

    checkCompletedCourses() {

        this.props.progress();
        this.props.onUpdate();

    }

    setSelectedCourse(course) {
        if (this.state.selectedCourse === course) {
        this.setState({
            selectedCourse: ""
        })}
        else {
            this.setState({
                selectedCourse: course
            })}
        var curr = this.state.rotation
        this.setState({rotation: !curr})
    }

    overlapping(course, plan, reqTitle, catTitle) {
        var categories = plan.collegeData.concat(plan.majorData, plan.minorData);
        var catNames = plan.collegeNames.concat(plan.majorNames, plan.minorNames); 
        var reqs = [];
        for (var i = 0; i < catNames.length; i++) {
            var catReqs = categories[i][catNames[i]]['Requirements']
            for (var z = 0; z < catReqs.length; z++) {
                var currReq = catReqs[z]
                    var courses = currReq['Course'];
                    if (courses[0] !== 'departmentsubgroup') {
                        let singleCourses = [];

                        for (let k = 0; k < courses.length; k++) {
                            if (!isArray(courses[k])) {
                                singleCourses.push(courses[k])
                            } else {
                                for (let m = 0; m < courses[k].length; m++)
                                    singleCourses.push(courses[k][m])
                            }
                        }

                        for (let x = 0; x < singleCourses.length; x++) {
                            if (singleCourses[x] === course) {
                                if (reqTitle !== currReq['Requirement'] || catTitle !== catNames[i]) {
                                    reqs.push(catNames[i] + " >> " + currReq['Division'] + " >> " + currReq['Requirement'])
                                    break;
                                }
                            }
                        }
                    } else {
                        var groups = courses[1];
                        for (let q = 0; q < groups.length; q++) {
                            for (let p = 0; p < groups[q][1].length; p++) {
                                if (groups[q][1][p] === course) {
                                        if (reqTitle !== currReq['Requirement'] || catTitle !== catNames[i]) {
                                        reqs.push(catNames[i] + " >> " + currReq['Division'] + " >> " + currReq['Requirement'])
                                        break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        return reqs;
    }

    toggleHoverOn() {
        this.setState({
            hovering: true
        })
    }
    toggleHoverOff() {
        this.setState({
            hovering: false
        })
    }

    showReqModal() {
        this.setState({
            showReqModal: true
                })
    }

    hideReqModal() {
        this.setState({
            showReqModal:false
        })
    } 

   AutoComplete() {
        this.setState({
            autoCompleted: 'checkbox'
        })
        addAutocomplete([this.props.selectedCategory, this.props.requirementTitle, 'checkbox', this.state.customCourse[0]], this.props.selectedPlanNum)
        this.props.progress();
        this.props.onUpdate();
    }

    AutoCompleteWithCourse() {
        this.setState({
            autoCompleted: 'course'
        })
        addAutocomplete([this.props.selectedCategory, this.props.requirementTitle, 'course', this.state.customCourse[0]], this.props.selectedPlanNum)
    }

    RemoveAutoComplete() {
        this.setState({
            autoCompleted: 'false'
        })
        removeAutocomplete([this.props.selectedCategory, this.props.requirementTitle], this.props.selectedPlanNum)
        this.props.progress();
        this.props.onUpdate();
    }

    generateSemesters() {
        var semesters = []
        for (let i = 0; i < this.props.selectedPlan.semesters.length; i++){
            semesters.push({value:this.props.selectedPlan.semesters[i][0]})
        }
        return semesters
    }

    updateCustomCourseName(event) {
        var copy = this.state.customCourse
        copy[0] = event.target.value.toUpperCase()
        this.setState({
            customCourse: copy
        })
    }

    updateCustomCourseUnits(event) {
        var copy = this.state.customCourse
        copy[1] = event.target.value
        this.setState({
            customCourse: copy
        })
    }

    updateCustomCourseSemester(event) {
        var copy = this.state.customCourse
        copy[2] = event.target.value
        this.setState({
            customCourse: copy
        })
    }

    addCustomCourse() {
        if (this.state.customCourse[0] === '' || this.state.customCourse[1] === '' || this.state.customCourse[2] === '') {
            this.hideReqModal()
            return
        }
        var course = {'Course':{
                        'Course': this.state.customCourse[0],
                        'Units': this.state.customCourse[1],
                        'Title': 'Custom Course',
                        'Desc': "This is a custom course created to satisfy the '" + this.props.requirementTitle +"' requirment."
                        }}
        for (let i = 0; i < this.props.selectedPlan.semesters.length; i++) {
            if(this.state.customCourse[2]===this.props.selectedPlan.semesters[i][0]) {
                this.hideReqModal()
                addCustomCourse(course, i, this.props.selectedPlanNum)
            }
        }
        this.AutoCompleteWithCourse()
        this.props.renderSemesters()
        this.props.progress()
    }
    
    render() {
        var userCourses = getCoursesFromSemesters(this.state.selectedPlan.semesters);

        if (this.state.coursesData[0] != 'departmentsubgroup') {
            var Courses = [];
            var groups = [];

        for (let i = 0; i < this.state.coursesData.length; i++) {
            if (!isArray(this.state.coursesData[i])) {
                Courses.push(this.state.coursesData[i])
            } else {
                groups.push(this.state.coursesData[i])
            }
        }

        var compCourse = [];
        var compUnits = [0,0];
        var coursesCopy = Courses.slice();

        for (let i = 0; i < Courses.length; i++) {
            for (let j = 0; j < userCourses.length; j++) {
                if(Courses[i]['Course'] === userCourses[j]['Course']['Course']) {
                    compCourse.push(Courses[i])
                    compUnits.push(Courses[i]['Units'])
                    let correctInt;
                    for (let k = 0; k < coursesCopy.length; k++) {
                        if (coursesCopy[k]['Course'] === Courses[i]['Course']) {
                            correctInt = k;
                        }
                    }
                    coursesCopy.splice(correctInt,1);
                }
            }
        }

        var compGroups = [];
        var compGroupUnits = [0,0];
        for (let i = groups.length -1; i >= 0; i--) {
            var groupCourses = groups[i];
            var checkCompleteGroup = [];
            for (let j = groupCourses.length -1; j >= 0; j--) {
                let checkCompleteCourse = [];
                for (let k = 0; k < userCourses.length; k++) {
                    if (userCourses[k]['Course']['Course'] === groupCourses[j]['Course']) {
                        checkCompleteCourse.push(1)
                    }
                }
                if (checkCompleteCourse.length > 0) {
                    checkCompleteGroup.push(1);
                }
            }
            if (checkCompleteGroup.length === groupCourses.length) {
                compGroups.push(groups[i])
                for (let j = 0; j < groups[i].length; j++) {
                    compGroupUnits.push(groups[i][j]['Units'])
                }
                groups.splice(i, 1)
                }
            }
        console.log(compUnits)
        compUnits = compUnits.reduce(getSum)
        compGroupUnits = compGroupUnits.reduce(getSum)
        if (compGroupUnits > compUnits) {
            var compUnits = compGroupUnits
        }
        

            var Rotate;
            if (this.state.selectedCourse !== "true") {
                Rotate = '270deg';
            }
            else {
                Rotate = '0deg';
            }
            return (
                <div>
                    <Card className = 'requirement'> 
                        <div className ="RequirementHover">
                            <Accordion.Toggle className='RequirementHeader' as={Card.Header} eventKey={this.props.index} onClick = {()=>this.setSelectedCourse('')}
                            onMouseEnter = {() => this.toggleHoverOn()} onMouseLeave = {() => this.toggleHoverOff()}>
                                <div className = 'RequirementInfo'>
                                    <h1 className = 'RequirementTitle'>{this.props.requirementTitle}</h1>
                                    {!((compCourse.length + compGroups.length)/this.props.numClasses >= 1|| this.state.autoCompleted !== 'false') &&
                                    <h1 className = 'RequirementProgress'>{compCourse.length + compGroups.length}/{this.props.numClasses}</h1>}
                                    {(((compCourse.length + compGroups.length)/this.props.numClasses >= 1 && compUnits >= this.props.numUnits)|| this.state.autoCompleted !== 'false')&&
                                    <img className = 'RequirementProgress' src={require("../../Images/CompletedRequirement.png")} height = '30vw' width = '30vw'/>}
                                    {((compCourse.length + compGroups.length)/this.props.numClasses >= 1 && compUnits < this.props.numUnits) &&
                                    <h1 className = 'InsufficientUnits'>Insufficient Units ({compUnits}/{this.props.numUnits})</h1>}
                                    {this.state.hovering && !((compCourse.length + compGroups.length)/this.props.numClasses >= 1 && compUnits > this.props.numUnits) &&
                                    <img className = 'RequirementOptionsButton' src={require("../../Images/vertEllipsisBlue.png")} onClick = {()=>this.showReqModal()}/>}
                                </div>
                            </Accordion.Toggle>
                        </div>
                        
                        {compCourse.map((course, index)=> (
                            <Accordion.Collapse key = {this.state.selectedPlan + this.props.requirementTitle + index} eventKey={this.props.index}>
                                <CompletedCourseButton 
                                    planIndex={this.props.planIndex}
                                    Course={course}
                                    courseNumber={course['Course']}
                                    courseTitle={course['Title']}
                                    courseUnits={course['Units']} 
                                    key = {course['Title']}
                                    handleClick = {() => this.setSelectedCourse(course)}
                                    isSelected = {this.state.selectedCourse === course}
                                    courseDescription = {course['Desc']}
                                    courseTerms = {course['Terms']}
                                    coursePres = {course['Pres']}
                                    overlapping = {this.overlapping(course, this.state.selectedPlan, this.props.requirementTitle, this.props.selectedCategory)}
                                    />
                            </Accordion.Collapse>
                        ))}
    
                        {compGroups.map((group, index)=> (
                            <Accordion.Collapse key = {this.state.selectedPlan + createName(group) + index} eventKey={this.props.index}>
                                <Card.Body className = 'CompletedCourseInfo'>
                                    <h1>{createName(group)}</h1>
                                </Card.Body>
                            </Accordion.Collapse>
                        ))}
    
                        {coursesCopy.map((course, index)=> (
                        <Accordion.Collapse key = {this.state.selectedPlan + course + index} eventKey={this.props.index}>
                            <CourseButton
                                planIndex={this.props.planIndex}
                                Course={course}
                                courseNumber={course['Course']}
                                courseTitle={course['Title']}
                                courseUnits={course['Units']} 
                                key = {course['Title']}
                                handleDrop={() => this.checkCompletedCourses()}
                                handleClick = {() => this.setSelectedCourse(course)}
                                isSelected = {this.state.selectedCourse === course}
                                courseDescription = {course['Desc']}
                                courseTerms = {course['Terms']}
                                coursePres = {course['Pres']}
                                overlapping = {this.overlapping(course, this.state.selectedPlan, this.props.requirementTitle, this.props.selectedCategory)}/>
                        </Accordion.Collapse>
                            ))}
                        {groups.map((group, index) => (
                            <Accordion.Collapse key = {this.state.selectedPlan + group[0] + index} eventKey={this.props.index}>
                                <SubGroup
                                    key = {createName(group) + index}
                                    planIndex = {this.props.planIndex}
                                    name = {createName(group)}
                                    courses = {group}
                                    handleDrop={() => this.checkCompletedCourses()}
                                    selectedPlan = {this.state.selectedPlan}
                                    shouldUpdate = {this.props.shouldUpdate}
                                    progress = {(() => this.props.progress())}
                                    overlapping = {this.overlapping}
                                    requirementTitle = {this.props.requirementTitle}
                                    selectedCategory = {this.props.selectedCategory}
                                    />
                            </Accordion.Collapse>
                        ))}
                    </Card>
                    <Modal size="lg" show = {this.state.showReqModal} onHide = {()=>this.hideReqModal()}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {this.props.requirementTitle+' ('+this.props.numClasses+ " Course" + ((this.props.numClasses > 1)? 's':'') +', ' +this.props.numUnits+' Units)'}
                                </Modal.Title>
                                
                            </Modal.Header>
                            {this.state.autoCompleted === 'false' && 
                            <Modal.Body>
                                <div>Some requirements can be fulfilled by courses taken outside of UC Berkeley.</div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.autoCompleted === 'checkbox'}
                                            onChange={()=>this.AutoComplete() }
                                            value="checkedB"
                                            color="primary"
                                        />}
                                        label={"Check this box to manually complete the requirement."}
                                /></FormGroup>
                                <div> ---or--- </div>
                                <FormGroup row>
                                    <Form.Label style = {{marginTop: '.75%'}}>Add a custom course to your planner that will satisfy the requirement.</Form.Label>
                                </FormGroup>
                                <FormGroup row>
                                    <TextField
                                        label="Course Name"
                                        margin="normal"
                                        variant="outlined"
                                        onChange={this.updateCustomCourseName}
                                        value = {this.state.customCourse[0]}
                                    />
                                    <TextField
                                        select
                                        label="Units"
                                        margin="normal"
                                        variant = 'outlined'
                                        style = {{width: '100px', marginLeft: '10px'}}
                                        onChange={this.updateCustomCourseUnits}
                                        value = {this.state.customCourse[1]}
                                    >
                                        {[{label : '1', value : 1},{label : '2', value : 2},{label : '3', value : 3},{label : '4', value : 4},{label : '5', value : 5},{label : '6', value : 6}].map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        label="Semester"
                                        margin="normal"
                                        variant = 'outlined'
                                        style = {{width: '200px', marginLeft: '10px'}}
                                        onChange={this.updateCustomCourseSemester}
                                        value = {this.state.customCourse[2]}>
                                        {this.generateSemesters().map(semester => (
                                        <MenuItem key={semester.value} value={semester.value}>
                                            {semester.value}
                                        </MenuItem>
                                        ))}
                                    </TextField>
                                    <Button onClick = {()=>this.addCustomCourse()} color="primary" style = {{height: '40px', marginTop: '25px', marginLeft: '10px'}}>
                                        Add Course
                                    </Button>
                                </FormGroup>
                            </Modal.Body>}
                            {this.state.autoCompleted === 'checkbox' &&
                            <Modal.Body>
                                <div>Some requirements can be fulfilled by courses taken outside of UC Berkeley.</div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.autoCompleted === 'checkbox'}
                                            onChange={()=>this.RemoveAutoComplete()}
                                            value="checkedB"
                                            color="primary"
                                        />}
                                        label={"Check this box to manually complete the requirement."}
                                /></FormGroup>
                            </Modal.Body>}
                            {this.state.autoCompleted === 'course' &&
                            <Modal.Body>
                                <div>You are currently completing this requirement with a custom course.</div>
                            </Modal.Body>}
                    </Modal>
                </div>
            )
        } else {
            var compCourse = [];
            var groups = this.state.coursesData[1];
            for (let i = 0; i < groups.length; i++) {
                for (let j = 0; j < groups[i][1].length; j++) {
                    for (let k = 0; k < userCourses.length; k++) {
                        if (groups[i][1][j]['Course'] === userCourses[k]['Course']['Course']) {
                            compCourse.push(groups[i][1][j])
                        }
                    }
                }
            

            return(
                <div>
                    <Card className = 'requirement'>
                    <div className ="RequirementHover">
                            <Accordion.Toggle className='RequirementHeader' as={Card.Header} eventKey={this.props.index} onClick = {()=>this.setSelectedCourse('')} onMouseEnter = {() => this.toggleHoverOn()} 
                            onMouseLeave = {() => this.toggleHoverOff()}>
                                <div className = 'RequirementInfo'>
                                    <h1 className = 'RequirementTitle'>{this.props.requirementTitle}</h1>
                                    {!(compCourse.length/this.props.numClasses >= 1|| this.state.autoCompleted !== 'false') &&
                                    <h1 className = 'RequirementProgress'>{compCourse.length}/{this.props.numClasses}</h1>}
                                    {(compCourse.length/this.props.numClasses >= 1|| this.state.autoCompleted !== 'false')&&
                                    <img className = 'RequirementProgress' src={require("../../Images/CompletedRequirement.png")} height = '30vw' width = '30vw'/>}
                                    {this.state.hovering && !(compCourse.length/this.props.numClasses >= 1) &&
                                    <img className = 'RequirementOptionsButton' src={require("../../Images/vertEllipsisBlue.png")} onClick = {()=>this.showReqModal()}/>}
                                </div>
                            </Accordion.Toggle>
                        </div>
                        {compCourse.map((course, index)=> (
                        <Accordion.Collapse key = {this.state.selectedPlan + this.props.requirementTitle + index} eventKey={this.props.index}>
                            <CompletedCourseButton 
                                planIndex={this.props.planIndex}
                                Course={course}
                                courseNumber={course['Course']}
                                courseTitle={course['Title']}
                                courseUnits={course['Units']} 
                                key = {course['Title']}
                                handleDrop={() => this.checkCompletedCourses()}
                                handleClick = {() => this.setSelectedCourse(course)}
                                isSelected = {this.state.selectedCourse === course}
                                courseDescription = {course['Desc']}/>
                        </Accordion.Collapse>
                        ))}
                        {groups.map((group, index) => (
                        <Accordion.Collapse key = {this.state.selectedPlan + group[0] + index} eventKey={this.props.index}>
                            <DepartmentSubGroup
                                key = {group[0] + index}
                                planIndex = {this.props.planIndex}
                                name = {group[0]}
                                courses = {group[1]}
                                handleDrop={() => this.checkCompletedCourses()}
                                selectedPlan = {this.state.selectedPlan}
                                shouldUpdate = {this.props.shouldUpdate}
                                progress = {(() => this.props.progress())}
                                overlapping = {this.overlapping}
                                requirementTitle = {this.props.requirementTitle}
                                selectedCategory = {this.props.selectedCategory}
                                />
                        </Accordion.Collapse>
                        ))}
                    </Card>
                    <Modal size="lg" show = {this.state.showReqModal} onHide = {()=>this.hideReqModal()}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {this.props.requirementTitle+' ('+this.props.numClasses+ " Course" + ((this.props.numClasses > 1)? 's':'') +', ' +this.props.numUnits+' Units)'}
                                </Modal.Title>
                                
                            </Modal.Header>
                            {this.state.autoCompleted === 'false' && 
                            <Modal.Body>
                                <div>Some requirements can be fulfilled by courses taken outside of UC Berkeley.</div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.autoCompleted === 'checkbox'}
                                            onChange={()=>this.AutoComplete() }
                                            value="checkedB"
                                            color="primary"
                                        />}
                                        label={"Check this box to manually complete the requirement."}
                                /></FormGroup>
                                <div> ---or--- </div>
                                <FormGroup row>
                                    <Form.Label style = {{marginTop: '.75%'}}>Add a custom course to your planner that will satisfy the requirement.</Form.Label>
                                </FormGroup>
                                <FormGroup row>
                                    <TextField
                                        label="Course Name"
                                        margin="normal"
                                        variant="outlined"
                                        onChange={this.updateCustomCourseName}
                                        value = {this.state.customCourse[0]}
                                    />
                                    <TextField
                                        select
                                        label="Units"
                                        margin="normal"
                                        variant = 'outlined'
                                        style = {{width: '100px', marginLeft: '10px'}}
                                        onChange={this.updateCustomCourseUnits}
                                        value = {this.state.customCourse[1]}
                                    >
                                        {[{label : '1', value : 1},{label : '2', value : 2},{label : '3', value : 3},{label : '4', value : 4},{label : '5', value : 5},{label : '6', value : 6}].map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        label="Semester"
                                        margin="normal"
                                        variant = 'outlined'
                                        style = {{width: '200px', marginLeft: '10px'}}
                                        onChange={this.updateCustomCourseSemester}
                                        value = {this.state.customCourse[2]}>
                                        {this.generateSemesters().map(semester => (
                                        <MenuItem key={semester.value} value={semester.value}>
                                            {semester.value}
                                        </MenuItem>
                                        ))}
                                    </TextField>
                                    <Button onClick = {()=>this.addCustomCourse()} color="primary" style = {{height: '40px', marginTop: '25px', marginLeft: '10px'}}>
                                        Add Course
                                    </Button>
                                </FormGroup>
                            </Modal.Body>}
                            {this.state.autoCompleted === 'checkbox' &&
                            <Modal.Body>
                                <div>Some requirements can be fulfilled by courses taken outside of UC Berkeley.</div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.autoCompleted === 'checkbox'}
                                            onChange={()=>this.RemoveAutoComplete()}
                                            value="checkedB"
                                            color="primary"
                                        />}
                                        label={"Check this box to manually complete the requirement."}
                                /></FormGroup>
                            </Modal.Body>}
                            {this.state.autoCompleted === 'course' &&
                            <Modal.Body>
                                <div>You are currently completing this requirement with a custom course.</div>
                            </Modal.Body>}
                    </Modal>
                </div>
            )
        }
    } }
}

    export default Requirement;