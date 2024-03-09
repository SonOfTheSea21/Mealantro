import React, { useEffect } from 'react';
import '../../Cards/Cards.css';
import ICardItem from '../../Cards/ICardItem';
import { useState } from 'react';
import SecondCard from '../../Cards/SecondCard';


function ICards(props) {
  const [recipes, setRecipes] = useState([]);

  const id = props.id.value;

  useEffect(() => {
    const fetchRecipes = async () => {
      let url = `http://localhost:5000/recipes/byinventory/${id}`;
      

      try {
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          const filteredRecipes = data.data.filter(recipe => recipe.percent > 0);
          console.log(filteredRecipes);
          setRecipes(filteredRecipes);
        } else {
          console.error('No recipes found');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([])
      }
    };

    fetchRecipes();
  }, [id]);

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
    <div className='cards'>
      <div>
      <h1 className="sboldAndUnderlined">Recommended for You</h1>
      </div>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          {chunkedRecipes.map((recipeChunk, chunkIndex) => (
            <ul key={chunkIndex} className='cards__items'>
              {recipeChunk.map((recipe) => (
                <ICardItem
                  key={recipe.fr_id}
                  rid={recipe.fr_id}
                  src={`http://localhost:5000/recipes/image/${recipe.fr_id}`}
                  text={recipe.food_name}
                  label={'Rating: ' + recipe.rating}
                  percent={recipe.percent}
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

export default ICards;


