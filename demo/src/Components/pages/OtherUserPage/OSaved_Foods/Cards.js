import React, { useEffect } from 'react';
import "../../../Cards/Cards.css"
import CardItem from '../../../Cards/CardItem';
import { useState } from 'react';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import CustomSlider from '../../../CustomSlider/CustomSlider';
import axios from 'axios';

function Cards(props) {
  const [recipes, setRecipes] = useState([]);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/oprofile/food/${props.oid}/${props.id}`);
      
      // Axios automatically throws an error for non-2xx responses, so no need for explicit check
      const data = response.data;
      console.log(data.data);
      if (data.success && data.data) {
        setRecipes(data.data);
      } else {
        console.error('No recipes found');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Split recipes into chunks of size 2 for demonstration purposes
  const chunkedRecipes = recipes.reduce((acc, recipe, index) => {
    const chunkIndex = Math.floor(index / 3); // Change 2 to desired chunk size
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(recipe);
    return acc;
  }, []);

  return (
    <>
    <div className='cards'>
      <h1>Saved Food</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          {chunkedRecipes.map((recipeChunk, chunkIndex) => (
            <ul key={chunkIndex} className='cards__items'>
              {recipeChunk.map((recipe) => (
                <CardItem
                  key={recipe.fr_id}
                  id={recipe.fr_id}
                  src={`http://localhost:5000/recipes/image/${recipe.fr_id}`}
                  text={recipe.food_name}
                  label={'Rating: ' + recipe.rating}
                  halalharam = {recipe.halalharam}
                  path='./services'
                />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default Cards;


