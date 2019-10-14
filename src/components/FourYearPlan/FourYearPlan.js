import React, { Component } from 'react';
import Semester from '../Semester/Semester';
import { Navbar, Nav } from 'react-bootstrap'
import user from '../../UserPlans/User';
import { thisExpression } from '@babel/types';


//makes a list of semester dates such as fall 2017 based on start and end
function generateDates(start, end) {
    let listDates = [start];
    const splitStart = start.split(" ");
    let currSeason =  splitStart[0];
    let currYear = parseInt(splitStart[1], 10);
    const splitEnd = end.split(" ");
    const endSeason = splitEnd[0];
    const endYear = parseInt(splitEnd[1], 10);
    var i = 0;
    while (i < 20) {
        if (currSeason === (endSeason) && currYear === endYear) {
            break; 
        }
        if (currSeason === 'Spring') {
            currSeason = 'Fall';
        } else {
            currSeason = 'Spring';
            currYear++;
        }
        listDates.push(currSeason + ' ' + currYear.toString());
        i++;
    }
    return listDates
}

class FourYearPlan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // semDates: this.props.semDates,
            semesters: this.props.semesters,
            selectedPlan: this.props.selectedPlan,
            semestersShouldUpdate: this.props.semestersShouldUpdate
        }
        this.removeSemester = this.removeSemester.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ semesters: nextProps.semesters,
                        selectedPlan: nextProps.selectedPlan });  
      } 
      

    removeSemester(date) {
        const semCopy = this.state.semesters.slice()
        for(let i = 0; i < this.state.semesters.length; i++) {
            if (this.state.semesters[i][0]===date) {
                semCopy.splice(i, 1)
            }
        }
        this.state.selectedPlan.semesters = semCopy;
        this.setState({
            semesters: semCopy
        })
        this.props.onDelete();
    }
        
        render() {
            return (
                <div className = "FourYearPlan">
                    <div className = "SemesterContainer">
                        {this.state.semesters.map((semester, index)=>
                        {return <Semester 
                                onDelete = {this.props.onDelete} 
                                planIndex = {this.props.planIndex}
                                removeSemester = {() => this.removeSemester(semester[0])} 
                                key = {semester} 
                                date = {semester[0]}
                                courses = {semester[1]}
                                semNum = {index}
                                selectedPlan = {this.props.selectedPlan}
                                selectedPlanNum = {this.props.planIndex}/>
                        })}
                    </div>
                </div>
            )
        }
}

export default FourYearPlan;