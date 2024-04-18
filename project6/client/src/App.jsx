import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )

  let a = <p>A</p>

  return (
    <>
      <header>
        <div class="heading">
            <h1>ACADEMIC PLANNING</h1>
            <div id="info">
                <p id="student"></p>
                <p id="major"></p>
                <p id="catalog_year"></p>
                <p id="minor"></p>
            </div>
            <div id="buttons">
                <button id="logout">Log Out</button>
                <button id="options">Options</button>
                <button id="save">Save</button>
            </div>
        </div>
    </header>
    <div id="banner">
        <p class="banner-element">Requirements</p>
        <p class="banner-element" id="plan">Academic Plan: CSCY</p>
        <div id="gpa" class="banner-element">
            <p>GPA: 3.75</p>
            <p>Major GPA: 3.64</p>
            <p id="total_hours"></p>
        </div>
    </div>
    <div id="grid-container">
        <div id="section1">
            <div id="requirements_cell">
                <div id="requirements"></div>
            </div>
        </div>
        <div id="section2"
          onLoad={() => {
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
        
                ref.current.appendChild(cell);
              }
            }
          }}>
            {a}
            <div id="bottom-strip">
                <div>
                    <button id="open-notes">Open Notes</button>
                </div>
                <div>
                    <button id="delete-year">Delete Course</button>
                    <button id="add-year">Add Year</button>
                </div>
            </div>
        </div>
        <div class="section-heading">
            <p class="banner-element">Links</p>
        </div>
        <div class="section-heading">
            <p class="banner-element">Course Finder</p>
        </div>
        <div id="section3">
            <div id="links-container">
                <a class="link" href="http://judah.cedarville.edu/index.php" target="_blank">Course Page</a>
                <a class="link" href="http://judah.cedarville.edu/~ward/cs3220.html" target="_blank">Joel Ward</a>
                <a class="link" href="http://judah.cedarville.edu/~wollsch/cs3220.html" target="_blank">Emily Wollschlager</a>
                <a class="link" href="http://judah.cedarville.edu/~ye/cs3220.html" target="_blank">Kaicheng Ye</a>
            </div>
        </div>
        <div id="section4">
            <table id="catalog"></table>
        </div>
    </div>
    </>
  )
}

export default App
