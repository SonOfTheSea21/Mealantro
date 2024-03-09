import React, { useEffect } from 'react';
import '../../Cards/Cards.css';
import CardItem from '../../Cards/CardItem';
import { useState } from 'react';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick";
import CustomSlider from '../../CustomSlider/CustomSlider';
import './Home.css';
import { Link } from 'react-router-dom';


function Cards(props) {
  const [recipes, setRecipes] = useState([]);
  const [Frecipes, setFRecipes] = useState([]);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/recipes');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setRecipes(data.data);
          setFRecipes(data.data.slice(0,10))
        } else {
          console.error('No recipes found');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Split recipes into chunks of size 2 for demonstration purposes
  const chunkedRecipes = recipes.reduce((acc, recipe, index) => {
    const chunkIndex = Math.floor(index / 4); // Change 2 to desired chunk size
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(recipe);
    return acc;
  }, []);

  const idv = props.id.value;

  return (
    <>
    <div className="inventory-cta">
        <h2>Unlock Your Kitchen's Potential!</h2>
        <p>Discover recipes that match your ingredients.</p>
        <Link to={`/Inventory/${idv}`} className="cta-button">Share Your Inventory</Link>
      </div>
    <div className='cards'>
    <h1 className="hslider-heading">Most viewed!</h1>
    <CustomSlider
              key={idv}
              type="mostViewed"
              settings={settings}
              
              sid={idv}
              id={idv}
            />
      <h1 className="hslider-heading">Check out these amazing recipes!</h1>
      <CustomSlider
              key={idv}
              type="preferred_cuisine"
              settings={settings}
              
              sid={idv}
              id={idv}
            />
        <h1 className="hslider-heading">In Restaurants Near You!</h1>
    <CustomSlider
              key={idv}
              type="nearbyRestaurants"
              settings={settings}
              
              sid={idv}
              id={idv}
            />
    </div>
    </>
  );
}

export default Cards;


