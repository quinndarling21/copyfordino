
import DataScience_Major_Requirements from './Categories/CollegeOfLettersAndSciences/DataScience/Major/DataScience_Major_Requirements.js';
import EnergyEngineering_Minor_Courses from './Categories/CollegeOfEngineering/EnergyEngineering/Minor/EnergyEngineering_Minor_Courses.js';
import EnergyEngineering_Minor_Requirements from './Categories/CollegeOfEngineering/EnergyEngineering/Minor/EnergyEngineering_Minor_Requirements';
import Mathematics_Minor_Requirements from './Categories/CollegeOfLettersAndSciences/Mathematics/Minor/Mathematics_Minor_Requirements';
import Letters_And_Sciences_Requirements from './Categories/CollegeOfLettersAndSciences/CollegeRequirements/L&SRequirements.js'
import University_Courses from './Categories/University/universityCourses'
import University_Requirements from './Categories/University/universityRequirements.json'

const Catalog =  {'Colleges': {
                        "College of Letters and Sciences": 
                            {
                            "College Requirements": {
                                "Requirements": Letters_And_Sciences_Requirements,
                                "Link": 'http://guide.berkeley.edu/undergraduate/colleges-schools/letters-science/#collegerequirementstext'
                            }, 
                            "Majors": {
                                "Data Science": {
                                    "Requirements": DataScience_Major_Requirements,
                                    "Link": 'http://guide.berkeley.edu/undergraduate/degree-programs/data-science/#majorrequirementstext'
                                }
                            }, 
                            "Minors": {
                                "Mathematics": {
                                    "Requirements": Mathematics_Minor_Requirements,
                                    "Link": 'http://guide.berkeley.edu/undergraduate/degree-programs/mathematics/#minorrequirementstext'
                                }
                            }
                        },
                        "College of Engineering": 
                            {
                            "College Requirements": {
                                "Requirements": DataScience_Major_Requirements,
                                "Link": 'http://guide.berkeley.edu/undergraduate/degree-programs/data-science/#majorrequirementstext'
                            },
                            "Minors": {
                                "Energy Engineering": {
                                    "Requirements": DataScience_Major_Requirements,
                                    "Link": 'http://guide.berkeley.edu/undergraduate/degree-programs/data-science/#majorrequirementstext'
                                }
                            },
                            "Majors": {
                                "Energy Engineering": {
                                    "Requirements": DataScience_Major_Requirements,
                                    "Link": 'http://guide.berkeley.edu/undergraduate/degree-programs/data-science/#majorrequirementstext'
                                }
                            }
                        }

                    }}

export default Catalog;