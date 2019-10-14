import catalog from '../CATALOG'; 
import { bool } from 'prop-types';

export var plans = [];

const initialEnrollments = {'Colleges': 
                                {
                                'College of Letters and Sciences': 
                                    {
                                    'Majors': ['Data Science'],
                                    'Minors': ['Mathematics']
                                    }}}


makePlan('Fall 2017', 'Spring 2021', initialEnrollments, 'Current Track');

export function makePlan(startSem, endSem, enrollments, name) {
    const plan = {'semesters': null, 'collegeNames': null, 'majorNames': null, 'minorNames': null,
                  'majorData': null, 'minorData': null, 'collegeData': null, 'totalProgress': null,'dates': null, 'name': name, 'autoCompleted': null};

    plan.collegeNames = Object.keys(enrollments['Colleges'])
    plan.majorNames = findMajorNames(enrollments); 
    plan.minorNames = findMinorNames(enrollments);

    plan.majorData = findMajorData(enrollments);
    plan.minorData = findMinorData(enrollments);
    plan.collegeData = findCollegeData(enrollments);
    plan.autoCompleted = [];

    plan.semesters = generateDates(startSem, endSem)

    // plan.semesters = Array(generateLength(startSem, endSem)).fill([]);
    
     var totalProg = function() {
        var categories = plan.collegeData.concat(plan.majorData, plan.minorData);
        var catNames = plan.collegeNames.concat(plan.majorNames, plan.minorNames);
        var numUnits = 0;
        var numCompletedUnits = 0;
        for (var i = 0; i < catNames.length; i++) {
            var currReq = categories[i][catNames[i]]['Requirements']
            for (var j = 0; j < currReq.length; j++) {
                var completed = []
                for (let k = 0; k < plan.autoCompleted.length; k++) {
                    if(plan.autoCompleted[k][0] === catNames[i] && plan.autoCompleted[k][1] === currReq[j]['Requirement']) {
                        completed.push('true')
                    }
                }
                if (completed.length===0) {
                    var numCompletedUnits = numCompletedUnits + findUnitsTakeninRequirement(plan.semesters, currReq[j])}
                else {var numCompletedUnits = numCompletedUnits + currReq[j]['Minimum Units']}
                numUnits += currReq[j]['Minimum Units'];
            }
        }
    
    return Math.floor((numCompletedUnits / numUnits) * 100);
    }

    plan['totalProgress'] = totalProg;
    plans.push(plan);

}

export function deletePlan(i) {
    plans.splice(i, 1)
}

export function editDegrees(enrollments, i) {
    plans[i].collegeNames = Object.keys(enrollments['Colleges'])
    plans[i].majorNames = findMajorNames(enrollments); 
    plans[i].minorNames = findMinorNames(enrollments);

    plans[i].majorData = findMajorData(enrollments);
    plans[i].minorData = findMinorData(enrollments);
    plans[i].collegeData = findCollegeData(enrollments);
}

export function addAutocomplete(reqPath, i) {
    plans[i]['autoCompleted'].push(reqPath)
}

export function removeAutocomplete(reqPath, i) {
    plans[i].autoCompleted.splice(plans[i].autoCompleted.indexOf(reqPath), 1)
}

export function addCustomCourse(course, sem, plan) {
    plans[plan]['semesters'][sem][1].push(course)
}

export function removeCustomCourse(course, plan) {
    debugger;
    for (let i = 0; i < plans[plan]['autoCompleted'].length; i++) {
        if (plans[plan]['autoCompleted'][i][3] === course) {
            plans[plan].autoCompleted.splice(i, 1)
            return
        }
    }
}


function findMajorData(enrollments) {
    /* Goes through every college, finds the js/json files that contain information about every major in each college*/
    /* return data in the form [{'Data Science': {
                                    'Requirements': 
                                        [{
                                        'Division': ...,
                                        'Requirement': ...,
                                        "Number of Classes": ...,
                                        "Minimum Units": ...,
                                        "Course": [courses[...], ...]
                                        }]
                                    }}]*/
    var userMajors = [];
    var collegeNames = Object.keys(enrollments['Colleges']);
    for (let i = 0; i < collegeNames.length; i++) {
        for (let j = 0; j < enrollments['Colleges'][collegeNames[i]]['Majors'].length; j++) {
            let currMajor = enrollments['Colleges'][collegeNames[i]]['Majors'][j];
            let catalogDict = catalog['Colleges'][collegeNames[i]]['Majors'][currMajor];
            let dict = {[currMajor]: catalogDict}
            userMajors.push(dict);
        }
    }
    return userMajors;
}

function findMajorNames(enrollments) {
    var userMajors = [];
    var collegeNames = Object.keys(enrollments['Colleges']);
    for (let i = 0; i < collegeNames.length; i++) {
        for (let j = 0; j < enrollments['Colleges'][collegeNames[i]]['Majors'].length; j++) {
            let currMajor = enrollments['Colleges'][collegeNames[i]]['Majors'][j];
            userMajors.push(currMajor);
        }
    }
    return userMajors;
}

function findCollegeData(enrollments) {
    var userColleges = [];
    var collegeNames = Object.keys(enrollments['Colleges']);
    for (let i = 0; i < collegeNames.length; i++) {
        let currCollege = collegeNames[i];
        let catalogDict = catalog['Colleges'][currCollege]['College Requirements'];
        let dict = {[currCollege]: catalogDict}
        userColleges.push(dict);
    }
    return userColleges;
}

function findMinorData(enrollments) {
    var userMinors = [];
    var collegeNames = Object.keys(enrollments['Colleges']);
    for (let i = 0; i < collegeNames.length; i++) {
        for (let j = 0; j < enrollments['Colleges'][collegeNames[i]]['Minors'].length; j++) {
            let currMinor = enrollments['Colleges'][collegeNames[i]]['Minors'][j];
            let catalogDict = catalog['Colleges'][collegeNames[i]]['Minors'][currMinor];
            let dict = {[currMinor]: catalogDict}
            userMinors.push(dict);
        }
    }
    return userMinors;
}

function findMinorNames(enrollments) {
    var userMinors = [];
    var collegeNames = Object.keys(enrollments['Colleges']);
    for (let i = 0; i < collegeNames.length; i++) {
        for (let j = 0; j < enrollments['Colleges'][collegeNames[i]]['Minors'].length; j++) {
            let currMinor = enrollments['Colleges'][collegeNames[i]]['Minors'][j];
            userMinors.push(currMinor);
        }
    }
    return userMinors;
}

function findUnitsTakeninRequirement(semesters, requirement) {
    let userCourses = getCoursesFromSemesters(semesters);
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

function generateLength(start, end) {
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
    return listDates.length
}

function getSum(total, num) {
    return total + Math.round(num);
}

function generateDates(start, end) {
    let listDates = [[start, []]];
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
        listDates.push([currSeason + ' ' + currYear.toString(), []]);
        i++;
    }
    return listDates
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