import React from 'react';
import { Flag } from 'semantic-ui-react';
import '../assets/styles/header.css';

const Header = () => {
  return (
    <div className="headerDiv">
      <div className="headerPBig">
        <p className="inline">Humanidades Digitales</p>
        <span> </span>
        <Flag className="inline flag" name="pe" />
      </div>
      <div className="headerP">
        <p>
          Comunidad de herramientas digitales para la investigación social y
          humanista
        </p>
      </div>
    </div>
  );
};

export default Header;
