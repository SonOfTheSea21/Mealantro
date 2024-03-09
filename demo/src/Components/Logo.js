import React, { useState, useEffect } from 'react';
import { Button } from './Button.js';
import { Link } from 'react-router-dom';
import './Logo.css';
import SearchBar from './SearchBar/searchBar.js';

function Logo(props) {
  const idValue = props.id.value;

  const type = props.type;

  if (type === 'change') {
    return (
      <>
        <div className='logobar'>
          <Link to={`/Home/${idValue}`}>
            <img src={'/images/Mealantro_Logo1.png'} alt="Logo" className="logo2" />
          </Link>
          <SearchBar type='user' id={idValue} />
        </div>
      </>
    );
  }
  else {
    return (
      <>
        <div className='logobar'>
          <Link to={`/Home/${idValue}`}>
            <img src={'/images/Mealantro_Logo1.png'} alt="Logo" className="logo" />
          </Link>
        </div>
      </>
    );
  }

}

export default Logo;