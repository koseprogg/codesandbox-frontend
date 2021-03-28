import React from "react";
import { Link } from "react-router-dom";
import { Button, Image, Dropdown } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import config from "../config";
import "./Mainpage.scss";

const abakusLogo = require("../../public/images/abakus_logo_white_improved.png")
  .default;

type CustomToggleProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

const CustomToggle = React.forwardRef(
  (props: CustomToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
    <a
      ref={ref}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.preventDefault();
        props.onClick(e);
      }}
    >
      {props.children}
    </a>
  )
);

CustomToggle.displayName = "CustomToggle";

const Layout: React.FC = ({ children }) => {
  const { user, logOut } = useAuth();

  return (
    <div id="layout">
      <div className="main-header-container">
        <Link to="/" className="header-main-link">
          <h1 className="header-main-heading">Kodenøtter</h1>
        </Link>
        <img height="50" src={abakusLogo} alt={"abakuslogo"} />
        <div className="profile-image">
          {user ? (
            <>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <Image roundedCircle src={user.profilePicture} width={50} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    target="_blank"
                    rel="noreferrer"
                    href={`https://abakus.no/users/${user?.username}`}
                  >
                    {user?.username}
                    <span className="material-icons">open_in_new</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={logOut}>Logg ut</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <Button href={`${config.backendUrl}/auth`}>Logg inn</Button>
          )}
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
