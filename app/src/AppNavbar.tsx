import { useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">TaskTogether📝</NavbarBrand>
            <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="justify-content-end" style={{ width: "100%" }} navbar>
                    <NavItem>
                        <NavLink href="/">Inicio</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/groups">Gestionar tareas 📝</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/users">Usuarios 👥</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink target='_blank' href="https://github.com/alexanderbkl/spring-boot-kotlin">GitHub</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default AppNavbar;