import React from "react";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import "./Mainpage.scss";

const abakusLogo = require("../../public/images/abakus_logo_white_improved.png")
  .default;

const backendUrl = "http://localhost:3000";

const Layout: React.FC = ({ children }) => {
  const { user } = useAuth();

  return (
    <div id="layout">
      <div className="main-header-container">
        <Link to="/" className="header-main-link">
          <h1 className="header-main-heading">Kodenøtter</h1>
        </Link>
        <img height="50" src={abakusLogo} alt={"abakuslogo"} />
        <div className="profile-image">
          {user ? (
            <Image roundedCircle src={user.profilePicture} />
          ) : (
            <Button href={`${backendUrl}/auth`}>Logg inn</Button>
          )}
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
