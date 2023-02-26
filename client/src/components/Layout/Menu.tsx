import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logout } from "../../slices/authSlice";

const Menu = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const bfLoginLinks = [
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];
  const afLoginLinks = [
    { label: "Home", path: "/" },
    { label: "Create Blog", path: "/create_blog" },
  ];
  const loginLinks = auth.user ? afLoginLinks : bfLoginLinks;
  return (
    <div>
      <ul
        style={{ marginRight: auth.user ? "80px" : "0" }}
        className="navbar-nav w-100 mb-2 mb-lg-0 d-flex align-items-center"
      >
        {loginLinks.map((link, index) => (
          <Nav.Link key={index}>
            <NavLink to={link.path}>{link.label}</NavLink>
          </Nav.Link>
        ))}
        {auth.user?.user?.role === "admin" && (
          <Nav.Link>
            <NavLink to={`/category`}>Category</NavLink>
          </Nav.Link>
        )}
        {auth.user ? (
          <NavDropdown
            title={
              <span>
                <img
                  src={auth.user?.user?.avatar}
                  className="img-thumbnail"
                  alt="avatar"
                  style={{ width: "50px" }}
                />
              </span>
            }
            id="basic-nav-dropdown"
          >
            <Link
              to={`/profile/${auth?.user?.user._id}`}
              onClick={() => navigate(`/profile/${auth?.user?.user._id}`)}
              className="w-100"
            >
              <NavDropdown.Item className="w-100">Profile</NavDropdown.Item>
            </Link>
            <NavDropdown.Divider />
            <Link to="" onClick={() => dispatch(logout())}>
              <NavDropdown.Item>Logout</NavDropdown.Item>
            </Link>
          </NavDropdown>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default Menu;
