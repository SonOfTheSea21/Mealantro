import React, { useState } from 'react'; // Make sure to import useState
import './Popup.css';

function Popup({ isOpen, closePopup, ingredients, types, addIngredient }) { // Removed `id` if it's not used
  const [selectedTier4, setSelectedTier4] = useState('');
  const [selectedTier3, setSelectedTier3] = useState(false);
  const [selectedTier2, setSelectedTier2] = useState(false);
  const [selectedTier1, setSelectedTier1] = useState(false);
  const [amount, setAmount] = useState('');
  const [amount_type, setAmountType] = useState('');
  const [ingredient_name, setName] = useState('');
  const [density, setDensity] = useState('');

  const handleClosePopup = () => {
    // Reset all selections and states
    setSelectedTier4('');
    setSelectedTier3(false);
    setSelectedTier2(false);
    setSelectedTier1(false);
    setName('');
    setAmount('');
    setAmountType('');
    setDensity('');
    // Close the popup
    closePopup();
  };

  const handleAddIngredient = async () => {
    // Example payload preparation
    let ingredientId = selectedTier4;
  if (selectedTier3 && tier3Ingredients.length > 0) {
    ingredientId = selectedTier3;
  }
  if (selectedTier2 && tier2Ingredients.length > 0) {
    ingredientId = selectedTier2;
  }
  if (selectedTier1) {
    ingredientId = selectedTier1; // Assuming tier1 is the final tier
  }

  const newIngredient = {
    ingredient_name, // You need to manage the state for selectedIngredientName based on selection
    amount,
    amount_type,
    density, // Similarly manage state for selectedIngredientDensity
    ic_id: ingredientId, // The last selected tier's IC_ID
  };
  addIngredient(newIngredient);
    
    // Close the popup after action is performed
    handleClosePopup();
  };

  if (!isOpen) return null;

  // Filter ingredients by tier using `tier` and `parent_id`
  const tier4Ingredients = ingredients.filter(ingredient => ingredient.tier === 4);
  let tier3Ingredients = [];
  let tier2Ingredients = [];
  let tier1Ingredients = [];

  if (selectedTier4) {
    tier3Ingredients = ingredients.filter(ingredient => ingredient.parent_id === Number(selectedTier4));
  }

  if (selectedTier3) {
    tier2Ingredients = ingredients.filter(ingredient => ingredient.parent_id === Number(selectedTier3));
  }

  if (selectedTier2) {
    tier1Ingredients = ingredients.filter(ingredient => ingredient.parent_id === Number(selectedTier2));
  }


  

  const isDeadEnd = !tier3Ingredients.length && selectedTier4 ||
  !tier2Ingredients.length && selectedTier3 ||
  !tier1Ingredients.length && selectedTier2 || selectedTier1;

  const canAdd = isDeadEnd && amount && amount_type && ingredient_name && density;


  return (
    <div className="ppopup-overlay" onClick={closePopup}>
      <div className="ppopup-content" onClick={e => e.stopPropagation()}>
        <h2>Add Ingredient</h2>
        
        {/* Tier 4 Dropdown */}
        <select onChange={(e) => {
          setSelectedTier4(e.target.value);
          setSelectedTier3('');
          setSelectedTier2('');
          setSelectedTier1('');
        }}>
          <option value="">Select Tier 4 Ingredient</option>
          {tier4Ingredients.map(ingredient => (
            <option key={ingredient.ic_id} value={ingredient.ic_id}>{ingredient.category_name}</option>
          ))}
        </select>

        {/* Conditional Rendering for Tier 3 Dropdown */}
        {selectedTier4 && tier3Ingredients.length > 0 && (
          <select onChange={(e) => setSelectedTier3(e.target.value)}>
            <option value="">Select Tier 3 Ingredient</option>
            {tier3Ingredients.map(ingredient => (
              <option key={ingredient.ic_id} value={ingredient.ic_id}>{ingredient.category_name}</option>
            ))}
          </select>
        )}

        {/* Conditional Rendering for Tier 2 Dropdown */}
        {selectedTier3 && tier2Ingredients.length > 0 && (
          <select onChange={(e) => setSelectedTier2(e.target.value)}>
            <option value="">Select Tier 2 Ingredient</option>
            {tier2Ingredients.map(ingredient => (
              <option key={ingredient.ic_id} value={ingredient.ic_id}>{ingredient.category_name}</option>
            ))}
          </select>
        )}

        {/* Conditional Rendering for Tier 1 Dropdown */}
        {selectedTier2 && tier1Ingredients.length > 0 && (
          <select onChange={(e) => setSelectedTier1(e.target.value)}>
            <option value="">Select Tier 1 Ingredient</option>
            {tier1Ingredients.map(ingredient => (
              <option key={ingredient.ic_id} value={ingredient.ic_id}>{ingredient.category_name}</option>
            ))}
          </select>
        )}

        {isDeadEnd && (
          <>
          <div>
              <label>Ingredient Name</label>
              <input 
                type="text" 
                value={ingredient_name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div>
              <label>Amount</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
            <div>
              <label>Amount Type</label>
              <select value={amount_type} onChange={(e) => setAmountType(e.target.value)}>
              <option value="">Select Amount Type</option>
                {types.map((type, index) => (
                    <option key={index} value={type.amount_name}>{type.amount_name}</option>
                ))}
                </select>
            </div>
            <div>
              <label>Density</label>
              <input 
                type="number" 
                value={density} 
                onChange={(e) => setDensity(e.target.value)} 
                step={0.01}
                min={0.01}
              />
            </div>

            {/* "Add" button appears after all selections are made */}
          {canAdd && <button onClick={handleAddIngredient}>Add</button>}

          </>
        )}

        <button onClick={handleClosePopup}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
