import { useState } from 'react'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Home } from "./Home";
import { Faculty } from "./Faculty";


  
function App() {

    return (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Faculty" element={<Faculty />} />
            <Route path="/Home" element={<Home />} />
          </Routes>
        </Router>
      );
}

export default App
