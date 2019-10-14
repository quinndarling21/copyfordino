// export default function callAPI(course_id) {
//     const fetch = require("node-fetch");

//     var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
//     targetUrl = 'https://berkeleytime.com/api/catalog_json/course_box/?course_id=' + course_id;
    
//     var request = new XMLHttpRequest()

// // Open a new connection, using the GET request on the URL endpoint
// request.open('GET', 'https://ghibliapi.herokuapp.com/films', true)

// request.onload = function() {
//   // Begin accessing JSON data here
// }
//     fetch(proxyUrl + targetUrl)
//         .then( (data) => {
//             debugger;
//             if(data.ok){
//                 return data.json()
//             }
//             throw new Error('Oops! Something went wrong.'); 
//         })
//         .then( courseBox => getCourseDescription(courseBox))
//         .catch( error => console.error('Error:', error))
    
//     temp = data['course']
//     desiredForm = {"course": {"Course": null, "Title": null, "Units": 1, "Terms": null, "Desc": null, "Pres": null}}
//     courseNum = temp['abbreviaion'] + ' ' + temp['course_number']
//     courseTitle = temp['title']
//     courseUnits = temp['units'] 
//     courseTerms = extractTerms(temp['requirements']);
//     courseDesc = temp['description'];
//     coursePres = temp['prerequisites'];
//     return {[courseNum]: {"Course": courseNum, "Title": courseTitle, "Units": courseUnits, "Terms": courseTerms, "Desc": courseDesc, "Pres": coursePres}}

// }

// function extractTerms(reqs) {
//     var terms = [];
//     for (var i = 0; i < reqs.length; i++) {
//         let curr = reqs[i];
//         if (curr.slice(0,4) == 'Fall' || curr.slice(0,5) == 'Spring' || curr.slice(0,6) == 'Summer') {
//             terms.push(curr);
//         }
//     }
//     return terms;
// }

// //const apiData = {
        
//    // url: 'https://berkeleytime.com/api/catalog_json/course_box/?course_id=',
//    // id: course_id,
// //}

// //const {url, id} = apiData

// //const apiUrl = `${url}${id}`