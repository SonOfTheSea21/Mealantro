import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from "styled-components";
import Inventory_ListItem from './Inventory_ListItem';
import './Inventory_List.css';
import { Button } from '../../Button';
import AddPopup from './AddPopup';
import CartTimeToggle from './CartTimeToggle';
import { useNavigate } from 'react-router-dom';


function Inventory_List (props) {
    const [inventory, setInventory] = useState([]);
    
    const [ingredients, setIngredients] = useState([]);

    const [types, setTypes] = useState([]);

    const [isPopupOpen, setPopupOpen] = useState(false);

    const [time, setTime] = useState(0);

    const id = props.id.value;
    const navigate = useNavigate();
    

    const fetchInventory = async () => {
      // URLs for fetching data
    const inventoryUrl = `http://localhost:5000/ingredients/inventory/${id}`;
    const ingredientsUrl = `http://localhost:5000/ingredients/all/${id}`;
    const typesUrl = `http://localhost:5000/ingredients/types/${id}`;
    const timeUrl = `http://localhost:5000/ingredients/inventory/time/${id}`;

    Promise.all([
        fetch(inventoryUrl),
        fetch(ingredientsUrl),
        fetch(typesUrl),
        fetch(timeUrl)
    ]).then(async (responses) => {
        // Check if all responses are ok (status in the range 200-299)
        if (!responses.every(response => response.ok)) {
            // This will catch the first not-ok response and throw an error
            const notOkResponse = responses.find(response => !response.ok);
            throw new Error(`HTTP error! Status: ${notOkResponse.status}`);
        }

        // Parsing the JSON for each response
        const data = await Promise.all(responses.map(response => response.json()));

        // Assuming the data for each URL is structured as expected
        setInventory(data[0].data);
        setIngredients(data[1].data);
        setTypes(data[2].data);
        setTime(data[3].data[0].i_time);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
    };

    useEffect(() => {
      
      fetchInventory();

  }, [id]); // Dependency array, effect will re-run if `id` changes
  



    console.log(inventory);
    console.log(ingredients);
    console.log(types);
    console.log(time);

    const handleAdd = async () => {
      setPopupOpen(true); // Open the popup
    };
  
    const closePopup = () => {
      setPopupOpen(false); // Close the popup
    };

    
    const clearCart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/ingredients/inventory/clear/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchInventory();
      } catch (error) {
        console.error('Error clearing inventory:', error);
      }
    };

    const updateTime = async (newTime) => {
      try {
        const response = await fetch(`http://localhost:5000/ingredients/inventory/update_time/${id}`, {
          method: 'PUT', // or 'PUT' if your backend requires
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ time: newTime }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        // Handle successful update here, e.g., refresh data or show feedback
        console.log("Update successful");
  
          fetchInventory();
  
  
      } catch (error) {
        console.error('Error updating amount:', error);
      }
    };

    const handleSearch = async () => {
      window.location.href = `http://localhost:3000/Recommended/${id}`;
      
    }
    

  
    if (inventory.length === 0) {
      return (
        <div>
          <h1 className="boldAndUnderlined">My Inventory</h1>
        <EmptyDiv>
          <h3>No item in Inventory </h3>
        </EmptyDiv>
        <div className="cart-two-button">
              <Button buttonStyle='btn--outlinex' onClick={handleAdd}> Add Ingredient </Button>
          </div>
          <AddPopup isOpen={isPopupOpen} ingredients={ingredients} fetchInventory={fetchInventory} types={types} closePopup={closePopup} id={id} />
        </div>
      );
    }
  
    return (
        <div>
        <h1 className="boldAndUnderlined">My Inventory</h1>
        <div className="icontainer">
          <div className="cart_table">
          <div className="cart_heading grid">
            <p>Ingredient</p>
            <p>Amount</p>
            <p>Amount Type</p>
            <p>Expiration Date</p>
            <p>Remove</p>
          </div>

          <div className="cart-item">
            {inventory.map((curElem) => {
              return <Inventory_ListItem key = {curElem.user_id} fetchInventory={fetchInventory} amountTypes={types} {...curElem} />;
            })}
          </div>

          </div>
        </div>
        <div className="time">
        <p>Usable Time: </p>
        <CartTimeToggle
        time={time}
        setDecreaset={() => updateTime(time - 1)}
        setIncreaset={() => updateTime(time + 1)}
      />
      <p>Mins </p>
        </div>
        <div className="search-button">
        <Button buttonStyle='btn--outliney' buttonSize='btn--larger' onClick={handleSearch}> Search for Recipes </Button>
        </div>
        <div className="cart-two-button">
              <Button buttonStyle='btn--outlinex' onClick={handleAdd}> Add Ingredient </Button>
            <Button buttonStyle='btn--outlinex' onClick={clearCart}>
              Clear Inventory
            </Button>
          </div>
          <AddPopup isOpen={isPopupOpen} ingredients={ingredients} fetchInventory={fetchInventory} types={types} closePopup={closePopup} id={id} />
      </div>
    );
  }
  
  const EmptyDiv = styled.div`
    display: grid;
    place-items: center;
    height: 50vh;
  
    h3 {
      font-size: 4.2rem;
      text-transform: capitalize;
      font-weight: 300;
    }
  `;
  
  
  
  export default Inventory_List;
  