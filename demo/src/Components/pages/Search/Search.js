import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { useParams } from 'react-router-dom';
import Logo from '../../Logo';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from 'react-select';
import "./Search.css";
import CardItem from '../../Cards/CardItem';
import { Range } from 'react-range'; // Import Range component from react-range

function Search() {
    const { id } = useParams();
    console.log(id);
    const [recipes,setRecipes] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        cuisine: '',
        category: '',
        halalharam: '', // New field for Halal/Haram selection
        searchR: '',
        searchI: '',
        rating: 0
    });

    useEffect(() => {
        const fetchCuisinesAndCategories = async () => {
            // Fetch cuisines
            try {
                const cuisineResponse = await fetch('http://localhost:5000/cuisines/dropdown');
                if (!cuisineResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const cuisineData = await cuisineResponse.json();
                if (cuisineData.success && cuisineData.data) {
                    setCuisines(cuisineData.data);
                } else {
                    console.error('No cuisines found');
                }
            } catch (error) {
                console.error('Error fetching cuisines:', error);
            }

            // Fetch categories
            try {
                const categoryResponse = await fetch('http://localhost:5000/meals/dropdown');
                if (!categoryResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const categoryData = await categoryResponse.json();
                if (categoryData.success && categoryData.data) {
                    setCategories(categoryData.data);
                } else {
                    console.error('No categories found');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCuisinesAndCategories();
    }, []);

    const handleSelectChange = (selectedOption, actionMeta) => {
        if (actionMeta && actionMeta.name) {
            const { name } = actionMeta;
            const value = selectedOption ? selectedOption.value : ''; // Get the value or set to empty string if the option is deselected
            console.log("name : " + name + " value: " + value);
            setFormData({
                ...formData,
                [name]: value
            });
        } else {
            console.error("Invalid actionMeta:", actionMeta);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleRangeChange = (values) => {
        setFormData({
            ...formData,
            rating: values[0] // values is an array, so we take the first element
        });
    };
    
    useEffect(() => {
        sendRequest();
    }, [formData]); // Execute sendRequest whenever formData changes
    
    const chunkedRecipes =  Array.isArray(recipes) ? recipes.reduce((acc, recipe, index) => {
        const chunkIndex = Math.floor(index / 4); // Change 2 to desired chunk size
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(recipe);
        return acc;
      }, []) : [];
    

 
    const sendRequest = () => {
        console.log('id ' +  id)
        fetch(`http://localhost:5000/search/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server if needed
            console.log(data);
            setRecipes(data.data);
        })
        .catch(error => {
            setRecipes([])
            console.error('Error:', error);
            
        });
    };

 
    return (
        <>
            <Logo id={{ value: id }} />
            <Navbar id={{ value: id }} />
            <div className='container'>
                <div className='d'>
                    <Select
                        name="cuisine"
                        options={[
                            { label: 'Select Cuisine', value: '' }, // Deselect option
                            ...cuisines.map(cuisine => ({ label: cuisine.cuisine_name, value: cuisine.cuisine_name }))
                        ]}
                        placeholder="Cuisines"
                        onChange={handleSelectChange}
                        isSearchable={false}
                    />
                </div>
                <div className='d'>
                    <Select
                        name="category"
                        options={[
                            { label: 'Select Category', value: '' }, // Deselect option
                            ...categories.map(category => ({ label: category.category_name, value: category.category_name }))
                        ]}
                        placeholder="Meals"
                        onChange={handleSelectChange}
                        isSearchable={false}
                    />
                </div>
                <div className='d'>
                    <Select
                        name="halalharam"
                        options={[
                            { label: 'Select Halal/Haram', value: '' },
                            { label: 'Halal', value: 'Halal' },
                            { label: 'Haram', value: 'Haram' }
                        ]}
                        placeholder="Halal/Haram"
                        onChange={handleSelectChange}
                        isSearchable={false}
                    />
                </div>
                <div className='s'>
                    <input
                        className="search"
                        type="search"
                        name="searchR"
                        placeholder="Search for recipes"
                        onChange={handleInputChange}
                        value={formData.searchR}
                    />
                </div>
                <div className='s'>
                    <input
                        className="search"
                        type="search"
                        name="searchI"
                        placeholder="Search for ingredients"
                        onChange={handleInputChange}
                        value={formData.searchI}
                    />
                </div>
                <div className='range'>
                <Range
                    className="range"
                    name="rating"
                    min={0}
                    max={5}
                    step={1}
                    values={[formData.rating]}
                    onChange={handleRangeChange}
                    renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        className={isDragged ? "range-thumb range-thumb-dragged" : "range-thumb"}
                    />
                    )}
                    renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        className="range-track"
                    >
                        {children}
                    </div>
                    )}
                />
                <div className="range-value">{formData.rating}</div>
                </div>
            </div>
            <div className='cards__container'>
                <div className='cards__wrapper'>
                {Array.isArray(recipes) && chunkedRecipes.map((recipeChunk, chunkIndex) => (
                    <ul key={chunkIndex} className='cards__items'>
                    {recipeChunk.map((recipe) => (
                        <CardItem
                        key={recipe.fr_id}
                        rid={recipe.fr_id}
                        src={`http://localhost:5000/recipes/image/${recipe.fr_id}`}
                        text={recipe.food_name}
                        label={'Rating: ' + recipe.rating}
                        halalharam={recipe.halalharam} // Pass Halal/Haram value from formData
                        path={`/Recipe/${id}/${recipe.food_name}`}
                        />
                    ))}
                    </ul>
                ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Search;