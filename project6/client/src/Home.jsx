import React, { useEffect } from 'react';

  export function Home() {

    useEffect(() => {
      const script = document.createElement('script');
  
      script.src = "javascripts/main.js";
      script.defer = true;
  
      document.body.appendChild(script);
  
    }, []);

  return (
    <>
      <header>
        <div className="heading">
            <a id="go-home" href="../"><h1>ACADEMIC PLANNING</h1></a>
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
                <button id="plans">Plans</button>
            </div>
        </div>
      </header>
      <div id="myModal" className="modal">
        <div className="modal-content">
            <span id="close">x</span>
            <p className="title">Plans: </p>
        </div>
      </div>
      <div id="banner">
          <p className="banner-element">Requirements</p>
          <p className="banner-element" id="plan">Academic Plan: CSCY</p>
          <div id="gpa" className="banner-element">
              <p>GPA: 3.75</p>
              <p>Major GPA: 3.64</p>
              <p className="total_hours"></p>
          </div>
      </div>
      <div id="grid-container">
          <div id="section1">
              <div id="requirements_cell">
                  <div id="requirements"></div>
              </div>
          </div>
          <div id="section2">
              <div id="bottom-strip">
                  <div>
                      <button id="open-notes">Open Notes</button>
                  </div>
                  <div>
                      <button id="delete-year">Delete Year</button>
                      <button id="add-year">Add Year</button>
                      <button id="delete-course">Delete Course</button>
                  </div>
              </div>
              <div>
                <div id="notes" >
                    <font color="white">Student Notes:</font>
                    <textarea id="s_notes" rows="10" cols="100"></textarea>
                </div>
                <div id="fac_notes" >
                    <font color="white">Faculty Notes:</font>
                    <textarea id="f_notes" rows="10" cols="100"></textarea>
                </div>
              </div>
          </div>
          <div className="section-heading">
              <p className="banner-element">Links</p>
          </div>
          <div className="section-heading">
              <p className="banner-element">Course Finder</p>
          </div>
          <div id="section3">
              <div id="links-container">
                  <a className="link" href="http://judah.cedarville.edu/index.php" target="_blank">Course Page</a>
                  <a className="link" href="http://judah.cedarville.edu/~ward/cs3220.html" target="_blank">Joel Ward</a>
                  <a className="link" href="http://judah.cedarville.edu/~wollsch/cs3220.html" target="_blank">Emily Wollschlager</a>
                  <a className="link" href="http://judah.cedarville.edu/~ye/cs3220.html" target="_blank">Kaicheng Ye</a>
              </div>
          </div>
          <div id="section4">
              <table id="catalog"></table>
          </div>
      </div>
    </>
  )
};

  export default Home;