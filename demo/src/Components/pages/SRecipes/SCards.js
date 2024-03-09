import React, { useEffect } from 'react';
import '../../Cards/Cards.css';
import CardItem from '../../Cards/CardItem';
import { useState } from 'react';
import SecondCard from '../../Cards/SecondCard';
import ThirdCard from '../../Cards/ThirdCard';
function SCards({ id, type, sId, sName, description, spice, origin, rating, street, postal, city, country }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      let url = '';
      console.log('type: ' + type)
      console.log('sid: ' + sId );
      // Determine the URL based on the type
      if (type === 'Cuisine') {
        url = `http://localhost:5000/recipes/bycuisine/${sId}`;
      } else if (type === 'Meal') {
        // Replace with the appropriate URL for this type
        url = `http://localhost:5000/recipes/bymeal/${sId}`;
      } else if (type == 'Ingredient'){
        url = `http://localhost:5000/recipes/byingredient/${sId}`;
      }
      else if (type == 'Restaurant'){
        url = `http://localhost:5000/recipes/byrestaurant/${sId}`;
      }

      try {
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          console.log(data.data)
          setRecipes(data.data);
        } else {
          console.error('No recipes found');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([])
      }
    };

    fetchRecipes();
  }, [sId]);

  console.log(rating, street, postal, city, country);

  // Split recipes into chunks of size 2 for demonstration purposes
  const chunkedRecipes = recipes.reduce((acc, recipe, index) => {
    const chunkIndex = Math.floor(index / 4); // Change 2 to desired chunk size
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(recipe);
    return acc;
  }, []);

  const idv = id.value;

  return (
    <div className='cards'>
      <div className='cuisineCard'>
      {type === 'Restaurant' ? (
        <ThirdCard 
          name={sName} 
          rating={rating} 
          street={street} 
          postal={postal} 
          city={city} 
          country={country}
        />
      ) : (
        <SecondCard 
          name={sName} 
          origin={origin} 
          description={description} 
          spice={spice}
        />
      )}
      </div>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          {chunkedRecipes.map((recipeChunk, chunkIndex) => (
            <ul key={chunkIndex} className='cards__items'>
              {recipeChunk.map((recipe) => (
                <CardItem
                  key={recipe.fr_id}
                  rid={recipe.fr_id}
                  src={`http://localhost:5000/recipes/image/${recipe.fr_id}`}
                  text={recipe.food_name}
                  label={'Rating: ' + recipe.rating}
                  halalharam = {recipe.halalharam}
                  path={`/Recipe/${idv}/${recipe.food_name}`}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SCards;


