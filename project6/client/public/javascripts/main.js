try {
    if (typeof student_plan !== 'undefined') {
        throw new Error("Safe quit");
    } else {
        let student_plan = {};
    }

    function readCookie(name) {
        try {
            let content = "; " + document.cookie;
            let cookies = content.split(`; ${name}=`);
            if (cookies.length === 2){
                return cookies.pop().split(';')[0];
            }
        }
        catch {
            return null;
        }
      }

    if (readCookie("userid") == null) {
        location.assign('http://localhost:5173/');
    }

    var modal = document.getElementById("myModal");
    var btn = document.getElementById("plans");
    var span = document.getElementById("close");
    var modal_content = document.getElementsByClassName("modal-content")[0];
    var plan_form = document.getElementById("plan-form");

    roleId = parseInt(readCookie("roleid")) 
    if (roleId == 3) {
        faculty = false;
    }
    else {
        faculty = true;
    }


    userId = parseInt(readCookie("userid"));
    if (!faculty) {
        studentId = parseInt(readCookie("userid"));
    }
    else {
        studentId = parseInt(readCookie("studentid"));
    }
    console.log(studentId);

    // notes code
    var notes_btn = document.getElementById("open-notes");

    student_note = null;
    faculty_note = null;

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getNotes?id=' + studentId + '&oid=' + studentId,
        success: function(data){
            data = data.split("<td>")[1];
            data = data.split("</td>")[0]; 
            student_note = data;
        }
    });

    if (faculty){
        $.ajax({
            async: false,
            type: 'GET',
            url: 'http://localhost:3000/getNotes?id=' + studentId + '&oid=' + userId,
            success: function(data){
                data = data.split("<td>")[1];
                data = data.split("</td>")[0];
                faculty_note = data;
            }
        });
    }

    var notes_btn = document.getElementById("open-notes");

    $('#s_notes').val(student_note);
    $('#f_notes').val(faculty_note);


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

    //get plan ids
    plan_ids   = [];
    plan_names = [];

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getPlanIds?id=' + studentId,
        success: function(data){
            data = data.split("<td>");
            length = (data.length-1)/2;
            for (let i = 0; i < length; i++){
                plan_ids.push(data[2*i+1].split("</td>")[0]);
                plan_names.push(data[2*i+2].split("</td>")[0]);
            }
        }
    });

    for (let i = 0; i < plan_ids.length; i++) {
        let button = document.createElement('p');
        button.innerText = plan_names[i];
        button.id = plan_ids[i];
        button.classList.add("plan_button");
        button.onclick = function() {
            cookiestring = "planid=" + button.id;
            document.cookie = cookiestring; 
            location.reload();
        }
        modal_content.appendChild(button);
    }

    btn.onmousedown = function() {
        modal.style.display = "block";
    }

    
    span.onclick = function() {
        modal.style.display = "none";
    }

    // let student_plan = {};

    // FIXME TODO dynamic
    //if (localStorage.getItem("planId") == null){
    if(readCookie("planid") == null) {
        planId = plan_ids[0];
        cookiestring = "planid=" + planId;
        document.cookie = cookiestring; 
    }
    else {
        planId = readCookie("planid");
    }

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getCombined?planid=' + planId + '&userid=' + studentId,
        success: function(data){
            data = data.replace(/&quot;/g, '"');
            data = data.replace(/&amp;/g, '&');
            data = data.replace(/\n/g, '');
            student_plan=JSON.parse(data);
        }
    });

    let years = {};

    let total_hours = 0;

    let courses = student_plan.plan.courses;

    let courses_planned = [];
    let add = [];
    let del = [];
    let startTerm = "";
    let startYear = "";
    let startCourse = "";

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
    
    //FIXME TODO dynamic
    planId = 3;

    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://localhost:3000/getRequirements?planid=' + planId,
        success: function (data) {
            data = data.replace(/&quot;/g, '"');
            data = data.replace(/\n/g, '');
            plan_reqs=JSON.parse(data)
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

            course_id.classList.add("req");
            if (courses_planned.includes(course)) {
                course_id.classList.add("met-requirement");
            } else {
                course_id.classList.add("req_course");
            }
            
            courseTextNode = document.createTextNode(course + ": " + catalog_courses[course].name);
            course_id.appendChild(courseTextNode);

            course_id.setAttribute("draggable", true); 
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
            
            let semester = dragged.parentNode.getElementsByClassName("semester")[0];

            // hold for save plan
            startYear = semester.innerHTML.split(" ")[1];
            startTerm = semester.innerHTML.split(" ")[0];
            startCourse = dragged.getElementsByTagName("p")[0].textContent;
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

        cell.addEventListener('drop', drop);

    });

    const deleteCourse = document.getElementById("delete-course");
    deleteCourse.addEventListener('dragover', function(event){
        event.preventDefault();
    })
    
    deleteCourse.addEventListener('drop', function (event) {
    
        let semester_credit_line = dragged.parentNode.getElementsByClassName("credit-hours")[0];
        let semester = dragged.parentNode.getElementsByClassName("semester")[0];
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
        updateTotalHours(); //new

        // save plan
        year = semester.innerHTML.split(" ")[1];
        term = semester.innerHTML.split(" ")[0];
        planSaveTracker(localStorage.getItem("planId"), year, term, course_designator, "del");
    })
    
    let delete_year = document.getElementById("delete-year");
    delete_year.addEventListener('click', function(event){
        //remove summer
        let courses = section2.lastElementChild.previousElementSibling.previousElementSibling.querySelectorAll(".course");
    
        courses.forEach(function(course){
            let course_designator = course.getElementsByTagName("p")[0].innerHTML;
            let semester = course.parentNode.getElementsByClassName("semester")[0];
            // Remove deleted course from met courses array
            courses_planned = courses_planned.filter(e => e !== course_designator);

            console.log(course_designator); 
            console.log(courses_planned);

            updateRequirements();

            // save plan
            year = semester.innerHTML.split(" ")[1];
            term = semester.innerHTML.split(" ")[0];
            planSaveTracker(localStorage.getItem("planId"), year, term, course_designator, "del");
        })
        section2.lastElementChild.previousElementSibling.previousElementSibling.remove();

        //remove spring
        courses = section2.lastElementChild.previousElementSibling.previousElementSibling.querySelectorAll(".course");
    
        courses.forEach(function(course){
            let course_designator = course.getElementsByTagName("p")[0].innerHTML;
            let semester = course.parentNode.getElementsByClassName("semester")[0];
            
            // Remove deleted course from met courses array
            courses_planned = courses_planned.filter(e => e !== course_designator);
            
            console.log(course_designator);
            console.log(courses_planned);

            updateRequirements();

            // save plan
            year = semester.innerHTML.split(" ")[1];
            term = semester.innerHTML.split(" ")[0];
            planSaveTracker(localStorage.getItem("planId"), year, term, course_designator, "del");
        })
        section2.lastElementChild.previousElementSibling.previousElementSibling.remove();

        //remove fall
        courses = section2.lastElementChild.previousElementSibling.previousElementSibling.querySelectorAll(".course");
    
        courses.forEach(function(course){
            let course_designator = course.getElementsByTagName("p")[0].innerHTML;
            let semester = course.parentNode.getElementsByClassName("semester")[0];
            // Remove deleted course from met courses array
            courses_planned = courses_planned.filter(e => e !== course_designator);

            updateRequirements();

            // save plan
            year = semester.innerHTML.split(" ")[1];
            term = semester.innerHTML.split(" ")[0];
            planSaveTracker(localStorage.getItem("planId"), year, term, course_designator, "del");
        })
        section2.lastElementChild.previousElementSibling.previousElementSibling.remove();

        updateTotalHours();
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

    //add year
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

    function drop(event){
        let addition = false;
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

            addition = true;
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
        updateTotalHours(); //new

        let semester = dragged.parentNode.getElementsByClassName("semester")[0];

        // save plan
        year = semester.innerHTML.split(" ")[1];
        term = semester.innerHTML.split(" ")[0];
        planSaveTracker(localStorage.getItem("planId"), year, term, course_designator, "add");
        if (startCourse == course_designator) {
            planSaveTracker(localStorage.getItem("planId"), startYear, startTerm, startCourse, "del");
            
            startYear = "";
            startTerm = "";
        }
        startCourse = "";
    }


    function planSaveTracker(planid, year, term, course_designator, action) {
        if (action == "del") {
            temp = []
            temp.push('"' + planid + '", ');
            temp.push('"' + year + '", ');
            temp.push('"' + term + '", ');
            temp.push('"' + course_designator + '"');
            del.push(temp);
            console.log(del);
        } else if (action == "add") {
            temp = []
            temp.push('"' + planid + '", ');
            temp.push('"' + year + '", ');
            temp.push('"' + term + '", ');
            temp.push('"' + course_designator + '"');
            add.push(temp);
            console.log(add);
        }
    }

    function readCookie(name) {
        try {
            const content = `; ${document.cookie}`;
            const cookies = content.split(`; ${name}=`);
            if (cookies.length === 2){
                return cookies.pop().split(';').shift();
            }
        }
        catch {
            return null;
        }
      }

    let save = document.getElementById("save");
    save.addEventListener('click', function(event){
        dat = '{"planid": "' + localStorage.getItem("planId") + '", ';
        dat += '"add": [';
        for (let i = 0; i < add.length; i++) {
            dat += '[';
            for (let j = 0; j < add[i].length; j++) {
                dat += add[i][j];
            }
            dat += '], ';
        }
        if (add.length != 0) {
            dat = dat.substring(0, dat.length - 2);
        }
        dat += '], ';

        dat += '"del": [';
        for (let i = 0; i < del.length; i++) {
            dat += '[';
            for (let j = 0; j < del[i].length; j++) {
                dat += del[i][j];
            }
            dat += '], ';
        }
        if (del.length != 0) {
            dat = dat.substring(0, dat.length - 2);
        }
        dat += ']}';

        $.ajax({
            async: false,
            type: 'POST',
            url: 'http://localhost:3000/savePlan',
            data: dat,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data){}
        });

        dat = '{"student": {"id": "';
        if (readCookie("studentid") != null) {
            dat += readCookie("studentid");
        } else {
            dat += readCookie("userid");
        }
        dat += '", "note": "';
        dat += document.getElementById("s_notes").value;
        if (readCookie("studentid") != null) {
            dat += '"}, "faculty": {"id": "';
            dat += readCookie("userid");
            dat += '", "note": "';
            if (typeof document.getElementById("fac_notes").value !== 'undefined') {
                dat += document.getElementById("fac_notes").value;
            }
        }
        dat += '"}}';

console.log(dat);

        $.ajax({
            async: false,
            type: 'POST',
            url: 'http://localhost:3000/saveNotes',
            data: dat,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data){}
        });

        del = [];
        add = [];
        startTerm = "";
        startYear = "";
        startCourse = "";
    });

    updateTotalHours();//new
    function updateTotalHours(){
        let totalHours = document.getElementsByClassName("total_hours")[0];
        let hoursSum = 0;
        let semesters = section2.querySelectorAll(".cell");

        semesters.forEach(function(semester){
            let semester_hours = semester.firstChild.getElementsByClassName("credit-hours")[0].innerHTML;
            semester_hours = semester_hours.split(":")[1];
            hoursSum += parseInt(semester_hours);
        });
        totalHours.innerHTML = "Total Hours: " + hoursSum.toString();
        

    }

} catch (error) {

}
var logout = document.getElementById("logout");

logout.onclick = function() {
    document.cookie = 'userid=; Max-Age=0';
    document.cookie = 'planid=; Max-Age=0';
    document.cookie = 'roleid=; Max-Age=0';
    document.cookie = 'studentid=; Max-Age=0';
    location.assign('http://localhost:5173/');
}
