import React, { useEffect } from 'react';
import './List.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';




const AlphabetHeader = ({ letter }) => {
  return <h2 className="alphabet-header">{letter}</h2>;
};
  

  const NameList = ({ ingredients, id }) => {
    return (
      <ul className='Ingredient_List'>
         {ingredients.map((ingredient, index) => (
          
        
          <li key={index} className='Ingredient_li'>
              <Link 
              to={`/SRecipes/${id}/${ingredient.category_name}`}
                state= {{ 
                  type: "Ingredient", 
                  sid: ingredient.ic_id, 
                  sname: ingredient.category_name, 
                  description: null,
                  spice: null,
                  origin: null,
                }}
            >
              {ingredient.category_name}
            </Link>  
          </li>
        ))} 
      </ul>
    );
  };

  const AlphabetNavigator = ({ ingredients }) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
    const scrollToLetter = (letter) => {
      const element = document.getElementById(letter);
      if (element) {
          const headerOffset = 90; // Height of your fixed header/navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
  };
  
    return (
      <div className="alphabet-navigator">
        {alphabet.map((letter) => {
          const isDisabled = !ingredients[letter];
          return (
          <span key={letter} onClick={!isDisabled ? () => scrollToLetter(letter) : undefined}
          className={isDisabled ? "disabled" : ""}>
            {letter}
          </span>
        )})}
      </div>
    );
  };

  
  
  function List(props){
    const [ingredients, setIngredients] = useState([]);

  
    const idValue = props.id.value;
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:5000/ingredients'); // Updated URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setIngredients(groupIngredientsByLetter(data.data));
        } else {
          // Handle no recipes found or other issues
          console.error('No ingredients found');
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);
    


  const groupIngredientsByLetter = (ingredientData) => {
    return ingredientData.reduce((acc, ingredient) => {
      if (ingredient && ingredient.category_name) {
        const letter = ingredient.category_name[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(ingredient); // Push the entire object
      }
      return acc;
    }, {});
  };
  
  return (
    <>
    <div className='Ingredient_whole'>
      <h1 className="main-header">Ingredients A-Z</h1>
      <AlphabetNavigator ingredients={ingredients}/>
      <div className="ingredients-grid">
      {Object.entries(ingredients).map(([letter, ingredientObjects]) => (
        <div key={letter} id={letter}>
          <AlphabetHeader letter={letter} />
          <NameList ingredients={ingredientObjects} id={idValue}/>
        </div>
      ))}
    </div>
      </div>
    </>
  );
  }


export default List;