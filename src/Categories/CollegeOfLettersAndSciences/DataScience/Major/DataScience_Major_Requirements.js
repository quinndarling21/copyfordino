    import courses from '../../../../result.json';
    
    const DataScience_Major_Requirements = [
    {
      "Division": "Lower Division",
      "Requirement": "Foundation of Data Science",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course": [courses["COMPSCI C8"]]
    },
    { 
      "Division": "Lower Division",
      "Requirement": "Calculus I",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course": [courses["MATH 1A"]]
    },
    {
      "Division": "Lower Division",
      "Requirement": "Calculus II",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course": [courses["MATH 1B"]]
    },
    {
      "Division": "Lower Division",
      "Requirement": "Linear Algebra",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course": [courses["MATH 54"], courses["STAT 89A"], [courses["EECS 16A"], courses["EECS 16B"]]]
    },
    {
      "Division": "Lower Division",
      "Requirement": "Program Structures",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course": [courses["COMPSCI 61A"], courses["COMPSCI 88"], courses["ENGIN 7"]]
    },
    {
      "Division": "Lower Division",
      "Requirement": "Data Structures",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course":[courses["COMPSCI 61B"]]
    },
    {
      "Division": "Upper Division",
      "Requirement": "Principles and Techniques of Data Science",
      "Number of Classes": 1,
      "Minimum Units": 4,
      "Course": [courses["COMPSCI C100"]]
    },
    {
      "Division": "Upper Division",
      "Requirement": "Computational and Inferential Depth",
      "Number of Classes": 2,
      "Minimum Units": 7,
      "Course":
      ['departmentsubgroup',
      [ 
      ['ASTRON', [courses["ASTRON 128"]]], 
      ['COMPSCI', [courses["COMPSCI 161"], courses["COMPSCI 162"], courses["COMPSCI 164"], courses["COMPSCI 168"], courses["COMPSCI 169"], courses["COMPSCI 170"], courses["COMPSCI 186"], courses["COMPSCI 188"]]],
      ['ECON', [courses['ECON 140'], courses["ECON 141"]]],
      ['EECS', [courses['EECS 127']]],
      ['EL ENG', [courses["EL ENG 120"], courses["EL ENG 123"], courses["EL ENG 129"]]],
      ['ESPM', [courses['ESPM 174']]],
      ['IND ENG', [courses['IND ENG 115'], courses['IND ENG 135'], courses['IND ENG 173']]],
      ['INFO', [courses["INFO 154"], courses["INFO 159"], courses["INFO 190"]]],
      ['NUC ENG', [courses["NUC ENG 175"]]],
      ['PHYSICS', [courses["PHYSICS 188"]]],
      ['STAT', [courses["STAT 135"], courses["STAT 150"], courses["STAT 151A"], courses["STAT 152"], courses["STAT 153"], courses["STAT 158"], courses["STAT 159"]]]
      ]]
    },
    {
      "Division": "Upper Division",
      "Requirement": "Probability",
      "Number of Classes": 1,
      "Minimum Units": 3,
      "Course": [courses["STAT 134"], courses['STAT 140'], courses["IND ENG 172"], courses["EL ENG 126"]]
    },
    {
      "Division": "Upper Division",
      "Requirement": "Modeling Learning and Decision-Making",
      "Number of Classes": 1,
      "Minimum Units": 3,
      "Course": [courses["COMPSCI 182"], courses["COMPSCI 189"], courses["IND ENG 142"], courses["STAT 102"], courses["STAT 154"]]
    },
    {
      "Division": "Upper Division",
      "Requirement": "Human Contexts and Ethics",
      "Number of Classes": 1,
      "Minimum Units": 3,
      "Course": [courses["AFRICAM C134"], courses["HISTORY C184D"], courses["INFO 188"], courses["ISF 100J"], courses["PHILOS 121"]]
    },
    {
      "Division": "Domain Emphasis",
      "Requirement": "Lower Division",
      "Number of Classes": 1,
      "Minimum Units": 3,
      "Course": [courses["MATH 53"]]
    },
    {
      "Division": "Domain Emphasis",
      "Requirement": "Upper Division",
      "Number of Classes": 2,
      "Minimum Units": 6,
      "Course": [courses["CIV ENG C133"], courses["EECS 127"], courses["ENGIN 150"], courses["IND ENG 160"], courses["IND ENG 162"], courses["MATH 110"], courses["MATH 113"], courses["MATH 118"], courses["MATH 128A"]]
    }
  ]

export default DataScience_Major_Requirements;