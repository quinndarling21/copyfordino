import React, {Component} from 'react';
import CategoryList from '../CategoryListComponent/CategoryList'
import FourYearPlan from '../FourYearPlan/FourYearPlan'
import { plans, makePlan, deletePlan, editDegrees } from '../../UserPlans/User.js'
import { Card, Nav, Modal, Form, Col, Row, Button, FormLabel, Dropdown, DropdownButton,  ButtonGroup, NavbarBrand } from 'react-bootstrap'
import Select from 'react-select';
import Drawer from '@material-ui/core/Drawer';
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigation'
import { SSL_OP_MSIE_SSLV2_RSA_PADDING } from 'constants';
import { isUserWhitespacable, isExportDefaultSpecifier } from '@babel/types';
import { Tabs, Tab, Fab, IconButton, Tooltip } from '@material-ui/core';
import {withStyles, makeStyles, ThemeProvider} from '@material-ui/styles'
import {Typography} from '@material-ui/core/Typography'
import { createMuiTheme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import axios from 'axios';
import { saveAs } from 'file-saver';


function getListofYears() {
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var listofyears = [year - 4];
    for (let i = 1; i < 10; i++){
        listofyears.push((year - 4) + i)
    }
    return (listofyears)
}

function isEarlier(testDate, setDate) {
    const splitTest = testDate.split(" ")
    const splitSet = setDate.split(" ")
    let testYear = splitTest[1]
    let testTerm = splitTest[0]
    let setYear = splitSet[1]
    let setTerm = splitSet[0]
    if (testYear < setYear) {
        return true;
    }
    if (testYear > setYear) {
        return false;
    } else {
        if (testTerm === 'Spring') {
            return true;
        }
        if (testTerm === 'Fall') {
            return false;
        } else {
            if (setTerm === 'Fall') {
                return true;
            } else {
                return false;
            }
        }
    }
}

const majorOptions = [
    { value: ['College of Letters and Sciences', 'Data Science'], label: 'Data Science' },
    { value: ['College of Letters and Sciences', 'Mathematics'], label: 'Mathematics' },
    { value: ['College of Letters and Sciences', 'Computer Science'], label: 'Computer Science' },  
    { value: ['College of Engineering', 'Civil Engineering'], label: 'Civil Engineering' }      
  ]
const minorOptions = [
    { value: ['College of Letters and Sciences', 'Philosophy'], label: 'Philosophy' },      
    { value: ['College of Letters and Sciences', 'Linguistics'], label: 'Linguistics' },      
    { value: ['College of Letters and Sciences','Geosystems'], label: 'Geosystems' },
    { value: ['College of Letters and Sciences','Mathematics'], label: 'Mathematics' }     
  ]

class Planner extends Component {

    constructor() {
        super();
        this.state = {
            
            selectedPlan: 0,
            shouldUpdate: false,
            numPlans: plans.length,
            showModal: false,
            title: null,
            startTerm: "Fall",
            startYear: 2016,
            endTerm: "Fall",
            endYear: 2020,
            majors: majorOptions.filter(a => plans[0].majorNames.indexOf(a.label) !== -1),
            minors: minorOptions.filter(a => plans[0].minorNames.indexOf(a.label) !== -1),
            showAddSemester: false,
            selectedTerm: "Fall",
            selectedYear: getListofYears()[0],
            majorsLnS: ['Computer Science', 'Data Science', 'Mathematics'],
            majorsCoE: ['Environmental Engineering', 'Electical Engineering & Computer Science', 'Civil Engineering'],
            minorsLnS: ['Philosophy', 'Linguistics', 'Physics'],
            minorsCoE: ['Geosystems', 'Electronic Intelligent Systems', 'Structural Engineering'],
            // List of all majors at Cal
            colleges: ['College of Letters and Sciences', 'College of Engineering'],
            showDeletePlan: false,
            showEditDegrees: false,
            showMinorErrorModal: false,
            showMajorErrorModal: false,
            semestersShouldUpdate: false
        }
        this.startTermInput = React.createRef();
        this.startYearInput = React.createRef();
        this.endTermInput = React.createRef();
        this.endYearInput = React.createRef();
        this.majorInput = React.createRef();
        this.minorInput = React.createRef();
        this.titleInput = React.createRef();

        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.changePlan = this.changePlan.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateStartTerm = this.updateStartTerm.bind(this);
        this.updateStartYear = this.updateStartYear.bind(this);
        this.updateEndTerm = this.updateEndTerm.bind(this);
        this.updateEndYear = this.updateEndYear.bind(this);
        this.updateMajor = this.updateMajor.bind(this);
        this.updateMinor = this.updateMinor.bind(this);
        this.addPlan = this.addPlan.bind(this);
        this.showAddSemester = this.showAddSemester.bind(this);
        this.changeSelectedTerm = this.changeSelectedTerm.bind(this);
        this.changeSelectedYear = this.changeSelectedYear.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.deletePlan = this.deletePlan.bind(this);
        this.showDeletePlan = this.showDeletePlan.bind(this);
        this.hideDeletePlan = this.hideDeletePlan.bind(this);
        this.showEditDegrees = this.showEditDegrees.bind(this);
        this.updateDegrees = this.updateDegrees.bind(this);
        this.closeMinorErrorModal = this.closeMinorErrorModal.bind(this)
        this.closeMajorErrorModal = this.closeMajorErrorModal.bind(this)
        this.renderSemesters = this.renderSemesters.bind(this)
    }

    openDrawer(){
        this.setState({
            openDrawer: true
        })
    }
    closeDrawer(){
        this.setState({
            openDrawer: false
        })
    }

    format() {
        const startSem = this.state.startTerm + ' ' + this.state.startYear;
        const endSem = this.state.endTerm + ' ' + this.state.endYear
        const noMajor = []
        const enrollments = {'Colleges': {}};

        if(this.state.majors.length === 0) {
            return [0, 0, 0, 'majorError']
        }

        for (let i = 0; i < this.state.majors.length; i ++) {
            if (this.state.majors[i]['value'][0] in enrollments['Colleges']) {
                enrollments['Colleges'][this.state.majors[i]['value'][0]]['Majors'].push(this.state.majors[i]['value'][1])
            } else {
                enrollments['Colleges'][this.state.majors[i]['value'][0]] = {'Majors': [this.state.majors[i]['value'][1]], 'Minors': []}
            }
        }
        for (let j = 0; j < this.state.minors.length; j ++) {
            if (this.state.minors[j]['value'][0] in enrollments['Colleges']) {
                enrollments['Colleges'][this.state.minors[j]['value'][0]]['Minors'].push(this.state.minors[j]['value'][1])
            } else {
                noMajor.push(this.state.minors[j]['value'][1])
            }
        }

        if (noMajor.length > 0) {
            return [startSem, endSem, enrollments, 'minorError']
        }

        return [startSem, endSem, enrollments, 'none']
    }

    addPlan() {
        const inputs = this.format();
        if (inputs[3]==='none') {
            makePlan(inputs[0], inputs[1], inputs[2], this.state.title);
            this.setState({
                showModal: false,
                title: null,
                startTerm: "Fall",
                startYear: 2016,
                endTerm: "Fall",
                endYear: 2021,
                majors: majorOptions.filter(a => plans[plans.length - 1].majorNames.indexOf(a.label) !== -1),
                minors: minorOptions.filter(a => plans[plans.length - 1].minorNames.indexOf(a.label) !== -1),
                numPlans: plans.length
        })
        } 

        if (inputs[3]==='majorError') {
            this.setState({
                showMajorErrorModal: true,
                majors: majorOptions.filter(a => plans[this.state.selectedPlan].majorNames.indexOf(a.label) !== -1),
                minors: minorOptions.filter(a => plans[this.state.selectedPlan].minorNames.indexOf(a.label) !== -1),
            })
        }
        
        if (inputs[3]==='minorError') {
            makePlan(inputs[0], inputs[1], inputs[2], this.state.title)
            this.setState({
                showMinorErrorModal: true,
                title: null,
                startTerm: "Fall",
                startYear: 2016,
                endTerm: "Fall",
                endYear: 2021,
                majors: majorOptions.filter(a => plans[this.state.numPlans + 1].majorNames.indexOf(a.label) !== -1),
                minors: minorOptions.filter(a => plans[this.state.numPlans + 1].minorNames.indexOf(a.label) !== -1),
                numPlans: plans.length
                })
        }
    }

    closeMajorErrorModal() {
        this.setState({
            showMajorErrorModal: false
        })
    }

    closeMinorErrorModal() {
        this.setState({
            showMinorErrorModal: false
        })
    }

    showDeletePlan() {
        this.setState({
            showDeletePlan: true
        })
    }

    hideDeletePlan() {
        this.setState({
            showDeletePlan: false
        })
    }

    deletePlan() {
        deletePlan(this.state.selectedPlan)
        this.setState({
            numPlans: this.state.numPlans - 1,
            selectedPlan: 0,
            showDeletePlan: false
        })
        this.onUpdate();
    }
    
    updateTitle() {
        this.setState({title: this.titleInput.current.value})
    }
    updateStartTerm() {
        this.setState({startTerm: this.startTermInput.current.value})
    }

    updateStartYear() {
        this.setState({startYear: this.startYearInput.current.value})
    }

    updateEndTerm() {
        this.setState({endTerm: this.endTermInput.current.value})
    }

    updateEndYear() {
        this.setState({endYear: this.endYearInput.current.value})
    }

    updateMajor(option) {
        const majors = [];
        for(let i = 0; i < option.length; i++) {
            majors.push(option[i])
        }
        this.setState({majors: majors})
    }

    updateMinor(option) {
        const minors = [];
        for(let i = 0; i < option.length; i++) {
            minors.push(option[i])
        }
        this.setState({minors: minors})
    }

    updateDegrees() {
        const inputs = this.format();
        const enrollments = inputs[2]
        if (inputs[3]==='majorError') {
            this.setState({
                showMajorErrorModal: true
            })
        }
        
        if (inputs[3]==='minorError') {
            editDegrees(enrollments, this.state.selectedPlan)
            this.setState({
                showMinorErrorModal: true,
                title: null,
                startTerm: "Fall",
                startYear: 2016,
                endTerm: "Fall",
                endYear: 2021
                })
            }

        if (inputs[3]==='none') {
            editDegrees(enrollments, this.state.selectedPlan)
            this.setState({
                showEditDegrees: false
            })
        }
        this.onDelete()
    }
    
    toggleModal() {
        console.log("called");
        let bool = !this.state.showModal;
        this.setState({
            showModal: bool,
            majors: majorOptions.filter(a => plans[this.state.selectedPlan].majorNames.indexOf(a.label) !== -1),
            minors: minorOptions.filter(a => plans[this.state.selectedPlan].minorNames.indexOf(a.label) !== -1)
        })
        
    }
    onDelete() {
        // gets called when a course is deleted in a semester,
        // should update is then passed down to requirement so it knows to rerender the course that was deleted
        this.setState({
            shouldUpdate: true
        })
    }

    onUpdate() {
        // When course is rerendered, calls this method, changes shouldUpdate to false so it stops updating
        this.setState({
            shouldUpdate: false
        })
    }

    renderSemesters() {
        debugger;
        var change = !this.state.semestersShouldUpdate
        this.setState({
            semestersShouldUpdate: change
        })
    }

    changePlan(plan) {
        this.setState({
            selectedPlan: plan
        })
    }

    showAddSemester() {
        this.setState({
            showAddSemester: true
        })
    }

    changeSelectedTerm(event) {
        const term = event.target.value
        this.setState({
            selectedTerm: term
        })
    }

    changeSelectedYear(event) {
        const year = event.target.value
        this.setState({
            selectedYear: year
        })
    }

    addSemester(term, year) {
        if ((term === 'Term') || (year === 'Year')) {
            this.resetAddSemester();
            return;
        }
        const semDate = term + ' ' + year;
        const numSemesters = plans[this.state.selectedPlan].semesters.length
        for (let i = 0; i < numSemesters; i++) {
            if (plans[this.state.selectedPlan].semesters[i][0]===semDate) {
                this.resetAddSemester();
                return;
            }
            if (isEarlier(semDate, plans[this.state.selectedPlan].semesters[i][0])) {
                plans[this.state.selectedPlan].semesters.splice(i, 0, [semDate, []])
                break;
            }
        }
        if (numSemesters === plans[this.state.selectedPlan].semesters.length) {
            plans[this.state.selectedPlan].semesters.push([semDate, []])
        }

        this.resetAddSemester();
    }

    resetAddSemester() {
        this.setState({
            selectedTerm: 'Fall',
            selectedYear: getListofYears()[0],
            showAddSemester: false
        })
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    showEditDegrees(show) {
        this.setState({
            showEditDegrees: show
        })
    }

    createAndDownloadPdf = () => {
        axios.post('/create-pdf', this.state)
          .then(() => axios.get('fetch-pdf', { responseType: 'blob' }))
          .then((res) => {
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    
            saveAs(pdfBlob, 'newPdf.pdf');
          })
      }

    render() {
        return (
            <div className = "Planner">
                <div className = "CourseContainer">
                    <CategoryList 
                    //['College of Letters and Sciences', 'Data Science', 'Energy Engineering]
                    categories = {plans[this.state.selectedPlan].collegeNames.concat(plans[this.state.selectedPlan].majorNames, plans[this.state.selectedPlan].minorNames)}
                    //Concatenates all college, major, minor data
                    data = {plans[this.state.selectedPlan].collegeData.concat(plans[this.state.selectedPlan].majorData, plans[this.state.selectedPlan].minorData)}
                    onUpdate = {() => this.onUpdate()}
                    shouldUpdate = {this.state.shouldUpdate}
                    progress = {plans[this.state.selectedPlan]['totalProgress']()}
                    selectedPlan = {plans[this.state.selectedPlan]}
                    selectedPlanNum = {this.state.selectedPlan}
                    planIndex = {this.state.selectedPlan}
                    renderSemesters = {()=>this.renderSemesters()}/>
                </div>
                <Card className = 'PlanNav' bg = 'primary'>
                    <Card.Header className = 'PlanHeader'>
                        <span>
                            <ThemeProvider theme = {theme}>
                                <Tabs value = {this.state.selectedPlan}>
                                {plans.map((plan, index) => {
                                        return <Tab className = 'planTab' label = {plan['name']} onClick = {() => this.changePlan(index)} value={index}/>
                                    })}
                                </Tabs>
                            </ThemeProvider>
                        </span>
                        <span>
                            <ThemeProvider theme = {theme}>
                                <Fab variant = 'extended' size = 'large' onClick = {() => this.toggleModal()} className='addPlanButton'>
                                <img className = 'addPlanIcon' src={require("../../Images/plus.png")} height="20" width="20"/> 
                                <a className = 'AddPlanText'>New Plan</a>
                                </Fab>
                            </ThemeProvider>
                        </span>
                        {/* <span>
                        <Dropdown className="PlanDropdown">
                            <Dropdown.Toggle className="PlanToggle">
                                <NavbarBrand className = 'SelectedPlanHeader'>{plans[this.state.selectedPlan]['name']}</NavbarBrand>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className = "DropdownMenu" alignLeft = {true}>
                            {plans.map((plan, index) => {
                                    if (index !== this.state.selectedPlan) {
                                        return <div key={index}>
                                                    <Dropdown.Item onClick = {() => this.changePlan(index)}  key = {index}>
                                                        {plan['name']}
                                                    </Dropdown.Item>
                                                </div>
                                    }
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        </span> */}
                        {/* <Nav variant = 'tabs'>
                            {plans.map((plan, index) => 
                            <Nav.Item
                            className = 'PlanOptionItem'
                            style = {(this.state.selectedPlan === index)? {backgroundColor: '#5fa4ff'} : {}}
                            key = {plans[index].name}>
                                <Nav.Link
                                style = {(plans[this.state.selectedPlan.name] === plan.name)? {fontWeight: 500, color: 'white'} : {color: 'white'}}
                                className = 'PlanOption' 
                                onClick = {() => this.changePlan(index)}
                                key = {plans[index].name}>
                                {plans[index].name}
                                </Nav.Link>
                            </Nav.Item>
                            )}
                            <Nav.Item 
                            className = 'PlanOptionItem'>
                                <Nav.Link onClick = {() => this.toggleModal()}
                                className='AddPlanButton'>
                                    +
                                </Nav.Link>
                            </Nav.Item>
                        </Nav> */}
                    </Card.Header>
                    <Card.Body className = 'PlanCardBody'>
                        <FourYearPlan
                            semesters = {plans[this.state.selectedPlan].semesters} 
                            onDelete = {() => this.onDelete()}
                            selectedPlan = {plans[this.state.selectedPlan]}
                            planIndex = {this.state.selectedPlan}
                            semestersShouldUpdate = {this.state.semestersShouldUpdate}/>
                    </Card.Body>
                    <Card.Footer className = 'PlanFooter'>
                        <span className = 'PlanOptions'>
                            <Tooltip title = "Add Semester" TransitionComponent={Fade} TransitionProps={{ timeout: {enter: 600, exit: 100}}}>
                                <IconButton className = 'PlanOptionsButton' onClick = {()=>this.showAddSemester()}>
                                    <img src={require("../../Images/addSemester.png")} height="25" width="25"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title = "Edit Degrees" TransitionComponent={Fade} TransitionProps={{ timeout: {enter: 600, exit: 100}}}>
                                <IconButton className = 'PlanOptionsButton' onClick = {() => this.showEditDegrees(true)}>
                                    <img src={require("../../Images/editDegrees.png")} height="25" width="25"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title = 'Download Plan' TransitionComponent={Fade} TransitionProps={{ timeout: {enter: 600, exit: 100}}}>
                                <IconButton className = 'PlanOptionsButton' onClick = {this.createAndDownloadPdf}>
                                    <img src={require("../../Images/exportPlan.png")} height="25" width="25"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title = 'Delete Plan' TransitionComponent={Fade} TransitionProps={{ timeout: {enter: 600, exit: 100}}}>
                                <IconButton className = 'PlanOptionsButton' onClick = {()=>this.showDeletePlan()}>
                                    <img src={require("../../Images/deletePlan.png")} height="25" width="25"/>
                                </IconButton>
                            </Tooltip>
                        </span>
                        {/* <span>
                            <ThemeProvider theme = {theme}>
                                <Fab variant = 'extended' size = 'large' onClick = {() => this.toggleModal()} className='addSemesterButton'>
                                <img className = 'addPlanIcon' src={require("../../Images/plus.png")} height="20" width="20"/> 
                                <a className = 'AddPlanText'> Semester</a>
                                </Fab>
                            </ThemeProvider>
                        </span> */}
                        
                            {/* <Nav.Item as = {Button}
                            className = "addSemester" 
                            variant = {this.state.showAddSemester? 'light' : 'outline-light'}
                            onClick = {() => this.showAddSemester()}
                            >
                            Add Semester
                            </Nav.Item>
                                {this.state.showAddSemester && 
                                <>
                                <Nav.Item className = "selectTerm">
                                    <DropdownButton 
                                    title = {this.state.selectedTerm}
                                    variant = 'outline-light'
                                    drop = {'up'}
                                    >
                                        {["Fall", "Spring", "Summer"].filter(a => a !== this.state.selectedTerm).map((term, index) => 
                                        {return (
                                            <Dropdown.Item onClick = {() => this.changeSelectedTerm(term)}>{term}</Dropdown.Item>
                                        )})}
                                    </DropdownButton>
                                </Nav.Item>
                                <Nav.Item className = 'selectYear'>
                                    <DropdownButton 
                                    title = {this.state.selectedYear}
                                    variant = 'outline-light'
                                    drop = {'up'}
                                    >
                                        {getListofYears().filter(a => a !== this.state.selectedYear).map((year, index) => 
                                        {return (
                                            <Dropdown.Item onClick = {() => this.changeSelectedYear(year)}>{year}</Dropdown.Item>
                                        )})}
                                    </DropdownButton>
                                </Nav.Item>
                                <Nav.Item className = "confirmAddSemester">
                                    <ButtonGroup>
                                        <Button
                                        variant = 'outline-light'
                                        onClick = {()=>this.addSemester(this.state.selectedTerm, this.state.selectedYear)}>
                                        Add
                                        </Button>
                                        <Button
                                        variant = 'outline-light'
                                        onClick = {()=>this.resetAddSemester()}>
                                        Cancel
                                        </Button>
                                    </ButtonGroup>
                                </Nav.Item>
                                </>
                                }
                            <Nav.Item as = {Button}
                                className = "editDegrees" 
                                variant = 'outline-light'
                                >
                                Edit Degrees
                            </Nav.Item> */}

                        
                    </Card.Footer>
                </Card>

                {/* EDIT DEGREES MODAL */}
                <Modal show = {this.state.showEditDegrees} onHide = {() => this.showEditDegrees(false)}>
                    <Modal.Header>
                        <Modal.Title>Edit Degrees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit = {this.handleSubmit}>
                        <Form.Group controlId="editMajors">
                                <Form.Label>
                                    Majors
                                </Form.Label>
                                <Select
                                    defaultValue = {majorOptions.filter(a => plans[this.state.selectedPlan].majorNames.indexOf(a.label) !== -1)}
                                    isMulti
                                    name="intendedMinors"
                                    className="intendedMinors"
                                    options={majorOptions}
                                    placeHolder="Intended Major(s)" 
                                    onChange = {this.updateMajor}
                                    ref = {this.majorInput}
                                />
                        </Form.Group>
                        <Form.Group controlId="editMinors">
                                <Form.Label>
                                    Minors
                                </Form.Label>
                                <Select
                                    defaultValue = {minorOptions.filter(a => plans[this.state.selectedPlan].minorNames.indexOf(a.label) !== -1)}
                                    isMulti
                                    name="intendedMinors"
                                    className="intendedMinors"
                                    options={minorOptions}
                                    placeHolder="Intended Minor(s)" 
                                    onChange = {this.updateMinor}
                                    ref = {this.minorInput}   
                                />
                        </Form.Group>
                        <Button className="addButton" variant="primary" type="submit" onClick={() => this.updateDegrees()}>
                            Done
                        </Button>
                    </Form>
                    </Modal.Body>
                </Modal>

                {/* ADD NEW PLAN MODAL */}
                <Modal show={this.state.showModal} onHide = {this.toggleModal}>
                    <Modal.Header closeButton >
                        <Modal.Title>Add a plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit = {this.handleSubmit}>
                        <Form.Group controlId="planTitle">
                            <Form.Label>
                                Plan Title
                            </Form.Label>
                            <Form.Control type="text" placeHolder = "Enter name" onChange = {this.updateTitle} ref = {this.titleInput}/>
                        </Form.Group>
                        
                        <Form.Group controlId="selectFirstTerm">
                            <Form.Label>
                                Select first semester
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control as="select" placeHolder="Term" onChange = {()=>this.updateStartTerm(event)} ref={ this.startTermInput }>
                                        <option>Fall</option>
                                        <option>Spring</option>
                                        <option>Summer</option>
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" placeHolder="Year" onChange = {()=>this.updateStartYear(event)} ref={ this.startYearInput }>
                                        <option>2016</option>
                                        <option>2017</option>
                                        <option>2018</option>
                                        <option>2019</option>
                                        <option>2020</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="selectLastTerm">
                            <Form.Label>
                                Select last semester
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control as="select" placeHolder="Term" onChange = {this.updateEndTerm} ref={ this.endTermInput }>
                                        <option>Fall</option>
                                        <option>Spring</option>
                                        <option>Summer</option>
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" placeHolder="Year"
                                     onChange = {this.updateEndYear} ref={ this.endYearInput }>
                                        <option>2020</option>
                                        <option>2021</option>
                                        <option>2022</option>
                                        <option>2023</option>
                                        <option>2024</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="selectMajor">
                            <Form.Label>
                                Select a Major
                            </Form.Label>
                            <Select
                                defaultValue = {majorOptions.filter(a => plans[this.state.selectedPlan].majorNames.indexOf(a.label) !== -1)}
                                isMulti
                                name="intendedMinors"
                                className="intendedMinors"
                                options={majorOptions}
                                placeHolder="Intended Major(s)" 
                                onChange = {this.updateMajor}
                                ref = {this.majorInput}   
                            />
                        </Form.Group>
                        <Form.Group controlId="selectMinor">
                            <Form.Label>
                                Select a Minor
                            </Form.Label>
                            <Select
                                defaultValue = {minorOptions.filter(a => plans[this.state.selectedPlan].minorNames.indexOf(a.label) !== -1)}
                                isMulti
                                name="intendedMinors"
                                className="intendedMinors"
                                options={minorOptions}
                                placeHolder="Intended Minor(s)" 
                                onChange = {this.updateMinor}
                                ref = {this.minorInput}   
                            />
                        </Form.Group>
                        <Button className="addButton" variant="primary" type="submit" onClick={() => this.addPlan()}>
                            Add
                        </Button>
                    </Form>
                    </Modal.Body>
                </Modal>

                {/* MAJOR ERROR MODAL */}
                <Modal show = {this.state.showMajorErrorModal} onHide = {() => this.closeMajorErrorModal()}>
                    <Modal.Body>
                        You must have at least one major. 
                    </Modal.Body>
                </Modal>

                {/* MINOR ERROR MODAL */}
                <Modal show = {this.state.showMinorErrorModal} onHide = {() => this.closeMinorErrorModal()}>
                    <Modal.Body>
                        You cannot complete a minor without completing a major in the same college. 
                    </Modal.Body>
                </Modal>

                {/* ADD NEW SEMESTER MODAL */}
                <Modal show={this.state.showAddSemester} onHide = {()=>this.resetAddSemester()}>
                    <Modal.Header closeButton >
                        <Modal.Title>Add a Semester</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit = {this.handleSubmit}>
                        <Form.Group controlId="selectTerm">
                            <Row>
                                <Col>
                                    <Form.Control as="select" placeHolder="Term" onChange = {this.changeSelectedTerm} value = {this.state.selectedTerm}>
                                    {["Fall", "Spring", "Summer"].map((term, index) => 
                                        {return (
                                            <option value = {term}>{term}</option>
                                        )})}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" placeHolder="Year" onChange = {this.changeSelectedYear} value = {this.state.selectedYear}>
                                        {getListofYears().map((year, index) => 
                                        {return (
                                            <option value = {year}>{year}</option>
                                        )})}
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button className="addButton" variant="primary" type="submit" onClick={() => this.addSemester(this.state.selectedTerm, this.state.selectedYear)}>
                            Add
                        </Button>
                    </Form>
                    </Modal.Body>
                </Modal>

                {/* DELETE PLAN CONFIRMATION MODAL */}
                <Modal show = {this.state.showDeletePlan} onHide = {()=>this.hideDeletePlan()}>
                    {(this.state.numPlans > 1) && 
                    <Modal.Header>
                        <Modal.Title>
                            Delete '{plans[this.state.selectedPlan]['name']}'?
                        </Modal.Title>
                        <Button onClick = {()=>this.deletePlan()}>
                            Yes
                        </Button>
                        <Button onClick = {()=>this.hideDeletePlan()}> 
                            No
                        </Button>
                    </Modal.Header> }
                    {(this.state.numPlans <= 1) &&
                    <Modal.Header>
                        <Modal.Title>
                            You can't delete your only plan!
                        </Modal.Title>
                    </Modal.Header>}
                </Modal>
            </div>
        ) 
    }
}

const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiTabs: {
          indicator: {
              color: '#ffffff',
              backgroundColor: "#ffffff"
    },
    }, MuiFab: {
        extended:{
            width: '130px',
            padding: '0px',
            height: '95%'
        }
    }
  }});

export default Planner;

{/* <Form.Group controlId="formFirstName">
                        <Form.Row>
                            <Col>
                            <Form.Control
                                type="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value="Dino"
                                onChange={handleChange('firstName')}
                                />              
                            </Col>
                            <Col>
                            <Form.Control
                                type="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                value="Ambrosi"
                                onChange={handleChange('lastName')}
                            />
                            </Col>
                        </Form.Row>
                        </Form.Group>
                        <Form.Group controlId="formEmailAddress">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value="dino.ambrosi@berkeley.edu"
                            onChange={handleChange('email')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value="dinguspingus"
                            onChange={handleChange('password')}
                        />
                        </Form.Group>
                        <Form.Group>
                        <Form.Row>
                            <Col>
                            <Form.Control
                                as="select"
                                type="firstYear"
                                name="firstYear"
                                placeholder="First Year"
                                value='2017'
                                onChange={handleChange('firstYear')}
                                >
                                <option>First Year</option>
                                <option>2015</option>
                                <option>2016</option>
                                <option>2017</option>
                                <option>2018</option>
                                <option>2019</option>
                            </Form.Control>
                            </Col>
                            <Col>
                            <Form.Check
                                checked={values.firstSemester === 'Fall'}
                                onChange={handleChange('firstSemester')}
                                inline
                                type="radio"
                                name="firstSemester"
                                label="Fall"
                                value="Fall" />
                            <Form.Check
                                checked={values.firstSemester === 'Spring'}
                                onChange={handleChange('firstSemester')}
                                inline
                                type="radio"
                                label="Spring"
                                name="firstSemester"
                                value="Spring" />
                            </Col>
                        </Form.Row>
                        </Form.Group>
                        <Form.Group>
                        <Form.Row>
                            <Col>
                            <Form.Control
                                as="select"
                                type="lastYear"
                                name="lastYear"
                                placeholder="Last Year"
                                value={values.lastYear}
                                onChange={handleChange('lastYear')}
                            >
                                <option>Last Year</option>
                                <option>2019</option>
                                <option>2020</option>
                                <option>2021</option>
                                <option>2022</option>
                                <option>2023</option>
                            </Form.Control>
                            </Col>
                            <Col>
                            <Form.Check
                                checked={values.lastSemester === 'Fall'}
                                onChange={handleChange('lastSemester')}
                                inline
                                type="radio"
                                name="lastSemester"
                                label="Fall"
                                value="Fall" />
                            <Form.Check
                                checked={values.lastSemester === 'Spring'}
                                onChange={handleChange('lastSemester')}
                                inline
                                type="radio"
                                label="Spring"
                                name="lastSemester"
                                value="Spring" />
                            </Col>
                        </Form.Row>
                        </Form.Group>
                        <Form.Group>
                        <Select
                            isMulti
                            name="intendedMajors"
                            className="intendedMajors"
                            options={majorOptions}
                            placeholder="Intended Major(s)"
                            onChange={(e) => (handleMajorChange(e))}
                        />
                        </Form.Group>
                        <Form.Group>
                        <Select
                            isMulti
                            name="intendedMinors"
                            className="intendedMinors"
                            options={minorOptions}
                            placeholder="Intended Minor(s)"
                            onChange={(e) => (handleMinorChange(e))}
                        />
                        </Form.Group>
                        <Button variant="primary" onClick={this.back}>
                        Back
                        </Button>
                        <Button variant="primary" onClick={this.next}>
                        Next
                        </Button> */}