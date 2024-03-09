import React, { useEffect } from 'react';
import { useState } from 'react';
import './Recipe_Page.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faFlag } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';


function Recipe_Page( {id, rid} ) {
  
    const [recipe, setRecipe] = useState({});
    // Initialize ingredients, conditions, and categories as arrays
    const [ingredients, setIngredients] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const averageRating = recipe.rating;

    const idv = id.value;

    

    useEffect(() => {
        fetchUserData();
        checkIfRecipeIsSaved();
    }, [rid]);

    const checkIfRecipeIsSaved = async () => {
        // Implement the logic to check if the user has saved this recipe before
        // For example:
        try {
            const response = await fetch(`http://localhost:5000/profile/checkSavedRecipe/${idv}/${rid}`);
            if (!response.ok) throw new Error('Failed to fetch saved status');
            const data = await response.json();
            setIsSaved(data.isSaved);
        } catch (error) {
            console.error('Error fetching saved status:', error);
        }
    };

    const toggleSaveRecipe = async () => {
        // Logic to either insert or delete the recipe from the user's saved list
        const url = isSaved ? `http://localhost:5000/profile/deleteSavedRecipe/${idv}/${rid}` : `http://localhost:5000/profile/insertSavedRecipe/${idv}/${rid}`;
        try {
            const response = await fetch(url, {
                method: isSaved ? 'DELETE' : 'POST',
            });
            if (!response.ok) throw new Error('Failed to toggle save');
            setIsSaved(!isSaved); // Toggle the saved status on successful operation
        } catch (error) {
            console.error('Error toggling saved status:', error);
        }
    };

    useEffect(() => {
        const fetchRating = async () => {
          try {
            const response = await fetch(`http://localhost:5000/profile/foodrating/${idv}/${rid}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.rating !== null) {
                // User has rated, set the rating
                setUserRating(data.rating);
            }

          } catch (error) {
            console.error('Error fetching social standing data:', error);
          }
        };
        fetchRating();

        
      }, [idv, rid]);


      const fetchUserData = async () => {
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
            setRecipe(data[0].data[0]);
            setIngredients(data[1].data);
            setCategories(data[2].data);
            setConditions(data[3].data);
        }).catch(error => {
            console.error('Error fetching recipe data:', error);
        });
    };

    console.log(recipe.user_id);
    console.log(idv);

    const handleRating = async (rating) => {

        console.log(userRating);
        
        if (userRating === 0 || userRating === undefined) {
            try {
                const response = await fetch(`http://localhost:5000/profile/insertfoodrating/${idv}/${rid}`, {
                  method: 'POST', // or 'PUT' if your backend requires
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ rating: rating }),
                });

                console.log('Hola');
          
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
          
                // Handle successful update here, e.g., refresh data or show feedback
                console.log("Insert successful");
          

              } catch (error) {
                console.error('Error updating amount:', error);
              }
        } else {
            try {
                const response = await fetch(`http://localhost:5000/profile/updatefoodrating/${idv}/${rid}`, {
                  method: 'PUT', // or 'PUT' if your backend requires
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ rating: rating }),
                });
          
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
          
                // Handle successful update here, e.g., refresh data or show feedback
                console.log("Update successful");

              } catch (error) {
                console.error('Error updating amount:', error);
              }
        }

        setUserRating(rating);

        fetchUserData();
        // Update the rating in your database
        console.log(`User rated ${rating} stars.`);
      };

    let halalHaramValue = recipe.halalharam; // This might come from somewhere else and could be undefined

// Ensure it's a string and check it's not empty
halalHaramValue = String(halalHaramValue);

if (halalHaramValue) {
    halalHaramValue = halalHaramValue.charAt(0).toUpperCase() + halalHaramValue.slice(1);
}

const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/recipes/delete/${rid}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete recipe.');
      window.location.href = `http://localhost:3000/Home/${idv}`; // Navigate to the homepage or wherever you wish
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleNav = () => {
    window.location.href = `http://localhost:3000/Edit_Recipe/${idv}/${rid}`;
  }

    const handleError = (e) => {
        e.target.src = '/images/asd.png';
    };

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportText, setReportText] = useState('');

    // Existing functions...

    const toggleReportModal = () => setShowReportModal(!showReportModal);

    const handleReportChange = (e) => {
        setReportText(e.target.value);
    };

    const submitReport = async () => {
        // Logic to submit the report to the backend
        // Replace this URL with your actual endpoint
        const url = `http://localhost:5000/recipes/submitreport`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reportText, recipeId: rid, userId: idv }),
            });
            if (!response.ok) throw new Error('Failed to submit report');
            // Handle success, such as closing the modal and clearing the form
            setShowReportModal(false);
            setReportText('');
            alert('Report submitted successfully');
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };


  return (
    <div className="recipe-page">
    <div className="photo-container">
    <button className="save-btn" onClick={toggleSaveRecipe} >
    <FontAwesomeIcon icon={isSaved ? faHeartSolid : faHeartRegular} />
                </button>
      <img src={`http://localhost:5000/recipes/image/${recipe.fr_id}`} alt={recipe.food_name} className="recipe-photo" onError={handleError}/>
      
    </div>
    <h2 className="h2-item">{recipe.food_name}</h2>
    <div className="recipe-details">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
      <span style={{ color: '#EE4E34', marginBottom: '5px' }}>Rating:</span>
      <div style={{ display: 'flex', flexDirection: 'row' }}> {/* Container for stars */}
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{
              cursor: 'pointer',
              color: (hoverRating > index || userRating > index) ? '#DAA520' : '#ccc',
              marginRight: '2px',
              textShadow: '0 0 2px black',
              fontSize: '24px'
            }}
            onClick={() => handleRating(index + 1)}
            onMouseEnter={() => setHoverRating(index + 1)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
      </div>
      <span style={{ marginTop: '5px' }}>{averageRating}</span>
    </div>


    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
  <span style={{ color: '#EE4E34' }}>Halal/Haram:</span>
  <span>{halalHaramValue}</span>
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
  <span style={{ color: '#EE4E34' }}>Servings:</span>
  <span>{recipe.servings}</span>
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
  <span style={{ color: '#EE4E34' }}>Preparation Time:</span>
  <span>{recipe.preparation_time} mins</span>
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
  <span style={{ color: '#EE4E34' }}>Cooking Time:</span>
  <span>{recipe.cooking_time} mins</span>
</div>

    </div>
    <div className="cuisine-section">
      <h3 className="h-item">Cuisine</h3>
      <p className="p-item">{recipe.cuisine_name}</p>
    </div>
    <div className="meals-section">
        <h3 className="h-item">Meals</h3>
        <ul className="ul-item">
            {categories.map((category, index) => (
                <li className="list-item" key={index}>{`${category.category_name}`}</li>
            ))}
        </ul>
    </div>
    <div className="ingredients-section">
        <h3 className="h-item">Ingredients</h3>
        <ul className="ul-item">
            {ingredients.map((ingredient, index) => (
                <li className="list-item" key={index}>{`${ingredient.amount} ${ingredient.amount_type} ${ingredient.ingredient_name}`}</li>
            ))}
        </ul>
    </div>
    <div className="directions-section">
      <h3 className="h-item">Directions</h3>
      <p className="p-item">{recipe.directions}</p>
    </div>
    <div className="conditions-section">
        <h3 className="h-item">Conditions</h3>
        <ul className="ul-item">
            {conditions.map((condition, index) => (
                <li className="list-item" key={index}>{`${condition.name}`}</li>
            ))}
        </ul>
    </div>
    {recipe.Video_Tutorial_Link && (
      <div className="video-tutorial">
        <h3 className="h-item">Video Tutorial</h3>
        <a href={recipe.video_tutorial_link} target="_blank" rel="noopener noreferrer">Watch Here</a>
      </div>
    )}

{(recipe.user_id === idv || idv.startsWith('A')) && ( // Check if the user ID matches
        <div className="two_btns">
          <Button buttonStyle='btn--outlinex' link={`/Edit_Recipe/${idv}/${recipe.food_name}`} stat={{ rid: recipe.fr_id}}>
Edit Recipe</Button>
          <Button buttonStyle='btn--outlinex' onClick={handleDelete}>Delete Recipe</Button>
        </div>)}

        {(recipe.user_id !== idv && !idv.startsWith('A')) && (
  <>
    <button className="report-btn" onClick={toggleReportModal}>
      <FontAwesomeIcon icon={faFlag} /> Report
    </button>

    {showReportModal && (
      <div className="report-modal">
        <textarea value={reportText} onChange={handleReportChange} placeholder="Describe your grievance here..." />
        <div className="report-modal-actions">
          <button onClick={submitReport}>Submit</button>
          <button onClick={toggleReportModal}>Cancel</button>
        </div>
      </div>
    )}
  </>
)}


  </div>

  );
}

export default Recipe_Page;


