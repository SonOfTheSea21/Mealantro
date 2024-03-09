import React, { useEffect } from 'react';
import { useState } from 'react';
import './Insert_Recipe.css';
import '../../../Navbar/Navbar.css';
import Multiselect from 'multiselect-react-dropdown'
import Popup from './Popup';



import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Button';
import {toast } from 'react-toastify';
import {Slide} from 'react-toastify'
import { Link } from 'react-router-dom';

const notifySuccess = () => {
    toast('Recipe Inserted Successfully!', {
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

function Insert_Recipe(props) {
  const [image, setImage] = useState("https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg")
  const [image2, setImage2] = useState("")
  const [info, setInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthdate: "",
    nationality: "",
    religion: "",
    occupation: "",
    user_photo: "",
    street_name: "",
    postal_code: "",
    city: "",
    country_name: ""
  });

  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState({
    recipename: "",
    cuisine: "",
    isHalal: false,
    preptime: "",
    cooktime: "",
    servings: "",
    foodphoto: "",
    directions: ""
  });

  const [cuisines, setCuisines] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedConditions, setSelectedConditions] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);

const [showPopup, setShowPopup] = useState(false);
const [addedIngredients, setAddedIngredients] = useState([]);

const togglePopup = () => {
  setShowPopup(!showPopup);
};

const handleAddIngredient = (newIngredient) => {
  setAddedIngredients([...addedIngredients, newIngredient]);
};


  console.log(props.id.value)
  const id = props.id.value;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setInfo(data.data[0]);
        if (data.data[0].user_photo) {
          setImage(`http://localhost:5000/profile/image/${id}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [id]);

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

  const [socialStanding,setSocialStanding] = useState(
    {
      followers : 0,
      following : 0
    }
  )
  useEffect(() => {
    const fetchSocialStanding = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/socialStanding/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSocialStanding(data.data); // Assuming the response directly contains followers and following
      } catch (error) {
        console.error('Error fetching social standing data:', error);
      }
    };
    fetchSocialStanding();
  }, [id]);

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

  
  


  function handleChange(e) {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value
    }));
  }

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: checked,
    }));
  }




  const handleAdd = async () => {
    const formData = new FormData();

    // Append recipe fields to formData
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

    console.log("Form data:", formData);

    try {
        const response = await fetch(`http://localhost:5000/recipes/insert/${id}`, {
            method: 'POST', // or 'PUT' if you're updating an existing recipe
            body: formData, // Send the FormData object
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Recipe updated successfully", data);
            notifySuccess(); // Notify the user of success
            // Additional success handling
        } else {
            throw new Error("Failed to update the recipe.");
        }

        navigate(`/Profile/${id}`, { state: { type: "ViewMode" } });
        setInfo(info)
    } catch (error) {
        console.error("Error updating recipe:", error);
        // Error handling, e.g., show notification to the user
    }
};





  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const imageUrl = URL.createObjectURL(file);
      setImage2(imageUrl);
      console.log(imageUrl);
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        foodphoto: file,
      }));
    }
  };


  return (
    <div className="pform-container">
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"></link>
      <div className="container bootstrap snippets bootdey">
        <div className="row">
          <div className="profile-nav col-md-3">
            <div className="panel">
              <div className="user-heading round">
              <a href={`/Profile/${id}`}>
                  <img 
                      width="150px"
                      src={image}
                      alt="Profile" />
                </a>
                <h1>{info.firstname +" " + info.lastname}</h1>
                {id.startsWith('A') && 
                <h3 style={{color: "black"}}>Admin</h3>
                }
                <p>Followers : { socialStanding.followers}</p>
                <p>Following : { socialStanding.following}</p>
              </div>

              <ul className="nav nav-pills nav-stacked">
              <li> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "ViewMode",
                }}
              >
                <i className="fa fa-edit"></i> Profile
                </Link>
                </li>
                <li>
                  <Link
                  to={`/Profile/${id}`}
                  state= {{ 
                    type: "Timeline",
                  }}
                >   
                <i className="fa fa-photo"></i> Timeline 
                </Link>
                </li>
                <li>
                  <Link
                  to={`/Profile/${id}`}
                  state= {{ 
                    type: "YourRecipes",
                  }}
                >   
                <i className="fa fa-photo"></i> Your Recipes
                </Link>
                </li>
                <li><Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "SavedFoods",
                }}
              >
              <i className="fa fa-calendar"></i> Saved Foods
              </Link></li>
                
                <li> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "EditMode",
                }}
              >
                <i className="fa fa-edit"></i> Edit profile
                </Link>
                </li>
                <li> <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "EditPassword",
                }}
              >
              <i class="fa fa-edit"></i> Change Password
              </Link>
              </li>

              <li className="active"> 
                <Link
                to={`/Profile/${id}`}
                state= {{ 
                  type: "InsertRecipe",
                }}
              >
              <i className="fa fa-edit"></i> Share your Recipes
              </Link>
              </li>
              
              </ul>
            </div>
          </div>
          <div className="profile-info col-md-9">
            <div className="panel">
              <div className="panel-body bio-graph-info">
                <h1>Recipe Information</h1>
                <div className="row">
                <div className="pinfo-item">
            <label>Recipe Name:</label>
            <input
                className="pupdate--section"
                type="text"
                name="recipename"
                value={recipe.recipename}
                onChange={handleChange}
              />
          </div>
          <div className="pinfo-item">
          <label>Cuisine:</label>
          <select
            className="pupdate--section"
            name="cuisine"
            onChange={handleChange} // Make sure to update handleChange to handle setting the selected cuisine
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
                onChange={handleCheckboxChange} // Create a new handler for checkbox
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                min="1" // Minimum value to prevent non-sensible values
                step="1"
              />
          </div>

          <div className="pinfo-item">
            <label>Directions:</label>
            <textarea
              name="directions"
              value={recipe.directions}
              onChange={handleChange}
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
                    displayValue="name" // Assuming your objects have a 'name' key
                    onSelect={(selectedList) => setSelectedConditions(selectedList)}
                    onRemove={(selectedList) => setSelectedConditions(selectedList)}
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
                        <p className="ingredient-detail">{`${ingredient.amount} ${ingredient.amountType} of ${ingredient.name}`}</p>
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
            <div className='rupdate-btn'>
                <Button buttonStyle='btn--test' onClick={handleAdd}>Share</Button>
            </div>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Insert_Recipe;
