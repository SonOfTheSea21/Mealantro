import React, { useEffect, useState } from 'react';
import '../../Cards/Cards.css';
import CardItem from '../../Cards/CardItem';
import Slider from "react-slick";
import CustomSlider from '../../CustomSlider/CustomSlider';

function Cards(props) {
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/meals/dropdown');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
          console.log(data.data)
          setCategories(data.data);
        } else {
          console.error('No categories found');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  console.log(props.id);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch('http://localhost:5000/cuisines/dropdown');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success && data.data) {
            console.log(data.data)
          setCuisines(data.data);
        } else {
          console.error('No cuisines found');
        }
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      }
    };

    fetchCuisines();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    // Add more settings as per your requirement
  };

  return (
    <>
      <div className='cards'>
        {categories.map(category => {
          console.log('Category:', category.category_name);
          return (
            <CustomSlider
              key={category.category_id}
              type="bymeal"
              settings={settings}
              name={category.category_name}
              sid={category.category_id}
              id={props.id}
            />
          );
        })}
        {cuisines.map(cuisine => {
          console.log('Cuisine:', cuisine.cuisine_name);
          return (
            <CustomSlider
              key={cuisine.cuisine_id}
              type="bycuisine"
              settings={settings}
              name={cuisine.cuisine_name}
              sid={cuisine.cuisine_id}
              id={props.id}
            />
          );
        })}
      </div>
    </>
  );
}

export default Cards;
