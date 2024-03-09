import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const CartTimeToggle = ({ time, setDecreaset, setIncreaset }) => {
  return (
    <div className="cart-button">
      <div className="amount-toggle">
        <button onClick={() => setDecreaset()}>
          <FaMinus />
        </button>
        <div className="amount-style">{time}</div>
        <button onClick={() => setIncreaset()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default CartTimeToggle;
