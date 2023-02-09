import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Dashboard } from "./modules/dashboard";
import { Users } from "./modules/users";

function App() {
  return (
    <div className="App">
      <div className="container py-4">
        <ul className="menu-list">
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/users">Users</NavLink>
          </li>
        </ul>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/users" element={<Users />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
