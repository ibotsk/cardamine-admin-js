import React from 'react';
import {
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  MenuItem,
  Glyphicon,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

const CNavbar = (props) => {
  return (
    <div id="navigation">
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>Cardamine Admin</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown
              eventKey={1}
              title="Chromosome data"
              id="basic-nav-dropdown"
            >
              <LinkContainer exact to="/chromosome-data">
                <MenuItem eventKey={1.1}>All data</MenuItem>
              </LinkContainer>
              <LinkContainer exact to="/publications">
                <MenuItem eventKey={1.2}>Publications</MenuItem>
              </LinkContainer>
              <LinkContainer exact to="/persons">
                <MenuItem eventKey={1.3}>Persons</MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer exact to="/chromosome-data/import">
                <MenuItem eventKey={1.4}>Import</MenuItem>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer exact to="/names">
              <NavItem eventKey={2}>Names</NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={3} href="#">
              Users
            </NavItem>
            <LinkContainer to="/logout">
              <NavItem eventKey={3.1}>
                <Glyphicon glyph="log-out" /> Logout
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default CNavbar;
