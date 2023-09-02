/* eslint-disable no-undef */
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AccountCircle, Settings } from "@material-ui/icons";
import AccountIcon from "../custom-icon/AccountIcon";
import SettingIcon from "../custom-icon/SettingIcon";
import "./HeaderComp.scss";

const HeaderComp = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, []);

  return (
    <header className="header-container">
      <div className="header-logo">
        <img
          className="esstLogo"
          src={require("../../assets/estee_logo.png")}
          alt="estee-logo"
        />
      </div>
      <div className="nav-container">
        <nav className="nav-bar">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "nav-active" : "link")}
          >
            Home
          </NavLink>

          <NavLink
            to="/e2e-network"
            className={({ isActive }) => (isActive ? "nav-active" : "link")}
          >
            E2E Network
          </NavLink>

          <NavLink
            to="demand-scenario"
            className={({ isActive }) => (isActive ? "nav-active" : "link")}
          >
            Demand Scenario
          </NavLink>
        </nav>
      </div>
      <div className="icon-container">
        <SettingIcon />
        <AccountIcon />
      </div>
    </header>
  );
};

export default HeaderComp;
