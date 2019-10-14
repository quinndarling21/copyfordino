import React, {Component} from 'react';
import Division from '../DivisionComponent/Division'; 
import Requirement from '../RequirementComponent/Requirement';
import {Accordion, Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import courses from '../../courses.json'
import CourseButton from '../CourseButtonComponent/CourseButton';
import CourseSearchTable from '../CourseSearchTableComponent/CourseSearchTable'
const allCourses = Object.keys(courses);

class DivisionList extends Component {
    //props are data (either user.majorData, user.collegeData etc.), clicked (boolean), onClick
    //renders a button. If there are multiple majors/minors/colleges, renders a button to click to next, renders list of divisions if clicked
    constructor(props) {
        super(props);
        const requirements = this.props.data[this.props.parent]['Requirements'];
        const divisions = [];
        for (let i = 0; i < requirements.length; i++) {
            divisions.push(requirements[i]['Division'])
        }
        var divs = Array.from(new Set(divisions));
        //this loop goes through the dictionary passed down from Category list and extracts the 
        //name(s) of the category e.g. ['Data Science', 'Economics']

        this.state = {
            //the index in names of the current chosen category
            selectedDivision: divisions[0],
            clicked: true,
            selectedPlan: this.props.selectedPlan,
            divOrSearch: "div"
        };
        this.findDivisions = this.findDivisions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.setSearch = this.setSearch.bind(this);
        this.showDivs = this.showDivs.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selectedPlan: nextProps.selectedPlan });  
      }

    findDivisions() {
        const requirements = this.props.data[this.props.parent]['Requirements'];
        const divisions = [];
        for (let i = 0; i < requirements.length; i++) {
            divisions.push(requirements[i]['Division'])
        }
        return Array.from(new Set(divisions));
    }

    //finds requirements in the specified division
    findRelevantDataforDivision(division) {

        const requirements = this.props.data[this.props.parent]['Requirements'];
        var filtered = requirements.filter(req => req.Division === division);
        return filtered;
    }
   
    handleClick(i) {
        var divs = this.findDivisions();
        const newDiv = divs[i]
        this.setState({
            selectedDivision: newDiv,
            clicked: true
        });
    }

    setSearch() {
        this.setState({
            divOrSearch: "search" 
        })
    }

    showDivs() {
        this.setState({
            divOrSearch: 'div'
        })
    }

    render() {
        var divisions = this.findDivisions();
        var requirementData = this.findRelevantDataforDivision(this.state.selectedDivision);
        if (this.state.divOrSearch === 'div') {
            return (
                <div>
                    <Navbar bg = "primary" variant = 'dark' className="DivisionList"
                    >
                        <Nav className="mr-auto">
                        {divisions.map((division, index) => {
                            return <Division
                            key={index}
                            name={division}
                            clicked={division === this.state.selectedDivision}
                            requirements={this.findRelevantDataforDivision(division)}
                            courseData={this.props.data[this.props.parent]['Requirement']}
                            onClick={() => this.handleClick(index)}
                            />
                        })}
                        </Nav>
                        <img onClick = {()=>this.setSearch()} className = 'SearchIcon' src={require("../../Images/searchWhite.png")} height="20" width="20"/>
                    </Navbar>
                    {this.state.clicked && 
                    <div className="RequirementTable">
                        <Accordion className="RequirementList">
                            {requirementData.map((requirement, index) => {
                                return <Requirement 
                                shouldUpdate = {this.props.shouldUpdate}
                                onUpdate = {this.props.onUpdate}
                                planIndex = {this.props.planIndex}
                                index={index.toString()}
                                key={requirement['Requirement']}
                                requirementTitle={requirement['Requirement']}
                                numClasses={requirement['Number of Classes']}
                                numUnits={requirement['Minimum Units']}
                                isClicked={false}
                                courseData={requirement['Course']}
                                progress={this.props.progress}
                                selectedPlan={this.state.selectedPlan}
                                division = {this.state.selectedDivision}
                                selectedCategory = {this.props.selectedCategory}
                                selectedPlanNum = {this.props.selectedPlanNum}
                                renderSemesters = {this.props.renderSemesters}
                                />
                            })}
                        </Accordion>
                    </div>
                }
                </div>
                
            )}
        else {
            return (
                <CourseSearchTable 
                showDivisions = {()=> this.showDivs()}
                selectedPlan = {this.state.selectedPlan}
                onUpdate = {this.props.onUpdate}
                progress={this.props.progress}
                shouldUpdate = {this.props.shouldUpdate}/>
            )
        }
    }
}

export default DivisionList;