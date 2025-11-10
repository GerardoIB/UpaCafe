import React from 'react';

import './NavBar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">MiApp</div>
      <ul className="navbar-links">
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Servicios</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
