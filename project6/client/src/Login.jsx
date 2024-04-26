// Login.jsx
import { Home } from "./Home";
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";

export const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>
          Login:
          <input type="text" name="Username" />
          <input type="text" name="Password" />
        </label>
      <input type="submit" value="Submit" />
      </form>
      <Link to="/Home">TEST LINK TO HOME PAGE</Link>
    </div>

  )
};

  export default Login;