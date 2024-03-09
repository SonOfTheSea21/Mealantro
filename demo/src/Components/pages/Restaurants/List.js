import React, { useEffect } from 'react';
import './List.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';




const AlphabetHeader = ({ letter }) => {
  return <h2 className="alphabet-header">{letter}</h2>;
};
  

  const NameList = ({ restaurants, id }) => {
    return (
      <ul className='Cuisine_List'>
        {restaurants.map((rest, index) => (
          
          <li key={index} className='Cuisine_li'>
            <Link 
              to={`/SRecipes/${id}/${rest.restaurant_name}`}
                state= {{ 
                  type: "Restaurant", 
                  sid: rest.restaurant_id, 
                  sname: rest.restaurant_name, 
                  rating: rest.rating,
                  street: rest.street_name,
                  postal: rest.postal_code,
                  city: rest.city,
                  country: rest.country_name,
                }}
            >
              {rest.restaurant_name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const AlphabetNavigator = ({ rests }) => {
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
          const isDisabled = !rests[letter];
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
    const [restaurants, setRestaurants] = useState([]);

  
    const idValue = props.id.value;
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5000/restaurants'); // Updated URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setRestaurants(groupRestaurantsByLetter(data.data));
        } else {
          // Handle no recipes found or other issues
          console.error('No Restaurants found');
        }
      } catch (error) {
        console.error('Error fetching Restaurants:', error);
      }
    };

    fetchRestaurants();

    console.log(restaurants);
  }, []);
    


  const groupRestaurantsByLetter = (restData) => {
    return restData.reduce((acc, rest) => {
      if (rest && rest.restaurant_name) {
        const letter = rest.restaurant_name[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(rest); // Push the entire object
      }
      return acc;
    }, {});
  };
  
  return (
    <>
    <div className='Cuisine_whole'>
      <h1 className="main-header">Restaurants A-Z</h1>
      <AlphabetNavigator rests={restaurants}/>
      <div className="cuisines-grid">
      {Object.entries(restaurants).map(([letter, restObjects]) => (
        <div key={letter} id={letter}>
          <AlphabetHeader letter={letter} />
          <NameList restaurants={restObjects} id={idValue}/>
        </div>
      ))}
    </div>
      </div>
    </>
  );
  }


export default List;