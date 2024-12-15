import React, { useEffect } from "react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";


export const RestaurantCard =(props)=> {
  const handleClick = (e) => {
    localStorage.setItem("restaurant_id", props._id);
    console.log(props._id);
    window.location.href = "/user/restaurant/foods";
  };

  // For hover effect
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (props.is_open) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Define styles based on is_open
  const cardStyle = {
    width: "16rem",
    maxHeight: "360px",
    transform: isHovered && props.is_open ? "scale(1.05)" : "scale(1)",
    transition: "transform 0.1s ease-in-out",
    cursor: isHovered && props.is_open ? "pointer" : "default",
  };

  // Conditionally handle the onClick function
  const handleCardClick = (e) => {
    if (props.is_open) {
      handleClick(e);
    }
  };

  const [orderCount,setOrderCount] = useState(0)

  const fetchOrdersForRestaurant = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4010/api/order/restaurant/orders/${props._id}`
      );
      const orders = response.data;
      console.log("order len : ",orders.length)
      setOrderCount(orders.length)
    } catch (error) {
      console.error("Error fetching orders:", error);
      return 0; // Return 0 if there's an error
    }
  };

  useEffect(()=>{
    fetchOrdersForRestaurant()
  })



  return (
    <div>
      <div
        className="card mt-2"
        style={cardStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <img
          src={props.img}
          className="card-img-top"
          alt="..."
          style={{
            maxHeight: "140px",
            objectFit: "cover",
            filter: props.is_open ? "none" : "blur(2px)",
          }}
        />
        <div className="card-body">
          <div className="d-flex flex-row justify-content-between">
            <h6 className="card-title">{props.name}</h6>
            <div style={{ fontSize: "16px", color: "#ff8a00" }}>
              &#9733;{props.averageRating.toFixed(1)}
            </div>
          </div>
          <p className="card-text text-muted fs-10">{props.location}</p>
          <div className="d-flex justify-content-between"> {/* Add a parent div for flex layout */}
            <p className="card-text text-muted fs-10">{orderCount>=10?"10+":orderCount}</p> {/* Display food count */}
            <p className="card-text text-muted fs-10">{props.distance.toFixed(2)}km away</p> {/* Display distance */}
          </div>

        </div>
      </div>
    </div>
  );
}
