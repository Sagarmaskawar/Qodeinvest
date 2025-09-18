import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
const SideBar = () => {
  const items = [
    { icon: "fa-solid fa-house", label: "Home", url: "/" },
    {
      icon: "fa-solid fa-briefcase",
      label: "Portfolios",
      url: "/portfolio",
    },
    {
      icon: "fa-solid fa-flask",
      label: "Experimentals",
      url: '/',
    },
    {
      icon: "fa-solid fa-box",
      label: "Stack Archieves",
      url: "/",
    },
    {
      icon: "fa-solid fa-user",
      label: "Refer a friend",
      url: "/",
    },
    {
      icon: "fa-solid fa-gift",
      label: "Gift a Subcription",
      url: "/",
    },
    { icon: "fa-solid fa-user", label: "Account", url: "/" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i class="fa-solid fa-c"></i>
        <div>
          <p className="capital-mind">Capitalmind</p>
          <p className="capital-premium">premium</p>
        </div>
      </div>
      {items.map((item, index) => (
        <div key={index}>
          <Link
            to={item.url}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              cursor: "pointer",
              textDecoration: "none",
              color: "black",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <i className={item.icon} style={{ fontSize: "20px" }}></i>
            <span>{item.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
