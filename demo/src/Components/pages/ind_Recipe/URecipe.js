import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { Button } from '../../Button';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import './URecipe.css';
import Popup from './Popup';


const notifySuccess = () => {
    toast('Recipe Updated Successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        style: {
            background: "white", // Change the background color
            color: '#EE4E34', // Change the text color
        },
        progressStyle: {
            background: '#EE4E34' // Change the progress bar color
        }
    });
}

function URecipe({id, rid}) {
    const [ogrecipe, setRecipeDetails] = useState({});
  const [recipe, setNewRecipe] = useState({
    recipename: '',
    cuisine: '',
    isHalal: false,
    preptime: '',
    cooktime: '',
    servings: '',
    directions: '',
    foodphoto: '',
  });

  const idv = id.value;

  const [image2, setImage2] = useState("");

  const [selectedConditions, setSelectedConditions] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);

const [showPopup, setShowPopup] = useState(false);
const [addedIngredients, setAddedIngredients] = useState([]);

const handleAddIngredient = (newIngredient) => {
    setAddedIngredients([...addedIngredients, newIngredient]);
  };

const togglePopup = () => {
  setShowPopup(!showPopup);
};

  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();
  
  // State for cuisines, conditions, etc.
  const [cuisines, setCuisines] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [types, setTypes] = useState([]);

  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeConditions, setRecipeConditions] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);


  useEffect(() => {
    fetchAll();
  }, [rid]);

  const fetchAll = async () => {
    const urls = [
        `http://localhost:5000/recipes/${rid}`,
        `http://localhost:5000/recipes/ingredients/${rid}`,
        `http://localhost:5000/recipes/categories/${rid}`,
        `http://localhost:5000/recipes/conditions/${rid}`,
        
    ];

    // Use Promise.all to fetch all data concurrently
    Promise.all(urls.map(url => fetch(url).then(resp => {
        if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
    }))).then(data => {
        setRecipeDetails(data[0].data[0]);
        recipe.recipename = data[0].data[0].food_name;
        recipe.foodphoto = data[0].data[0].food_photo;
        recipe.cuisine = data[0].data[0].cuisine_id;
        recipe.isHalal = data[0].data[0].halalharam === "halal" ? true : false;
        recipe.preptime = data[0].data[0].preparation_time;
        recipe.cooktime = data[0].data[0].cooking_time;
        recipe.servings = data[0].data[0].servings;
        recipe.directions = data[0].data[0].directions;
        setRecipeIngredients(data[1].data);
        setAddedIngredients(data[1].data);
        console.log(recipeIngredients);
        setRecipeCategories(data[2].data);
        setSelectedCategories(data[2].data);
        setRecipeConditions(data[3].data);
        setSelectedConditions(data[3].data);
        console.log(recipeConditions);
        if (data[0].data[0].food_photo) {
            setImage2(`http://localhost:5000/recipes/image/${rid}`);
            recipe.foodphoto = { uri: `http://localhost:5000/recipes/image/${rid}` };
          }
    }).catch(error => {
        console.error('Error fetching recipe data:', error);
    });
};



  useEffect(() => {
    const fetchCuisineData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cuisines');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCuisines(data.data);
      } catch (error) {
        console.error('Error fetching cuisine data:', error);
      }
    };
    fetchCuisineData();
  }, []);

  useEffect(() => {
    const fetchIngredientsData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ingredients/all/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setIngredients(data.data);
      } catch (error) {
        console.error('Error fetching ingredients data:', error);
      }
    };
    fetchIngredientsData();
  }, [id]);

  useEffect(() => {
    const fetchConditionData = async () => {
      try {
        const response = await fetch('http://localhost:5000/recipes/conditions/all');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setConditions(data.data);
      } catch (error) {
        console.error('Error fetching conditions data:', error);
      }
    };
    fetchConditionData();
  }, []);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/meals');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching cuisine data:', error);
      }
    };
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ingredients/types/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setTypes(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchTypes();
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      setImagePreview(URL.createObjectURL(file));
      setImage2(URL.createObjectURL(file));
      setNewRecipe((prevDetails) => ({
        ...prevDetails,
        foodphoto: file,
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewRecipe(prevDetails => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    Object.entries(recipe).forEach(([key, value]) => {
        if (key !== 'foodphoto') { // Skip the photo here
            formData.append(key, value);
        }
    });



    // Append added ingredients as JSON
    formData.append('addedIngredients', JSON.stringify(addedIngredients));

    // Append conditions and categories
    formData.append('selectedConditions', JSON.stringify(selectedConditions)); // Assuming you store IDs in selectedConditions
    formData.append('selectedCategories', JSON.stringify(selectedCategories)); // Assuming you store IDs in selectedCategories

    // Append photo if present
    if (recipe.foodphoto) {
        formData.append('foodphoto', recipe.foodphoto);
    }

    console.log("conditions", selectedConditions);
    try {
      const response = await fetch(`http://localhost:5000/recipes/delete/${rid}`, {
        method: 'DELETE', // Assuming PUT for an update operation
      });
      if (!response.ok) throw new Error('Failed to delete recipe');

        const response2 = await fetch(`http://localhost:5000/recipes/insert/${idv}`, {
            method: 'POST',
            body: formData,
        });
        if (!response2.ok) throw new Error('Failed to add recipe');

      notifySuccess();
      window.location.href = `http://localhost:3000/Home/${idv}`;
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const handleDeleteIngredient = (index) => {
    // Handle deletion of an added ingredient
  };

  return (
    <div>
    <div className="profile-info col-md-9">
            <div className="panel">
              <div className="panel-body bio-graph-info">
                <h1>Edit your Recipe</h1>
                <div className="row">
                <div className="pinfo-item">
            <label>Recipe Name:</label>
            <input
                className="pupdate--section"
                type="text"
                name="recipename"
                value={recipe.recipename}
                onChange={handleInputChange}
              />
          </div>
          <div className="pinfo-item">
          <label>Cuisine:</label>
          <select
            className="pupdate--section"
            name="cuisine"
            onChange={handleInputChange} // Make sure to update handleInputChange to handle setting the selected cuisine
            value={recipe.cuisine} // Ensure you have a cuisine attribute in your recipe state to store this
            
          >
            <option value=""></option>
            {cuisines.map((cuisine) => (
              <option key={cuisine.cuisine_id} value={cuisine.cuisine_id}>
                {cuisine.cuisine_name}
              </option>
            ))}
          </select>
          </div>      
          <div className="pinfo-item">
            <label>
              Halal/Haram:
            </label>  
            <input
                type="checkbox"
                name="isHalal"
                checked={recipe.isHalal}
                onChange={handleInputChange} // Create a new handler for checkbox
                className="halal-checkbox"
              />
            <p>{recipe.isHalal ? "Halal" : "Haram"}</p>
          </div>

          <div className="pinfo-item">
            <label>Preparation Time (mins):</label>
              <input
              className="pupdate--section"
              type="number"
                name="preptime"
                value={recipe.preptime}
                onChange={handleInputChange}
                min="1" // Minimum value to prevent non-sensible values
                step="1"

              />
          </div>

          <div className="pinfo-item">
            <label>Cooking Time (mins):</label>
          
              <input
              className="pupdate--section"
                type="number"
                name="cooktime"
                value={recipe.cooktime}
                onChange={handleInputChange}
                min="1" // Minimum value to prevent non-sensible values
                step="1"

              />
          </div>

          <div className="pinfo-item">
            <label>Servings:</label>
              <input
              className="pupdate--section"
                type="number"
                name="servings"
                value={recipe.servings}
                onChange={handleInputChange}
                min="1" // Minimum value to prevent non-sensible values
                step="1"

              />
          </div>

          <div className="pinfo-item">
            <label>Directions:</label>
            <textarea
              name="directions"
              value={recipe.directions}
              onChange={handleInputChange}
              rows="7" // Starting height to display 5 lines at once
              cols="100" // Default width to display 50 characters in a line
              className="directions-textarea"

            ></textarea>

          </div>

          <div className="pinfo-item">
          <label>Photo:</label>
          <img 
                    width="150px"
                    src={image2}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple={false}
                    className="file-input"
                  />
                  
                </div>



                <div className="pinfo-item">
                  <label>Conditions:</label>
                  <Multiselect
                    options={conditions.map(condition => ({name: condition.name, condition_id: condition.condition_id}))} // Adjust the options to be an array of objects
                    selectedValues={recipeConditions.map(condition => ({name: condition.name, condition_id: condition.condition_id}))}
                    displayValue="name" // Assuming your objects have a 'name' key
                    onSelect={(selectedList) => setRecipeConditions(selectedList)}
                    onRemove={(selectedList) => setRecipeConditions(selectedList)}
                    showCheckbox={true}
                    placeholder="" // This can be dynamically changed based on selection
                    style={{
                        multiselectContainer: { // To change css for multiselect (Width,height, etc..)
                          width: '70%',
                          marginLeft: '10px',
                          borderColor: 'black',
                          backgroundColor: 'white',
                        },
                        chips: { backgroundColor: '#EE4E34' }, // Example for styling selected items
                        
                        option: {
                          padding: '8px 10px',
                          cursor: 'pointer',
                        },
                        
                      }}
                  />
                </div>

                <div className="pinfo-item">
                  <label>Categories:</label>
                  <Multiselect
                    options={categories.map(category => ({name: category.category_name, category_id: category.category_id}))} // Adjust the options to be an array of objects
                    selectedValues={recipeCategories.map(category => ({name: category.category_name, category_id: category.category_id}))}
                    displayValue="name" // Assuming your objects have a 'name' key
                    onSelect={(selectedList) => setSelectedCategories(selectedList)}
                    onRemove={(selectedList) => setSelectedCategories(selectedList)}
                    showCheckbox={true}
                    placeholder="" // This can be dynamically changed based on selection
                    style={{
                      multiselectContainer: { // To change css for multiselect (Width,height, etc..)
                        width: '70%',
                        marginLeft: '10px',
                        borderColor: 'black',
                        backgroundColor: 'white',
                      },
                      chips: { backgroundColor: '#EE4E34' }, // Example for styling selected items
                      
                      option: {
                        padding: '8px 10px',
                        cursor: 'pointer',
                      },
                      
                    }}
                  />

                </div>

                <div className="pinfo-item">
                  <label>Ingredients:</label>
                  <button className="add-button" onClick={togglePopup}>Add Ingredient</button>
                  <div className="ingredient-list">
                    {addedIngredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        <p className="ingredient-detail">{`${ingredient.amount} ${ingredient.amount_type} of ${ingredient.ingredient_name}`}</p>
                      </div>
                    ))}
                  </div>

                    {showPopup && (
                        <Popup 
                            isOpen={showPopup} 
                            closePopup={togglePopup} 
                            addIngredient={handleAddIngredient} 
                            ingredients={ingredients}
                            types={types}
                            // Pass other necessary props like ingredients, types
                        />
                    )}

                </div>


        
                
    </div>
    </div>
    <div className="ptwo-btns">
                    
    <Button buttonStyle="btn--outlinex" onClick={handleUpdate}>Update Recipe</Button>
    <Button buttonStyle="btn--outlinex" onClick={() => navigate(-1)}>Cancel</Button>
    </div>
    </div>
    </div>
    
    </div>
  );
}

export default URecipe;
