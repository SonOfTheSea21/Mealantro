import React, { useEffect } from 'react';
import './List.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';




const AlphabetHeader = ({ letter }) => {
  return <h2 className="malphabet-header">{letter}</h2>;
};
  

  const NameList = ({ meals, id }) => {
    return (
      <ul className='Meal_List'>
        {meals.map((meal, index) => (
          
          <li key={index} className='Meal_li'>
            <Link 
              to={`/SRecipes/${id}/${meal.category_name}`}
                state= {{ 
                  type: "Meal", 
                  sid: meal.category_id, 
                  sname: meal.category_name, 
                  description: meal.description,
                  spice: null,
                  origin: null,
                }}
            >
              {meal.category_name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const AlphabetNavigator = ({ meals }) => {
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
          const isDisabled = !meals[letter];
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
    const [meals, setMeals] = useState([]);

  
    const idValue = props.id.value;
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('http://localhost:5000/meals'); // Updated URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setMeals(groupMealsByLetter(data.data));
        } else {
          // Handle no recipes found or other issues
          console.error('No meals found');
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, []);
    


  const groupMealsByLetter = (mealData) => {
    return mealData.reduce((acc, meal) => {
      if (meal && meal.category_name) {
        const letter = meal.category_name[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(meal); // Push the entire object
      }
      return acc;
    }, {});
  };
  
  return (
    <>
    <div className='Meal_whole'>
      <h1 className="mmain-header">Meals A-Z</h1>
      <AlphabetNavigator meals={meals}/>
      <div className="meals-grid">
      {Object.entries(meals).map(([letter, mealObjects]) => (
        <div key={letter} id={letter}>
          <AlphabetHeader letter={letter} />
          <NameList meals={mealObjects} id={idValue}/>
        </div>
      ))}
    </div>
      </div>
    </>
  );
  }


export default List;