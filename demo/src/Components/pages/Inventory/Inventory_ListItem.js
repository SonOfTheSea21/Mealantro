import React, { useState } from "react";
import CartAmountToggle from "./CartAmountToggle";
import { FaTrash } from "react-icons/fa";
import './Inventory_List.css';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

const Inventory_ListItem = ({ user_id, ingredient_id, category_name, amount, amount_type, expiration_date, fetchInventory, amountTypes }) => {

  const updateAmount = async (newAmount) => {
    try {
      const response = await fetch(`http://localhost:5000/ingredients/inventory/update_amount/${user_id}/${ingredient_id}`, {
        method: 'PUT', // or 'PUT' if your backend requires
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: newAmount }),
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

  const updateAmountType = async (newType) => {
    try {
      const response = await fetch(`http://localhost:5000/ingredients/inventory/update_amount_type/${user_id}/${ingredient_id}`, {
        method: 'PUT', // or 'PUT' if your backend requires
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amountType: newType }),
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

  const removeItem = async () => {
    try {
      const response = await fetch(`http://localhost:5000/ingredients/inventory/remove/${user_id}/${ingredient_id}`, {
        method: 'DELETE', // Assuming your backend uses DELETE to remove items
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful removal here
      console.log("Removal successful");

        fetchInventory();

    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  // const setDecrease = () => {
  //   amount > 1 ? setAmounts(amount - 1) : setAmounts(1);
  // };

  // const setIncrease = () => {
  //   amount < stock ? setAmounts(amount + 1) : setAmounts(stock);
  // };

  return (
    <div className="cart_heading grid grid-five-column">
      
        <div>
          <p>{category_name}</p>
          
        
      </div>
      {/* price   */}
      

      {/* Quantity  */}
      <CartAmountToggle
        amount={amount}
        setDecrease={() => updateAmount(amount - 1)}
        setIncrease={() => updateAmount(amount + 1)}
      />

      {/* //Subtotal */}
      <div>
        <select style={{ fontSize: '1.2rem', padding: '10px' }} value={amount_type} onChange={(e) => updateAmountType(e.target.value)}>
          {amountTypes.map((type, index) => (
            <option key={index} value={type.amount_name}>{type.amount_name}</option>
          ))}
        </select>
      </div>

      <div className="cart-hide">
        <p>
          {formatDate(expiration_date)}
        </p>
      </div>

      <div>
        <FaTrash className="remove_icon"  onClick={removeItem} />
      </div>
    </div>
  );
};

export default Inventory_ListItem;
