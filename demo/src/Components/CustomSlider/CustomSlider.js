import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardItem from '../Cards/CardItem';
import { useState } from 'react';
import { useEffect } from 'react';
import "../Cards/Cards.css"
import "./CustomSlider.css"
function CustomSlider({type , settings,sid,name,id }) {

    const url = `http://localhost:5000/recipes/${type}/${sid}`
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          console.log(name)
          console.log(data.data)
          setRecipes(data.data);
        } else {
          console.error('No recipes found');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);



  return (
    <>
    {recipes.length>0 && <p className="slider-heading">{name}</p>}
    {recipes.length > 0 && <Slider {...settings} className='sliderr'>
      {recipes.map((item) => (
        <div key={item.fr_id}>
          <CardItem
            id={item.fr_id}
            rid={item.fr_id}
            src={`http://localhost:5000/recipes/image/${item.fr_id}`}
            text={item.food_name}
            label={'Rating: ' + item.rating}
            halalharam={item.halalharam}
            path={`/Recipe/${id}/${item.food_name}`}
          />
        </div>
      ))}
    </Slider>}
    </>
  );
}

export default CustomSlider;
