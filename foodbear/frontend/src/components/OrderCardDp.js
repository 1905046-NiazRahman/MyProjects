import React, { useState, useEffect } from "react";

export default function FoodCard_Restaurant(props) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  //fetching all foods
  const [foods, setFoods] = useState([]);
  const fetchFoods = async () => {
    let response = await fetch("http://localhost:4010/api/order/user/foods", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    setFoods(response);
    console.log(foods);
  };

  //fetching restaurant
  const [restaurant, setRestaurant] = useState([]);
  const fetchRestaurants = async () => {
    let response = await fetch(
      `http://localhost:4010/api/restaurant/${props.restaurant_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    setRestaurant(response);
  };

  //fetching user
  const [user, setUser] = useState([]);
  const fetchUser = async () => {
    let response = await fetch(
      `http://localhost:4010/api/user/${props.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    setUser(response);
  };

  useEffect(() => {
    fetchFoods();
    fetchRestaurants();
    fetchUser();
  }, []);

  const handlePickup = async () => {
    let response = await fetch(
      `http://localhost:4010/api/order/deliveryperson/orders/pickeduporder/${props._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    setTimeout(() => {
        window.location.reload("http://localhost:3000/deliveryperson/dashboard");
      }, 1000); // 1000 milliseconds (1 second) delay
  };

  const handleDeliver = async () => {
    let response = await fetch(
      `http://localhost:4010/api/order/deliveryperson/orders/deliveredorder/${props._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    
    setTimeout(() => {
        window.location.reload("http://localhost:3000/deliveryperson/dashboard");
      }, 1000); // 1000 milliseconds (1 second) delay
  };

  const cardStyle = {
    width: "100%",
    height: "100%",
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    transition: "transform 0.1s ease-in-out",
  };

  const buttonStyle = {
    backgroundColor: '#ffc107', // Default background color
    color: '#212529', // Default text color
    transition: 'background-color 0.3s, color 0.3s', // Transition effect
  
    // Hover effect
    ':hover': {
      backgroundColor: 'red', // Success green background color
      color: '#fff', // White text color
    }
  };

  return (
    <div
      className="card mt-3"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="card-body"
        style={{
          boxShadow: "0px 4px 8px rgba(1, 1, 1, 0.2)",
          marginBottom: "0px",
        }}
      >
        <div className="row">
          <div className="col-6">
            <h5>
              <u>Ordered Foods</u>
            </h5>
            {foods.map((food) => {
              const orderedFood = props.food_items.find(
                (food_item) => food_item.food_id === food._id
              );

              if (orderedFood) {
                const subtotal = props.total_price;

                return (
                  <div className="row">
                    <div className="col-6">&bull; {food.name}</div>
                    <div className="col-2">X{orderedFood.quantity}</div>
                    <div className="col-4">Tk {subtotal}</div>
                  </div>
                );
              }
              return null;
            })}
            <h6 className="mt-4">Total: Tk {props.total_price}</h6>
            {
              props.payment_method === "card" ? (
                <p style={{ fontSize: "1rem", marginBottom: "0px" , marginTop: "-5px" }}>
                  Paid With Card
                </p>
              ) : (
                <p style={{ fontSize: "1rem", marginBottom: "0px" , marginTop: "-5px"}}>
                  Cash on Delivery
                </p>
              )
            }
            <p style={{ fontSize: "0.8rem", marginBottom: "0px" , marginTop: "10px"}}>
              {new Date(props.date).toLocaleString()}
            </p>
          </div>

          <div className="col-3">
            <div>
              <h5 className="mb-1">
                <u>Pick Up Address</u>
              </h5>
              <p style={{ fontSize: "1.1rem" }}>{restaurant.name}</p>
              <p style={{ fontSize: "0.8rem", marginBottom: "0px" }}>
                Address: {restaurant.location}
                <br />
                Contact: {restaurant.contact}
              </p>
            </div>
          </div>

          <div className="col-3">
            <div>
              <h5 className="mb-1">
                <u>Delivery Address</u>
              </h5>
              <p style={{ fontSize: "1.1rem" }}>{user.name}</p>
              <p style={{ fontSize: "0.8rem", marginBottom: "0px" }}>
                Address: {user.location}
                <br />
                Contact: {user.contact}
              </p>

              {props.status === "confirmed" && (
                <div className="d-flex flex-row justify-content-left mt-3">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handlePickup()}
                    //style={buttonStyle}
                  >
                    Pickup Order
                  </button>
                </div>
              )}

              {props.status === "picked_up" && (
                <div className="d-flex flex-row justify-content-left mt-3">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleDeliver()}
                    //style={buttonStyle}
                  >
                    Deliver Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
