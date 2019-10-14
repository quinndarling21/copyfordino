import React, {Component} from 'react';
import Division from '../DivisionComponent/Division'; 
import Requirement from '../RequirementComponent/Requirement';
import {Accordion, Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import courses from '../../courses.json'
import CourseButton from '../CourseButtonComponent/CourseButton';
import CompletedCourseButton from '../CompletedCourseButton/CompletedCourseButton';

const allCourses = Object.keys(courses);


function getCoursesFromSemesters(semesters) {
    var courseLists = [];
    for (let i = 0; i < semesters.length; i++) {
        courseLists.push(semesters[i][1])
    }
    return ([].concat.apply([], courseLists))
}

function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

class CourseSearchTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCourse: "",
            filteredComplete:[],
            filteredIncomplete:[],
            search: "",
            selectedPlan: this.props.selectedPlan,
            shouldUpdate: this.props.shouldUpdate
        }

        this.setSelectedCourse = this.setSelectedCourse.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.runSearch = this.runSearch.bind(this);
        this.runSearchonEnter = this.runSearchonEnter.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ shouldUpdate: nextProps.shouldUpdate });  
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
    }

    runSearch() {
        this.setState({
            filteredComplete: [],
            filteredIncomplete: []
        })
        var filteredList = allCourses.filter(course => {
            return (course.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || courses[course]["Title"].toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
        })
        var userCourses = getCoursesFromSemesters(this.state.selectedPlan.semesters)
        var filteredComplete = []
        var filteredIncomplete = []

        if (userCourses.length === 0) {
            filteredIncomplete = filteredList
        } else {

        for (let j = 0; j < userCourses.length; j++) {
            for (let i = 0; i < filteredList.length; i ++) {
                if (filteredList[i] === userCourses[j]['Course']['Course']) {
                    filteredComplete.push(filteredList[i])
                } else {
                    filteredIncomplete.push(filteredList[i])
                }
            }
        }
    }

        this.setState({
            filteredComplete: filteredComplete,
            filteredIncomplete: filteredIncomplete});
      }

      runSearchonEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            this.setState({
                filteredComplete: [],
                filteredIncomplete: []
            })
            var filteredList = allCourses.filter(course => {
                return (course.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || courses[course]["Title"].toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
            })
            
        var userCourses = getCoursesFromSemesters(this.state.selectedPlan.semesters)
        var filteredComplete = []
        var filteredIncomplete = []

        if (userCourses.length === 0) {
            filteredIncomplete = filteredList
        } else {

        for (let j = 0; j < userCourses.length; j++) {
            for (let i = 0; i < filteredList.length; i ++) {
                if (filteredList[i] === userCourses[j]['Course']['Course']) {
                    filteredComplete.push(filteredList[i])
                } else {
                    filteredIncomplete.push(filteredList[i])
                }
            }
        }
    }

        this.setState({
            filteredComplete: filteredComplete,
            filteredIncomplete: filteredIncomplete});
      }
      }
    

    updateSearch(event) {
        var searchTerm = event.target.value;
        
        this.setState({
            filteredComplete: [],
            filteredIncomplete: [],
            search: searchTerm});
      }
    
    handleSubmit(event) {
        this.handleChange(event)
        event.preventDefault();
      }

    handleDrop() {
        this.props.progress();
        this.props.onUpdate();
        this.runSearch();
    }

    overlapping(course, plan, reqTitle, catTitle) {
        debugger;
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
                            if (singleCourses[x]['Course'] === course) {
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

    render() {

        return (
            <div>
                <Navbar bg = "primary" variant = 'dark' className="SearchCourses">
                    <img className = 'backToDivisions' onClick = {()=>this.props.showDivisions()} src={require("../../Images/backarrow.png")} height="30" width="30"/>
                    <Form inline className = 'CourseSearchForm'>
                        <FormControl className = 'CourseSearchBar' type="text" onChange = {this.updateSearch} onKeyPress={this.runSearchonEnter} value = {this.state.search} placeholder="Search for a course"/>
                    </Form>
                </Navbar>
                <div className="RequirementTable">
                    <Accordion className = 'CourseSearchList'>
                        {this.state.filteredComplete.map((course, index)=> {
                            return (
                                <CompletedCourseButton
                                Course={courses[course]}
                                courseNumber={courses[course]['Course']}
                                courseTitle={courses[course]['Title']}
                                courseUnits={courses[course]['Units']} 
                                key = {courses[course]['Course']}
                                courseDescription = {courses[course]['Desc']}
                                handleClick = {()=>this.setSelectedCourse(course)}
                                isSelected = {this.state.selectedCourse === course}
                                overlapping = {this.overlapping(course, this.state.selectedPlan, '', '')}/>
                            )
                        })}
                        {this.state.filteredIncomplete.map((course, index) => {
                        return (
                                <CourseButton
                                Course={courses[course]}
                                courseNumber={courses[course]['Course']}
                                courseTitle={courses[course]['Title']}
                                courseUnits={courses[course]['Units']} 
                                key = {courses[course]['Course']}
                                courseDescription = {courses[course]['Desc']}
                                handleClick = {()=>this.setSelectedCourse(course)}
                                handleDrop = {()=>this.handleDrop()}
                                isSelected = {this.state.selectedCourse === course}
                                overlapping = {this.overlapping(course, this.state.selectedPlan, '', '')}/>
                        )})}
                    </Accordion>
                </div>
            </div>
        )
    }
}

export default CourseSearchTable;