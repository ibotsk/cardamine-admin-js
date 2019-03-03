import React from "react";
import { 
    Nav, Navbar, NavDropdown, NavItem, 
    MenuItem,
    Glyphicon } from 'react-bootstrap';

const CNavbar = (props) => {

    return (
        <div id="navigation">
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        Cardamine Admin
                </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown eventKey={1} title="Chromosome data" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} href="/chromosome-data">All data</MenuItem>
                            <MenuItem eventKey={1.2} href="/publications">Publications</MenuItem>
                            <MenuItem eventKey={1.3} href="/persons">Persons</MenuItem>
                        </NavDropdown>
                        <NavItem eventKey={2} href="/names">Names</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            Users
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            <Glyphicon glyph="log-out" /> Logout
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );

}

export default CNavbar;