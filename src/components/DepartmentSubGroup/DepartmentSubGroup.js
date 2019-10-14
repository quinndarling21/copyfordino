import React, {Component} from 'react';
import CourseButton from '../CourseButtonComponent/CourseButton';
import { Card, Collapse } from 'react-bootstrap';

function getCoursesFromSemesters(semesters) {
    var courseLists = [];
    for (let i = 0; i < semesters.length; i++) {
        courseLists.push(semesters[i][1])
    }
    return ([].concat.apply([], courseLists))
}

class DepartmentSubGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: this.props.courses,
            completedCourses: [],
            showCourses: false,
            selectedCourse: "",
            selectedPlan: this.props.selectedPlan,
            shouldUpdate: this.props.shouldUpdate
        }
        this.toggleShowCourses = this.toggleShowCourses.bind(this);
        this.checkCompletedCourses = this.checkCompletedCourses.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ 
            selectedPlan: nextProps.selectedPlan,
            shouldUpdate: nextProps.shouldUpdate})  
      }

    toggleShowCourses() {
        this.setState({
            showCourses:!this.state.showCourses,
            selectedCourse: ''
        })
    }

    setSelectedCourse(course) {
        if (course === this.state.selectedCourse) {
            this.setState({
                selectedCourse: ''
            })
        } else {
            this.setState({
            selectedCourse: course
        })
        }
    }

    checkCompletedCourses() {
        let userCourses = getCoursesFromSemesters(this.state.selectedPlan.semesters);
        let Courses = this.props.courses;
        let compCourse = [];
        let coursesCopy = Courses.slice();
        for (let i = Courses.length -1 ; i >= 0; i--) {
            for (let j = userCourses.length -1; j >= 0; j--) {
                if(Courses[i]['Course'] === userCourses[j]['Course']['Course']) {
                    compCourse.push(Courses[i]);
                    for (let k = coursesCopy.length - 1; k >= 0; k--) {
                        if (coursesCopy[k]['Course'] === Courses[i]['Course']) {
                            coursesCopy.splice(k, 1);
                        }
                    }
                    
                }
            }
        }
        this.setState({
            courses: coursesCopy,
            completedCourses: compCourse
        })
        this.props.progress();
        this.props.handleDrop();
    }

    render() {
        let userCourses = getCoursesFromSemesters(this.state.selectedPlan.semesters);
        let Courses = this.props.courses;
        let compCourse = [];
        let coursesCopy = Courses.slice();
        for (let i = Courses.length -1 ; i >= 0; i--) {
            for (let j = userCourses.length -1; j >= 0; j--) {
                if(Courses[i]['Course'] === userCourses[j]['Course']['Course']) {
                    compCourse.push(Courses[i]);
                    for (let k = coursesCopy.length - 1; k >= 0; k--) {
                        if (coursesCopy[k]['Course'] === Courses[i]['Course']) {
                            coursesCopy.splice(k, 1);
                        }
                    }
                    
                }
            }
        }
        return (
            <div>
                <Card>
                    <Card.Header onClick = {()=>this.toggleShowCourses()}>{this.props.name}</Card.Header>
                    <Collapse in={this.state.showCourses}>
                        <div>
                            {coursesCopy.map((course, index)=> (
                                    <CourseButton
                                    Course={course}
                                    courseNumber={course['Course']}
                                    courseTitle={course['Title']}
                                    courseUnits={course['Units']} 
                                    key = {course['Title']}
                                    handleDrop={() => this.checkCompletedCourses()}
                                    handleClick = {() => this.setSelectedCourse(course['Course'])}
                                    isSelected = {this.state.selectedCourse === course['Course']}
                                    courseDescription = {course['Desc']}
                                    overlapping = {this.props.overlapping(course, this.props.selectedPlan, this.props.requirementTitle, this.props.selectedCategory)}/>
                            ))}
                        </div>
                    </Collapse>
                </Card>
            </div>
        )
    }
}

export default DepartmentSubGroup;