import React, { useState } from "react";
import axios from "axios";
import channel from "../channels/orderChannel";

const OrderForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [bags, setBags] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [error, setError] = useState(null);
  
  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:4000/api/orders", {
        order: {
          customerName: customerName,
          customerEmail: customerEmail,
          cardNumber: cardNumber,
          bags: parseInt(bags, 10),
          value: orderValue
        }
      }, 
    {headers: {
      "Content-Type": "application/json"
    }});
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to create order");
    }
  };

  const handleUpdateBags = (event) => {
    const newBags = parseInt(event.target.value, 10);
    setBags(newBags);

    channel.push("updateBags", newBags)
      .receive("ok", (resp) => {
        setOrderValue(resp.value);
      })
      .receive("error", (resp) => {
        console.error("Error updating bags", resp);
      });
  };

  return (
    <form onSubmit={handleOrderSubmit}>
      <div>
        <label>
          Customer Name:
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Customer Email:
          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Card Number:
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Bags:
          <input type="number" value={bags} onChange={handleUpdateBags} min="1" required />
        </label>
      </div>
      <div>
        <label>
          Value: {orderValue}
        </label>
      </div>
      <button type="submit">Create Order</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default OrderForm;
