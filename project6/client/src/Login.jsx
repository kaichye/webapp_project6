// Login.jsx
import { Home } from "./Home";
import { Link } from "react-router-dom";
import React, { useEffect } from 'react';


export const Login = () => {

  useEffect(() => {
    const script = document.createElement('script');

    script.src = "javascripts/login.js";
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>
          Login:
          <input id="user" type="text" name="Username" />
          <input id="pass" type="password" name="Password" />
        </label>
      <input id="submit" type="button" value="Submit" />
      </form>
      <Link to="/Home">TEST LINK TO HOME PAGE</Link>
    </div>

  )
};

  export default Login;