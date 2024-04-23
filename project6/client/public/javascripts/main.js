try {

    faculty = true;

    var notes_btn = document.getElementById("open-notes");

    notes_btn.onclick = function(){
        var n = document.getElementById("notes");
        var f = document.getElementById("fac_notes");
        if (n.style.display === "none") {
            if (faculty) {
                f.style.display = "block";
            }
            n.style.display = "block";
            notes_btn.textContent = "Close Notes";
        } else {
            if (faculty) {
                f.style.display = "none";
            }
            n.style.display = "none";
            notes_btn.textContent = "Open Notes"
        }
    }


    if (typeof student_plan !== 'undefined') {
        throw new Error("Safe quit");
    } else {
        let student_plan = {};
    }

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

    let courses_planned = [];

    let catalog_courses = student_plan.catalog.courses;
    for (let course in courses){
        courses_planned.push(course);
        
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

    
    let listing; 
    let cell; 
    for (let year in years) {
        for (let term in years[year]) {
            let cell = document.createElement("div");
            
            cell.classList.add("cell");
            if (year < 2024) {
                cell.classList.add("history-cell");
            } else {
                cell.classList.add("active-cell");
            }

            cell.classList.add("droptarget");

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

                listing = document.createElement("div");
                if (year < 2024) {
                    listing.classList.add("course");
                } else {
                    listing.classList.add("course");
                    listing.classList.add("active-course");
                }
                
                let listing_designator = document.createElement("p");
                
                listing_designator.classList.add("designator");
                if (year < 2024) {
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
                
                listing.setAttribute('id', 'course1');
                listing.setAttribute("draggable", true);
                listing.classList.add("dragtarget");
                
                hours += course.credits;
            }));

            let cell_hours = document.createElement("p");
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
    
    let tableNode;
    let newTableCourse;
    let table_course;
    
    // DataTable 
    $("#catalog").DataTable( {
        
        data: catalog_array,
        'createdRow': function(row, data, dataIndex){
            
            row.setAttribute('draggable', true);
    
            row.addEventListener('dragstart', function(event){
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
        //url: 'https://localhost:7271/Planmajors/GetRequirements/1',
        success: function (data) {
            plan_reqs=JSON.parse(data)
        }
    });
    
    // plan_reqs = {};
    // plan_reqs.categories = {};
    // reqs = reqs.categories;
    // console.log(reqs);
    // for (c in reqs) {
    //     course = reqs[c]
    //     if (!plan_reqs.categories.hasOwnProperty(course.type)) {
    //         plan_reqs.categories[course.type] = {}
    //         plan_reqs.categories[course.type].courses = [];
    //     }
    //     plan_reqs.categories[course.type].courses.push(course.id);
    //     console.log(plan_reqs);
    // }

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
            console.log(course)
            course_id = document.createElement("div");

            course_id.classList.add("req");
            if (courses_planned.includes(course)) {
                course_id.classList.add("met-requirement");
            } else {
                course_id.classList.add("req_course");
            }
            
            courseTextNode = document.createTextNode(course + ": " + catalog_courses[course].name);
            course_id.appendChild(courseTextNode);

            course_id.setAttribute("draggable", true); // new 
            cat_div.append(course_id);
        });

        cat_accordion.append(cat_div);
    }

    $(requirements).accordion({
        active: 0,
        heightStyle: "fill"
    });
    
    
    //drag and drop 
    let dragged = null;
    let draggedInitial = null;
    
    const courseList = document.querySelectorAll(".course");
    const required = document.querySelectorAll(".req");
    
    courseList.forEach(function(course){
        course.addEventListener('dragstart', function(event){
            dragged = event.target;
        });
    });
    
    required.forEach(function(requirement){
        requirement.addEventListener('dragstart', function(event){
            draggedInitial = event.target;
            dragged = draggedInitial.cloneNode(true);
        });
    });
    
    const cells = document.querySelectorAll(".cell");
    
    cells.forEach(function(cell) {
    
        cell.addEventListener('dragover', function(event){
            if($(event.target).hasClass("droptarget")){
                event.preventDefault();
            }
            
        });
    
        cell.addEventListener('drop', function(event){      
    
            course_designator = "";
    
            if ($(dragged).hasClass('req') || $(dragged).hasClass('table_class')) {
    
                if ($(dragged).hasClass('req')) {
                    dragged.classList.remove("req");
                }
    
                if ($(dragged).hasClass('req_course')) {
                    dragged.classList.remove("req_course");
                }
    
                if ($(dragged).hasClass('met-requirement')) {
                    dragged.classList.remove("met-requirement");
                }
    
                let innerHTML = dragged.innerText;
                innerHTML = innerHTML.split(":");
    
                course_designator = innerHTML[0];
                course_name = innerHTML[1];
    
                listing = document.createElement("div");
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
                dragged = listing;
    
                dragged.addEventListener('dragstart', function (event) {
                    dragged = event.target;
                })
            }
            else {
                let semester_credit_line = dragged.parentNode.getElementsByClassName("credit-hours")[0];
                semester_credit_line = semester_credit_line.innerHTML.split(": ");
                let semester_hours = parseInt(semester_credit_line[1]);
    
                let newTitle = dragged.parentNode.firstChild.getElementsByClassName("credit-hours")[0];
    
                let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
                let newHours = catalog_courses[newCourseDesignator].credits;
                semester_hours -= newHours;
    
                newTitle.innerHTML = "Hours: " + semester_hours;
    
            }
            
            let semester_credit_line = event.target.getElementsByClassName("credit-hours")[0];
            semester_credit_line = semester_credit_line.innerHTML.split(": ");
            let semester_hours = parseInt(semester_credit_line[1]);
           
            let newTitle = event.target.firstChild.getElementsByClassName("credit-hours")[0];
            
            let newCourseDesignator = dragged.getElementsByClassName("designator")[0].innerHTML;
            let newHours = catalog_courses[newCourseDesignator].credits;
            semester_hours += newHours;
            
            newTitle.innerHTML = "Hours: " + semester_hours;
    
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
            
        });
    });
    
    const deleteCourse = document.getElementById("delete-course");
    deleteCourse.addEventListener('dragover', function(event){
        event.preventDefault();
    })
    
    deleteCourse.addEventListener('drop', function (event) {
    
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
    
        // Remove deleted course from met courses array
        courses_planned = courses_planned.filter(e => e !== course_designator);
    
        updateRequirements();
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
    
            if (courses_planned.includes(designator)) {
                req.classList.remove("req_course");
                req.classList.add("met-requirement");
            } else {
                req.classList.remove("met-requirement");
                req.classList.add("req_course");
            }
        });
    }

} catch (error) {

}
