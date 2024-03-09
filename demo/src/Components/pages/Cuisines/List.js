import React, { useEffect } from 'react';
import './List.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';




const AlphabetHeader = ({ letter }) => {
  return <h2 className="alphabet-header">{letter}</h2>;
};
  

  const NameList = ({ cuisines, id }) => {
    return (
      <ul className='Cuisine_List'>
        {cuisines.map((cuisine, index) => (
          
          <li key={index} className='Cuisine_li'>
            <Link 
              to={`/SRecipes/${id}/${cuisine.cuisine_name}`}
                state= {{ 
                  type: "Cuisine", 
                  sid: cuisine.cuisine_id, 
                  sname: cuisine.cuisine_name, 
                  description: cuisine.description,
                  spice: cuisine.spice_level,
                  origin: cuisine.origin,
                }}
            >
              {cuisine.cuisine_name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const AlphabetNavigator = ({ cuisines }) => {
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
          const isDisabled = !cuisines[letter];
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
    const [cuisines, setCuisines] = useState([]);

  
    const idValue = props.id.value;
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch('http://localhost:5000/cuisines'); // Updated URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setCuisines(groupCuisinesByLetter(data.data));
        } else {
          // Handle no recipes found or other issues
          console.error('No cuisines found');
        }
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      }
    };

    fetchCuisines();
  }, []);
    


  const groupCuisinesByLetter = (cuisineData) => {
    return cuisineData.reduce((acc, cuisine) => {
      if (cuisine && cuisine.cuisine_name) {
        const letter = cuisine.cuisine_name[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(cuisine); // Push the entire object
      }
      return acc;
    }, {});
  };
  
  return (
    <>
    <div className='Cuisine_whole'>
      <h1 className="main-header">Cuisines A-Z</h1>
      <AlphabetNavigator cuisines={cuisines}/>
      <div className="cuisines-grid">
      {Object.entries(cuisines).map(([letter, cuisineObjects]) => (
        <div key={letter} id={letter}>
          <AlphabetHeader letter={letter} />
          <NameList cuisines={cuisineObjects} id={idValue}/>
        </div>
      ))}
    </div>
      </div>
    </>
  );
  }


export default List;