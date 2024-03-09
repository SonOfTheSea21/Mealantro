import React, { useEffect, useState } from 'react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import SearchBar from "../SearchBar/searchBar"
import Dropdown from './Dropdown';

function Navbar(props) {
  const idValue = props.id.value;
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [showMealsDropdown, setShowMealsDropdown] = useState(false);
  const [showCuisinesDropdown, setShowCuisinesDropdown] = useState(false);
  const [showIngredientsDropdown, setShowIngredientsDropdown] = useState(false);
  const [showKitchenTipsDropdown, setShowKitchenTipsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => {
    setClick(false);
    setShowMealsDropdown(false);
    setShowCuisinesDropdown(false);
    setShowIngredientsDropdown(false);
    setShowKitchenTipsDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleMouseEnterMeals = () => {
    setShowMealsDropdown(true);
    setShowCuisinesDropdown(false);
    setShowIngredientsDropdown(false);
    setShowKitchenTipsDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleMouseEnterCuisines = () => {
    setShowCuisinesDropdown(true);
    setShowMealsDropdown(false);
    setShowIngredientsDropdown(false);
    setShowKitchenTipsDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleMouseEnterIngredients = () => {
    setShowIngredientsDropdown(true);
    setShowMealsDropdown(false);
    setShowCuisinesDropdown(false);
    setShowKitchenTipsDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleMouseEnterKitchenTips = () => {
    setShowKitchenTipsDropdown(true);
    setShowMealsDropdown(false);
    setShowCuisinesDropdown(false);
    setShowIngredientsDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleMouseEnterProfile = () => {
    setShowProfileDropdown(true);
    setShowMealsDropdown(false);
    setShowCuisinesDropdown(false);
    setShowIngredientsDropdown(false);
    setShowKitchenTipsDropdown(false);
  };

  const handleMouseLeave = () => {
    setShowMealsDropdown(false);
    setShowCuisinesDropdown(false);
    setShowIngredientsDropdown(false);
    setShowKitchenTipsDropdown(false);
    setShowProfileDropdown(false);
  };

  const showButton = () => {
    if (window.innerWidth <= 1335) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to={`/NewsFeed/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                NEWSFEED
              </Link>
            </li>
            <li className='nav-item'>
              <Link to={`/Restaurants/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                RESTAURANTS
              </Link>
            </li>
            <li className='nav-item'>
              <Link to={`/Recipes/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                RECIPES
              </Link>
            </li>
            <li className='nav-item' onMouseEnter={handleMouseEnterMeals} onMouseLeave={handleMouseLeave}>
              <Link to={`/Meals/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                MEALS
              </Link>
              {!click && showMealsDropdown && <Dropdown type="meals" id={idValue} />}
            </li>
            <li className='nav-item' onMouseEnter={handleMouseEnterCuisines} onMouseLeave={handleMouseLeave}>
              <Link to={`/Cuisines/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                CUISINES
              </Link>
              {!click && showCuisinesDropdown && <Dropdown type="cuisines" id={idValue} />}
            </li>
            <li className='nav-item' onMouseEnter={handleMouseEnterIngredients} onMouseLeave={handleMouseLeave}>
              <Link to={`/Ingredients/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                INGREDIENTS
              </Link>
              {!click && showIngredientsDropdown && <Dropdown type="ingredients" id={idValue} />}
            </li>
            {idValue.startsWith('A') && <li className='nav-item'>
              <Link to={`/Dashboard/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                DASHBOARD
              </Link>
            </li>
            }
            <li className='nav-item' onMouseEnter={handleMouseEnterProfile} onMouseLeave={handleMouseLeave}>
              <Link to={`/Profile/${idValue}`} className='nav-links' onClick={closeMobileMenu} state={{ type: "ViewMode" }}>
                PROFILE
              </Link>
              {!click && showProfileDropdown && <Dropdown type="profile" id={idValue} />}
            </li>
            <li className='nav-item'>
              <Link to={`/Inventory/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                INVENTORY
              </Link>
            </li>
            <li className='nav-item'>
              <Link to={`/Search/${idValue}`} className='nav-links' onClick={closeMobileMenu}>
                SEARCH
              </Link>
            </li>
            <li>
              <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </li>
            <li className='nav-link'>
              {button && <Button buttonStyle='btn--outline' link='/Login'>LOG OUT</Button>}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
