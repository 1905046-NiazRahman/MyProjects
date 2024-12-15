import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";

export default function FoodCard_Restaurant(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [dpName, setDpName] = useState("");

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
    fetchUser();
  }, []);

  const handleReject = async () => {
    setPreorderAccepted(false);
    let response = await fetch(
      `http://localhost:4010/api/order/restaurant/deleteorder/${props._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    setTimeout(() => {
      window.location.reload("http://localhost:3000/restaurant/dashboard");
    }, 1000); // 1000 milliseconds (1 second) delay
  };

  //Handle accept

  const [deliverypersons, setDeliverypersons] = useState([]);
  const fetchDeliverypersons = async () => {
    let response = await fetch(
      "http://localhost:4010/api/deliveryperson/dashboard",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    setDeliverypersons(response);
    console.log(deliverypersons);
  };

  const [restaurant, setRestaurant] = useState([]);
  const fetchRestaurant = async () => {
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
    localStorage.setItem("homekitchen", response.is_homekitchen);
    setRestaurant(response);
  };

  useEffect(() => {
    fetchDeliverypersons();
    fetchRestaurant();
  }, []);

  const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };

  const calculateDistance = (point1, point2) => {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(point2.latitude - point1.latitude);
    const dLon = degreesToRadians(point2.longitude - point1.longitude);

    const lat1 = degreesToRadians(point1.latitude);
    const lat2 = degreesToRadians(point2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    console.log("radius " + earthRadiusKm * c);
    return earthRadiusKm * c; // Distance in kilometers
  };

  const [specificOrder, setSpecificOrder] = useState(null);

  useEffect(() => {
    const fetchSpecificOrder = async () => {
      const response = await axios.get(
        `http://localhost:4010/api/homekitchen/getorder/${props._id}`
      );
      setSpecificOrder(response.data);
      console.log("order vai order");
    };
    fetchSpecificOrder();
  }, []);

  const handleAccept = async () => {
    let dp_id = "";
    setPreorderAccepted(false);

    const eligibleDeliveryPersons = deliverypersons.filter((deliveryperson) => {
      const distance = calculateDistance(
        {
          latitude: deliveryperson.latitude,
          longitude: deliveryperson.longitude,
        },
        {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
        }
      );
      return distance <= 3 && deliveryperson.is_available;
    });

    if (eligibleDeliveryPersons.length > 0) {
      const selectedDeliveryPerson = eligibleDeliveryPersons[0];

      // Post the location of the selected delivery person
      axios
        .post("http://localhost:4010/api/distance/currentDp/setLocation", {
          dpLat: selectedDeliveryPerson.latitude,
          dpLng: selectedDeliveryPerson.longitude,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error posting location data", error);
        });

      dp_id = selectedDeliveryPerson._id;
      setShowModal(true);
      setDpName(selectedDeliveryPerson.name);
    } else {
      // If no eligible delivery person found, show modal with message
      setShowModal(true);
      setDpName("No Delivery Person Found");
    }

    // deliverypersons.map((deliveryperson) => {
    //   if (deliveryperson.location === restaurant.location && deliveryperson.is_available === true) {
    //     dp_id = deliveryperson._id;
    //   }
    // });
    // console.log("props.res", restaurant._id);

    let response = await fetch(
      `http://localhost:4010/api/order/restaurant/orders/confirmorder/${props._id}/${dp_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    setTimeout(() => {
      window.location.reload("http://localhost:3000/restaurant/dashboard");
    }, 1000); // 1000 milliseconds (1 second) delay
  };

  const [showPreorderButton, setShowPreorderButton] = useState(false);
  const [preorderAccepted, setPreorderAccepted] = useState(
    localStorage.getItem("preorderAccepted") === "true"
  );

  useEffect(() => {
    // Save the preorderAccepted state to localStorage
    localStorage.setItem("preorderAccepted", preorderAccepted);
  }, [preorderAccepted]);

  const handlePreorder = async () => {
    let response = await axios.put(
      `http://localhost:4010/api/homekitchen/acceptpreorder/${props._id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.status, "predorder er");

    if (response.status === 200) {
      console.log("Preorder accepted");
      setPreorderAccepted(true);
    }
  };

  useEffect(() => {
    if (
      restaurant.is_homekitchen &&
      specificOrder.selectedTime &&
      specificOrder.selectedDay
    ) {
      const checkOrderTime = () => {
        const currentTime = new Date();
        const [hours, minutes] = specificOrder.selectedTime
          .split(":")
          .map(Number);
        const orderTime = new Date();
        orderTime.setHours(hours, minutes, 0, 0);

        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const currentDay = days[currentTime.getDay()];

        if (
          specificOrder.selectedDay !== currentDay ||
          currentTime < orderTime
        ) {
          setShowPreorderButton(true);
        } else {
          setShowPreorderButton(false);
        }
      };

      checkOrderTime(); // Check immediately when the component mounts

      const intervalId = setInterval(checkOrderTime, 1000); // Then check every second

      return () => clearInterval(intervalId); // Clean up on component unmount
    }
  }, [restaurant.is_homekitchen]); // Re-run the effect when restaurant.home_kitchen changes

  const cardStyle = {
    width: "100%",
    height: "100%",
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    transition: "transform 0.1s ease-in-out",
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
          <div className="col-8">
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
            <p style={{ fontSize: "0.8rem", marginBottom: "0px" }}>
              {new Date(props.date).toLocaleString()}
            </p>
          </div>

          <div className="col-4">
            <div>
              <h5 className="mb-1">
                <u>Customer</u>
              </h5>
              <p style={{ fontSize: "1.1rem" }}>{user.name}</p>
              <p style={{ fontSize: "0.8rem", marginBottom: "0px" }}>
                Address: {user.location}
                <br />
                Contact: {user.contact}
              </p>

              <div
                className="d-flex flex-row justify-content-left mt-4"
                style={{ alignItems: "center", marginBottom: "0px" }}
              >
                {props.status === "confirmed" && (
                  <h5>
                    <span
                      className="badge bg-success text-white badge-lg"
                      style={{ alignSelf: "flex-start" }}
                    >
                      Cooking
                    </span>
                  </h5>
                )}
                {props.status === "picked_up" && (
                  <h5>
                    <span
                      className="badge bg-warning text-white badge-lg"
                      style={{ alignSelf: "flex-start" }}
                    >
                      On The Way
                    </span>
                  </h5>
                )}
              </div>
            </div>
          </div>

          {(props.status === "pending" || props.status === "preordered") && (
            <div className="d-flex flex-row justify-content-end mt-2">
              <button
                className="btn btn-outline-danger btn-sm me-4"
                onClick={() => handleReject()}
              >
                Reject
              </button>
              {showPreorderButton ? (
                preorderAccepted ? (
                  <h5>
                    <span
                      className="badge bg-warning text-white badge-lg"
                      style={{ alignSelf: "flex-start" }}
                    >
                      Preorder Accepted
                    </span>

                    <br />

                    <span
                      className="badge bg-info text-white badge-lg"
                      style={{ alignSelf: "flex-start", marginTop: "5px",marginLeft:"5px" }}
                    >
                        {props.selectedDay} at {props.selectedTime}
                    </span>
                  </h5>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handlePreorder()}
                  >
                    Accept Preorder
                  </button>
                )
              ) : (
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleAccept()}
                >
                  Start Cooking
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* dp_modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Person Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Delivery Person Name: {dpName}</p>
          {/* Add more information about the assigned delivery person here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* dp modal */}
    </div>
  );
}
