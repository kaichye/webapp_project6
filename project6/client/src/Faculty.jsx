import { Home } from "./Home";
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import React, { useEffect } from 'react';

export const Faculty = () => {

    useEffect(() => {
        const script = document.createElement('script');
    
        script.src = "javascripts/faculty.js";
        script.defer = true;
    
        document.body.appendChild(script);

      }, []);

    return (
        <div>
          <h1>Faculty</h1>
          <h2>Student-List:</h2>
        </div>
  )
};

  export default Faculty;