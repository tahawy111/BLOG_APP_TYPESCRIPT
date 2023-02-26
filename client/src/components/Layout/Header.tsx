import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import Menu from "./Menu";
import Search from "./Search";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const Header = () => {
  const { loading } = useSelector((state: RootState) => state.global);
  return (
    <Navbar
      bg="light"
      expand="lg"
      style={{
        position: loading ? "static" : "sticky",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <Container>
        <Navbar.Brand className="fw-bold">
          <Link to="/">Cool Blog</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Search />
          <Nav className="ms-auto">
            <Menu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
