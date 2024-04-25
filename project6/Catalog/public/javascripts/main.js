let student_plan = {};

$.ajax({
    async: false,
    type: 'GET',
    url: 'javascripts/getCombined.txt',
    //url: 'http://judah.cedarville.edu/~knoerr/cs3220/termProject/getCombined.php',
    success: function(data){
        student_plan=JSON.parse(data);
    }
});

let years = {};

let total_hours = 0;

let courses = student_plan.plan.courses;

let catalog_courses = student_plan.catalog.courses;
for (let course in courses){
    
    let year = courses[course].year;
    let term = courses[course].term;
    
    let temp = {};

    temp.course_designator = courses[course].id;

    
    temp.course_name = catalog_courses[course].name;
    temp.credits = catalog_courses[course].credits;

    if (!years.hasOwnProperty(year)){
        years[year] = {}; 
    }

    if (!years[year].hasOwnProperty(term)){
        years[year][term] = [];
        if (term == "Spring"){
            years[year].Summer = [];
        }
    }
    years[year][term].push(temp);
    total_hours += temp.credits;
}

let cell_hours;
let listing; // new 
let cell; // new 
for (let year in years) {
    for (let term in years[year]) {
        let cell = document.createElement("div");
        
        cell.classList.add("cell");
        if (year < student_plan.plan.currYear) {
            cell.classList.add("history-cell");
        } else {
            cell.classList.add("active-cell");
        }

        cell.classList.add("droptarget"); // new

        let cell_year_term = document.createElement("p");
        cell_year_term.classList.add("semester");
        let textNode = document.createTextNode(term + " " + year);
        cell_year_term.appendChild(textNode);

        let title_div = document.createElement("div");
        title_div.classList.add("title");
        title_div.appendChild(cell_year_term);


        let hours = 0;
        
        years[year][term].forEach((function(course) {
            let course_designator = course.course_designator;
            let course_name = course.course_name;

            listing = document.createElement("div"); // new 
            if (year < student_plan.plan.currYear) {
                listing.classList.add("course");
            } else {
                listing.classList.add("course");
                listing.classList.add("active-course");
            }
            
            let listing_designator = document.createElement("p");
            
            listing_designator.classList.add("designator");
            if (year < student_plan.plan.currYear) {
                listing_designator.classList.add("history-designator");
            } else {
                listing_designator.classList.add("active-designator");
            }

            textNode = document.createTextNode(course_designator);
            listing_designator.appendChild(textNode);

            let listing_name = document.createElement("p");
            listing_name.classList.add("name");
            textNode = document.createTextNode(course_name);
            listing_name.appendChild(textNode);
            
            listing.appendChild(listing_designator);
            listing.appendChild(listing_name);
            cell.appendChild(listing);
            
            //new chunk
            listing.setAttribute('id', 'course1');
            listing.setAttribute("draggable", true);
            listing.classList.add("dragtarget");
            
            hours += course.credits;
        }));

        cell_hours = document.createElement("p");
        cell_hours.classList.add("credit-hours");
        textNode = document.createTextNode("Hours: " + hours);
        cell_hours.appendChild(textNode);

        title_div.appendChild(cell_hours);

        cell.insertBefore(title_div, cell.firstChild);

        let section2 = document.getElementById("section2");
        let bottom_strip = document.getElementById("bottom-strip");
        section2.insertBefore(cell, bottom_strip);
    }
}

$(document).ready(function(){
    $("#student").html("<strong>Student: </strong>" + student_plan.plan.student);
    $("#major").html("<strong>Major: </strong>" + student_plan.plan.major);
    $("#catalog_year").html("<strong>Catalog: </strong>" + student_plan.catalog.year);
    $("#minor").html("<strong>Minor: </strong>Bible");
    $("#total_hours").html("Total Hours: " + total_hours);
    $("#plan").html("<strong>Academic Plan: </strong>" + student_plan.plan.name);
});

let catalog_array = [];

for (let course in catalog_courses){
    catalog_array.push(catalog_courses[course]);
}

//new chunk
let tableNode;
let newTableCourse;
let table_course;

// DataTable new 
$("#catalog").DataTable( {
    
    data: catalog_array,
    'createdRow': function(row, data, dataIndex){
        
        row.setAttribute('draggable', true);

        row.addEventListener('dragstart', function(event){
            console.log("dragging");
            newTableCourse = data.id + ":" + data.name;
            tableNode = document.createTextNode(newTableCourse);
            table_course = document.createElement("div");
            table_course.classList.add("table_class");
            table_course.appendChild(tableNode);
            dragged = table_course;
        })
    },
    columns: [
        { data: "id", title: "ID"},
        { data: "name", title: "Name"},
        { data: "description", title: "Description"},
        { data: "credits", title: "Credits"}
        ]
});

// Accordion
let plan_reqs = {};

$.ajax({
    async: false,
    type: 'GET',
    url: 'javascripts/getRequirements.txt', 
    //url: 'http://judah.cedarville.edu/~knoerr/cs3220/termProject/getRequirements.php',
    success: function(data){
        plan_reqs=JSON.parse(data);
    }
});

let req_categories = plan_reqs.categories;

for (let category in req_categories){
    let category_designator = document.createElement("h3");
    category_designator.classList.add("category");
    textNode = document.createTextNode(category);
    category_designator.appendChild(textNode);

    let cat_accordion = document.getElementById("requirements");
    cat_accordion.append(category_designator);

    let req_courses = req_categories[category];

    let cat_div = document.createElement("div");
    req_courses.courses.forEach((course) => {
        course_id = document.createElement("div");
        course_id.classList.add("req_course");
        courseTextNode = document.createTextNode(course + ": " + catalog_courses[course].name);
        course_id.appendChild(courseTextNode);
        
        course_id.setAttribute("draggable", true); // new 
        cat_div.append(course_id);
    });

    cat_accordion.append(cat_div);
}


$( "#requirements" ).accordion({
    active: 0,
    heightStyle: "fill"
});






function modDefaults(enable_or_disable) {
    if (enable_or_disable == 1) {
        $('.default').each(function() {
            this.disabled = false;
        });
    } else {
        $('.default').each(function() {
            this.disabled = true;
        });
    }
}

//drag and drop new 
let dragged = null;
let draggedInitial = null;

const courseList = document.querySelectorAll(".course");
const required = document.querySelectorAll(".req_course");

courseList.forEach(function(course){
    course.addEventListener('dragstart', function(event){
        dragged = event.target;
    });
});

required.forEach(function(requirement){
    requirement.addEventListener('dragstart', function(event){
        draggedInitial = event.target;
        dragged = draggedInitial.cloneNode(true);
        //console.log(dragged);
        //console.log("dragging");
    });
});

const cells = document.querySelectorAll(".cell");

//new, simplified
cells.forEach(function(cell) {

    cell.addEventListener('dragover', function(event){
        if($(event.target).hasClass("droptarget")){
            event.preventDefault();
        }
        
    });

    cell.addEventListener('drop', drop);

});
/*
cells.forEach(function(cell) {

    cell.addEventListener('dragover', function(event){
        if($(event.target).hasClass("droptarget")){
            event.preventDefault();
        }
        
    });



    cell.addEventListener('drop', function(event){  
        //listing = "";
        //console.log((event.target).getElementsByClassName("credit-hours")[0]);
        

        if ($(dragged).hasClass('req_course') || $(dragged).hasClass('table_class')){
            //listing = "";
            //console.log(dragged);
            //dragged = "";
            if ($(dragged).hasClass('req_course')){
                dragged.classList.remove("req_course");
            }
            
            let innerHTML = dragged.innerText;
            innerHTML = innerHTML.split(":");

            course_designator = innerHTML[0];
            course_name = innerHTML[1];

            listing = document.createElement("div");
            //console.log(listing);
            listing.classList.add("course");

            listing_designator = document.createElement("p");

            listing_designator.classList.add("designator");
            textNode = document.createTextNode(course_designator);
            listing_designator.appendChild(textNode);

            listing_name = document.createElement("p");
            listing_name.classList.add("name");
            textNode = document.createTextNode(course_name);
            listing_name.appendChild(textNode);

            listing.appendChild(listing_designator);
            listing.appendChild(listing_name);

            listing.setAttribute('draggable', true);
            // new
            
            //console.log(dragged);
            dragged = listing;   
            dragged.addEventListener('dragstart', function(event){
                dragged = event.target;
            });         
        }

        //new else chunk
        else {
            
            let semester_credit_line = dragged.parentNode.getElementsByClassName("credit-hours")[0];
            semester_credit_line = semester_credit_line.innerHTML.split(": ");
            let semester_hours = parseInt(semester_credit_line[1]);

            let newTitle = dragged.parentNode.firstChild.getElementsByClassName("credit-hours")[0];
            
            let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
            let newHours = student_plan.catalog.courses[newCourseDesignator].credits;
            semester_hours -= newHours; 
            
            newTitle.innerHTML = "Hours: " + semester_hours;
        }
        //new chunk
        let semester_credit_line = event.target.getElementsByClassName("credit-hours")[0];
        semester_credit_line = semester_credit_line.innerHTML.split(": ");
        let semester_hours = parseInt(semester_credit_line[1]);

        let newTitle = event.target.firstChild.getElementsByClassName("credit-hours")[0];
        
        let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
        let newHours = student_plan.catalog.courses[newCourseDesignator].credits;
        semester_hours += newHours; 
        
        newTitle.innerHTML = "Hours: " + semester_hours;

        if ($(event.target).hasClass('active-cell')){
            dragged.classList.add("active-course");
            dragged.firstChild.classList.add("active-designator");
            dragged.firstChild.classList.remove("history-designator");
        }
        else {
            dragged.classList.remove("active-course");
            dragged.firstChild.classList.add("history-designator");
            dragged.firstChild.classList.remove("active-designator");
        }
        (event.target).appendChild(dragged);
        //dragged.parentNode.removeChild(dragged);
        //console.log("appended");
        
        //console.log(dragged.className);
        
        //dragged = "";
    });
});
*/
const deleteCourse = document.getElementById("delete-course");
deleteCourse.addEventListener('dragover', function(event){
    event.preventDefault();
})

deleteCourse.addEventListener('drop', function(event){
    let semester_credit_line = dragged.parentNode.getElementsByClassName("credit-hours")[0];
    semester_credit_line = semester_credit_line.innerHTML.split(": ");
    let semester_hours = parseInt(semester_credit_line[1]);

    let newTitle = dragged.parentNode.firstChild.getElementsByClassName("credit-hours")[0];

    let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
    let newHours = catalog_courses[newCourseDesignator].credits;
    semester_hours -= newHours;

    newTitle.innerHTML = "Hours: " + semester_hours;

    dragged.parentNode.removeChild(dragged);

    course_designator = dragged.getElementsByTagName("p")[0].innerHTML;
    console.log(course_designator);
    // Remove deleted course from met courses array
    courses_planned = courses_planned.filter(e => e !== course_designator);

    updateRequirements();
})

//new for delete year
let delete_year = document.getElementById("delete-year");
delete_year.addEventListener('click', function(event){
    //remove summer
    let courses = (section2.lastElementChild.previousElementSibling).previousElementSibling.querySelectorAll(".course");
 
    courses.forEach(function(course){
        let course_designator = course.getElementsByTagName("p")[0].innerHTML;
        // Remove deleted course from met courses array
        courses_planned = courses_planned.filter(e => e !== course_designator);
        
        console.log(course_designator);
        console.log(courses_planned);

        updateRequirements();
    })
    (section2.lastElementChild.previousElementSibling).previousElementSibling.remove();

    //remove spring
    courses = (section2.lastElementChild.previousElementSibling).previousElementSibling.querySelectorAll(".course");
 
    courses.forEach(function(course){
        let course_designator = course.getElementsByTagName("p")[0].innerHTML;
        // Remove deleted course from met courses array
        courses_planned = courses_planned.filter(e => e !== course_designator);
        
        console.log(course_designator);
        console.log(courses_planned);

        updateRequirements();
    })
    (section2.lastElementChild.previousElementSibling).previousElementSibling.remove();

    //remove fall
    courses = (section2.lastElementChild.previousElementSibling).previousElementSibling.querySelectorAll(".course");
 
    courses.forEach(function(course){
        let course_designator = course.getElementsByTagName("p")[0].innerHTML;
        // Remove deleted course from met courses array
        courses_planned = courses_planned.filter(e => e !== course_designator);
        
        console.log(course_designator);
        console.log(courses_planned);

        //it's changing the colors, but the courses_planned
        //now has undefined. Is this just updating when you
        //add it to the plan? and all it does when you 
        //delete is flip the colors?
        updateRequirements();
    })
    (section2.lastElementChild.previousElementSibling).previousElementSibling.remove();

})

function updateRequirements(course_designator) {
    if (!(courses_planned.includes(course_designator))) {
        courses_planned.push(course_designator);
    }

    accordion_courses = requirements.querySelectorAll("#requirements .req");

    accordion_courses.forEach(function(req){
        let innerHTML = req.innerText;
        innerHTML = innerHTML.split(":");

        designator = innerHTML[0];
        //console.log(designator);

        if (courses_planned.includes(designator)) {
            req.classList.remove("req_course");
            req.classList.add("met-requirement");
        } else {
            req.classList.remove("met-requirement");
            req.classList.add("req_course");
        }
    });
}

//new for add year
let add_button = document.getElementById("add-year");
add_button.addEventListener('click', function(event){
    let fallCell = document.createElement("div");
    let springCell = document.createElement("div");
    let summerCell = document.createElement("div");

    fallCell.classList.add("cell", "active-cell", "droptarget", "new-cell");
    springCell.classList.add("cell", "active-cell", "droptarget", "new-cell");
    summerCell.classList.add("cell", "active-cell", "droptarget", "new-cell");

    let fallCell_year_term = document.createElement("p");
    let springCell_year_term = document.createElement("p");
    let summerCell_year_term = document.createElement("p");

    fallCell_year_term.classList.add("semester");
    springCell_year_term.classList.add("semester");
    summerCell_year_term.classList.add("semester");

    let terms = document.getElementsByClassName("semester");
    let last_term = terms[terms.length - 1];

    let last_year;
    let new_year;
    if (last_term == null){
        //gets the first year in our years object
        last_year = Object.keys(years)[0]
    }
    else {
        last_year = parseInt(last_term.innerHTML.split(" ")[1]).toString();
    }
    
    new_year = (parseInt(last_year)+1).toString();
    let fallTextNode = document.createTextNode("Fall" + " " + last_year);
    let springTextNode = document.createTextNode("Spring" + " " + new_year);
    let summerTextNode = document.createTextNode("Summer" + " " + new_year);

    fallCell_year_term.appendChild(fallTextNode);
    springCell_year_term.appendChild(springTextNode);
    summerCell_year_term.appendChild(summerTextNode);

    let fallTitle_div = document.createElement("div");
    fallTitle_div.classList.add("title");
    fallTitle_div.appendChild(fallCell_year_term);

    let springTitle_div = document.createElement("div");
    springTitle_div.classList.add("title");
    springTitle_div.appendChild(springCell_year_term);

    let summerTitle_div = document.createElement("div");
    summerTitle_div.classList.add("title");
    summerTitle_div.appendChild(summerCell_year_term);

    let fallCell_hours = document.createElement("p");
    let springCell_hours = document.createElement("p");
    let summerCell_hours = document.createElement("p");
    fallCell_hours.classList.add("credit-hours");
    springCell_hours.classList.add("credit-hours");
    summerCell_hours.classList.add("credit-hours");

    fallTextNode = document.createTextNode("Hours: " + 0);
    springTextNode = document.createTextNode("Hours: " + 0);
    summerTextNode = document.createTextNode("Hours: " + 0);
    fallCell_hours.appendChild(fallTextNode);
    springCell_hours.appendChild(springTextNode);
    summerCell_hours.appendChild(summerTextNode);

    fallTitle_div.appendChild(fallCell_hours);
    springTitle_div.appendChild(springCell_hours);
    summerTitle_div.appendChild(summerCell_hours);

    fallCell.insertBefore(fallTitle_div, fallCell.firstChild);
    springCell.insertBefore(springTitle_div, springCell.firstChild);
    summerCell.insertBefore(summerTitle_div, summerCell.firstChild);

    let section2 = document.getElementById("section2");
    let bottom_strip = document.getElementById("bottom-strip");
    section2.insertBefore(fallCell, bottom_strip);
    section2.insertBefore(springCell, bottom_strip);
    section2.insertBefore(summerCell, bottom_strip);

    const cells = document.querySelectorAll(".new-cell");
    cells.forEach(function(cell) {

        cell.addEventListener('dragover', function(event){
            if($(event.target).hasClass("droptarget")){
                event.preventDefault();
            }
        });

        cell.addEventListener('drop', drop);
    });
});

//new, simplified
function drop(event){
    console.log(dragged);
    if ($(dragged).hasClass('req_course') || $(dragged).hasClass('table_class')){
        if ($(dragged).hasClass('req_course')){
            dragged.classList.remove("req_course");
        }
        
        let innerHTML = dragged.innerText;
        innerHTML = innerHTML.split(":");

        let course_designator = innerHTML[0];
        course_name = innerHTML[1];

        let listing = document.createElement("div");
        listing.classList.add("course");

        let listing_designator = document.createElement("p");

        listing_designator.classList.add("designator");
        let textNode = document.createTextNode(course_designator);
        listing_designator.appendChild(textNode);

        let listing_name = document.createElement("p");
        listing_name.classList.add("name");
        textNode = document.createTextNode(course_name);
        listing_name.appendChild(textNode);

        listing.appendChild(listing_designator);
        listing.appendChild(listing_name);

        listing.setAttribute('draggable', true);
        
        dragged = listing;   
        dragged.addEventListener('dragstart', function(event){
            dragged = event.target;
        });         
    }

    else {
        let semester_credit_line = dragged.parentNode.getElementsByClassName("credit-hours")[0];
        semester_credit_line = semester_credit_line.innerHTML.split(": ");
        let semester_hours = parseInt(semester_credit_line[1]);

        let newTitle = dragged.parentNode.firstChild.getElementsByClassName("credit-hours")[0];
        
        let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
        let newHours = student_plan.catalog.courses[newCourseDesignator].credits;
        semester_hours -= newHours; 
        
        newTitle.innerHTML = "Hours: " + semester_hours;
    }

    let semester_credit_line = event.target.getElementsByClassName("credit-hours")[0];
    semester_credit_line = semester_credit_line.innerHTML.split(": ");
    let semester_hours = parseInt(semester_credit_line[1]);

    let newTitle = event.target.firstChild.getElementsByClassName("credit-hours")[0];
    
    let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
    let newHours = student_plan.catalog.courses[newCourseDesignator].credits;
    semester_hours += newHours; 
    
    newTitle.innerHTML = "Hours: " + semester_hours;

    let course_designator;

    if ($(event.target).hasClass('active-cell')){
        dragged.classList.add("active-course");
        dragged.firstChild.classList.add("active-designator");
        dragged.firstChild.classList.remove("history-designator");
        
        course_designator = dragged.getElementsByTagName("p")[0].textContent;
    }
    else {
        dragged.classList.remove("active-course");
        dragged.firstChild.classList.add("history-designator");
        dragged.firstChild.classList.remove("active-designator");
        
        course_designator = dragged.getElementsByTagName("p")[0].textContent;
    }
    (event.target).appendChild(dragged);

    updateRequirements(course_designator);
}
