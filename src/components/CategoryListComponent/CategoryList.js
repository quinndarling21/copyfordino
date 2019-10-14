import React, {Component} from 'react';
import DivisionList from '../DivisionListComponent/DivisionList';
import user from '../../UserPlans/User';
import { Dropdown } from 'react-bootstrap';
import { ProgressBar } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

function getSum(total, num) {
    return total + Math.round(num);
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
 
class CategoryList extends Component {
    constructor(props) { 
        super(props);
        //the following categories are guaranteed for every user
        //need to add in university later 
        this.state = {
            selectedCategory: this.props.categories[0],
            selectedCatNum: 0,
            categories: this.props.categories,
            dataArray: this.props.data,
            show: false,
            selectedPlan: this.props.selectedPlan,
            progress: this.props.selectedPlan.totalProgress()

        };
        this.handleClick = this.handleClick.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.selectedPlan !== nextProps.selectedPlan || this.state.categories[this.state.selectedCatNum] !== nextProps.categories[this.state.selectedCatNum]) {
            this.setState({
                selectedCategory: nextProps.categories[0],
                selectedCatNum: 0
            })
        }
        this.setState({ 
            selectedPlan: nextProps.selectedPlan,
            progress: nextProps.selectedPlan['totalProgress'](),
            categories: nextProps.categories,
            dataArray: nextProps.data
            });  
      }
 
    handleClick(i) {
        //Called when a category is selected from the dropdown menu
        this.setState({
            selectedCategory: i,
            selectedCatNum: this.state.categories.indexOf(i),
            show: true
        })
    }

    updateProgressBar() {
        var temp = this.state.selectedPlan.totalProgress();
        this.setState({
            progress: temp,
        })
    }

    toggleDropdown() {
        this.setState({
            show: !this.state.show
        })
    }

    findCategoryProgress(category, num) {
        var numUnits = 0;
        var numCompletedUnits = 0;
        var requirements = this.state.dataArray[num][category]['Requirements']
            for (var i = 0; i < requirements.length; i++) {
                var completed = []
                for (let k = 0; k < this.state.selectedPlan.autoCompleted.length; k++) {
                    if(this.state.selectedPlan.autoCompleted[k][0] === category && this.state.selectedPlan.autoCompleted[k][1] === requirements[i]['Requirement']) {
                        completed.push('true')
                    }
                }
                if (completed.length===0) {
                    var numCompletedUnits = numCompletedUnits + this.findUnitsTakeninRequirement(requirements[i])}
                else {var numCompletedUnits = numCompletedUnits + requirements[i]['Minimum Units']}
                numUnits += requirements[i]['Minimum Units'];
            }
        return Math.floor((numCompletedUnits / numUnits) * 100);
    }

    findUnitsTakeninRequirement(requirement) {
        let userCourses = getCoursesFromSemesters(this.state.selectedPlan.semesters)
        let unitsTaken = 0;
        var courses = requirement['Course']
        if (courses[0] !== 'departmentsubgroup') {

            let singleCourses = [];
            let groups = [];
    
            for (let i = 0; i < courses.length; i++) {
                if (!isArray(courses[i])) {
                    singleCourses.push(courses[i])
                } else {
                    groups.push(courses[i])
                }
            }

        for (let i = 0; i < singleCourses.length; i++) {
            for (let j = 0; j < userCourses.length; j++) {
                if (singleCourses[i]['Course'] === userCourses[j]['Course']['Course']) {
                    unitsTaken += singleCourses[i]['Units'];
                }
            }
        }

        let groupUnits = [];
        for (let i = 0; i < groups.length; i++) {
            let curGroupUnits = [0,0]
            for (let j = 0; j < groups[i].length; j++) {
                for (let k = 0; k < userCourses.length; k++) {
                    if (userCourses[k]['Course']['Course'] === groups[i][j]['Course']) {
                        curGroupUnits.push(groups[i][j]['Units'])
                    }
                }
            }
            let total = curGroupUnits.reduce(getSum);
            groupUnits.push(total);
        }
    
        let maxGroupUnits = [0];
        for (let i = 0; i < groupUnits.length; i++) {
            if (groupUnits[i] > maxGroupUnits[maxGroupUnits.length -1]) {
                maxGroupUnits.push(groupUnits[i])
            }
        }
        if (maxGroupUnits[maxGroupUnits.length -1] > unitsTaken) {
            unitsTaken = maxGroupUnits[maxGroupUnits.length -1]
        }

        if (unitsTaken > requirement['Minimum Units']) {
            return requirement['Minimum Units']
        } else {
            return unitsTaken;
        }

        } else {
            var groups = courses[1];
            for (let i = 0; i < groups.length; i++) {
                for (let j = 0; j < groups[i][1].length; j++) {
                    for (let k = 0; k < userCourses.length; k++) {
                        if (groups[i][1][j]['Course'] === userCourses[k]['Course']['Course']) {
                            unitsTaken =+ groups[i][1][j]['Units']
                        }
                    }
                }
            }
            if (unitsTaken > requirement['Minimum Units']) {
                return requirement['Minimum Units']
            } else {
                return unitsTaken;
            }
        }
    }

    render() {
        return (
            <>
                <container className="TotalProgress">
                    <span className='totProg'>
                        PROGRESS:
                    </span>
                    <ProgressBar className = 'TotalProgressBar' now={this.props.progress} label = {`${this.props.progress}%`} />
                </container>
                <div className = 'Category'>
                    <Dropdown className="CategoryDropdown" onToggle = {() => this.toggleDropdown()}>
                        <Dropdown.Toggle className="CategoryToggle" id = 'DropdownToggle'>
                        {this.state.selectedCategory}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className = "DropdownMenu" alignRight = {true} style = {this.state.show? {} : {display: 'none'}}>
                        {this.state.categories.map((category, index) => {
                                if (category !== this.state.selectedCategory) {
                                    return <div key={index}>
                                                <Dropdown.Item onClick = {() => this.handleClick(category)}  key = {index}>
                                                    {category}
                                                </Dropdown.Item>
                                            </div>
                                }
                            })}
                        </Dropdown.Menu>
                        <span className = 'CategoryProgress'>
                            {this.findCategoryProgress(this.state.selectedCategory, this.state.selectedCatNum)}% Complete
                        </span>
                    </Dropdown>
                </div>
                {/* <div className="categoryProgress">
                   
                </div> */}
                <DivisionList 
                    shouldUpdate = {this.props.shouldUpdate}
                    onUpdate = {this.props.onUpdate}
                    key={this.state.selectedCategory}
                    parent={this.state.selectedCategory}
                    data={this.state.dataArray[this.state.selectedCatNum]}
                    progress= {() => this.updateProgressBar()}
                    selectedPlan ={this.state.selectedPlan}
                    planIndex = {this.props.planIndex}
                    selectedCategory = {this.state.selectedCategory}
                    selectedPlanNum = {this.props.selectedPlanNum}
                    renderSemesters = {this.props.renderSemesters}
                />
                <container className = 'LinkToAcademicGuide'>
                    <span style = {{color: 'white'}}>{'See '}</span>
                    <span className = 'LinkToAcademicGuide_Text' style = {{color: 'white'}}>
                        < a style = {{color: 'white'}} href = {this.state.dataArray[this.state.selectedCatNum][this.state.selectedCategory]['Link']} target = '_blank'>
                            Berkeley Academic Guide 
                        </a>
                    </span>
                    <span style = {{color: 'white'}}>
                        {' for official requirement information.'}
                    </span>
                </container>
            </>
        )
        }
    }

    export default CategoryList;