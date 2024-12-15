import React, { useState, useEffect } from "react";
import Navbar_Restaurant from "../../components/Navbar_Restaurant";
import { Footer } from "../../components/Footer";
import { Modal } from "react-bootstrap";
import axios from "axios";
import OrderCard_Rest from "../../components/OrderCardRes";
export const DashboardRes = () => {
  const [restaurants, setRestaurant] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4010/api/restaurant/dashboard"
      );

      setRestaurant(response.data);

      response.data.map((item, index) => {
        if (item._id === localStorage.getItem("restaurant_id")) {
          console.log(item._id);
          setIsOpen(item.is_open);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleIsOpenToggle = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4010/api/restaurant/isopen/${localStorage.getItem(
          "restaurant_id"
        )}`
      );

      if (response.status === 200) {
        setIsOpen(!isOpen); // Toggle the is_open status
        console.log("is_open status updated successfully");
      } else {
        console.log("Failed to update is_open status");
      }
    } catch (error) {
      console.error("Error updating is_open status:", error);
    }
  };

  const fetchRating = async () => {
    const desired_restaurant_id = localStorage.getItem("restaurant_id");
    console.log("restaurant id", desired_restaurant_id);

    try {
      const response = await axios.get(
        `http://localhost:4010/api/restaurant/rating/${desired_restaurant_id}`
      );
      const data = response.data;
      console.log(data);

      if (data.success) {
        setAverageRating(data.averageRating); // Update the rating in the state
      } else {
        console.error("Failed to fetch the average rating");
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const fetchReviews = async () => {
    const desired_restaurant_id = localStorage.getItem("restaurant_id");
    console.log("restaurant id", desired_restaurant_id);

    try {
      const response = await axios.get(
        `http://localhost:4010/api/restaurant/review/${desired_restaurant_id}`
      );
      const data = response.data;

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Function to render stars
  const renderStars = (averageRating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(averageRating)) {
        stars.push(
          <i className="bi bi-star-fill" style={{ color: "#ff8a00" }}></i>
        );
      } else if (i === Math.ceil(averageRating)) {
        const percentage = ((averageRating % 1) * 100).toFixed(2);
        stars.push(
          <div style={{ position: "relative", display: "inline-block" }}>
            <i className="bi bi-star" style={{ color: "#ff8a00" }}></i>
            <div
              style={{
                position: "absolute",
                overflow: "hidden",
                top: 0,
                left: 0,
                width: `${percentage}%`,
                zIndex: 1,
              }}
            >
              <i className="bi bi-star-fill" style={{ color: "#ff8a00" }}></i>
            </div>
          </div>
        );
      } else {
        stars.push(<i className="bi bi-star" style={{ color: "#ff8a00" }}></i>);
      }
    }
    return stars;
  };

  const toggleReviewModal = () => setShowReviewModal(!showReviewModal);

  useEffect(() => {
    fetchData();
    fetchRating();
    fetchReviews();
  }, []);

  //Completed orders and active orders
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const fetchCompletedOrders = async () => {
    let response = await fetch(
      `http://localhost:4010/api/order/restaurant/orders/${localStorage.getItem(
        "restaurant_id"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    response = await response.json();
    console.log("response", response);
    const complete = response.filter((order) => order.status === "delivered");
    setCompletedOrders(complete);

    const active = response.filter((order) => order.status !== "delivered");
    setActiveOrders(active);
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  //sorting orders by date
  const sortedActiveOrders = activeOrders.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const sortedCompletedOrders = completedOrders.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div>
      <div>
        {restaurants.map((item, index) => {
          if (item._id === localStorage.getItem("restaurant_id")) {
            const restaurant = item;

            return (
              <div>
                <Navbar_Restaurant />

                <img
                  key={restaurant._id}
                  src={restaurant.img}
                  alt=""
                  height="400px"
                  width="100%"
                  style={{ objectFit: "cover" }}
                />

                <div className="container">
                  <div className="container mt-3 mx-6">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <div>
                        <h2>{restaurant.name}</h2>
                        {renderStars(averageRating)}
                        <span className="ms-2">
                          {averageRating.toFixed(1)}
                        </span>{" "}
                        <br />
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm mt-2"
                          onClick={toggleReviewModal}
                        >
                          See Reviews
                        </button>
                      </div>
                      <div
                        className="form-check form-switch mt-2"
                        style={{ fontSize: "22px" }}
                      >
                        <input
                          className="form-check-input"
                          style={{
                            cursor: "pointer",
                            backgroundColor: isOpen ? "transparent" : "#ff8a00",
                          }}
                          type="checkbox"
                          id="is_open"
                          checked={!isOpen}
                          onChange={handleIsOpenToggle}
                        />
                        <label className="form-check-label" htmlFor="is_open">
                          Close Now
                        </label>
                      </div>
                    </div>

                    <table className="table table-hover mt-3">
                      <tbody>
                        <tr>
                          <th scope="row">Restaurant ID</th>
                          <td>{restaurant._id}</td>
                        </tr>
                        <tr>
                          <th scope="row">Location</th>
                          <td>{restaurant.location}</td>
                        </tr>
                        <tr>
                          <th scope="row">E-mail</th>
                          <td>{restaurant.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">Contact No.</th>
                          <td>{restaurant.contact}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Reviews Modal */}
                    <Modal show={showReviewModal} onHide={toggleReviewModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>All Reviews</Modal.Title>
                      </Modal.Header>
                      <Modal.Body
                        style={{ maxHeight: "70vh", overflowY: "auto" }}
                      >
                        {reviews.map((review, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: "white",
                              margin: "10px",
                              padding: "10px",
                              borderRadius: "5px",
                              boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.2)",
                            }}
                          >
                            <h6>
                              {" "}
                              {index + 1}. {review.username}
                            </h6>

                            <p style={{ fontSize: "15px" }}>{review.review}</p>
                            <p style={{ fontSize: "12px" }}>
                              {new Date(review.date).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </Modal.Body>
                    </Modal>

                    <div className="row lg-6">
                      {/* Active Order gula show korsi */}
                      {sortedActiveOrders.length > 0 && (
                        <div className="row lg-6">
                          <h3 className="mt-4">Active Orders</h3>
                          <hr />
                          {sortedActiveOrders.map((order) => (
                            <div
                              key={order._id}
                              className="col-12 col-md-6 col-lg-6 mb-3"
                            >
                              <OrderCard_Rest
                                _id={order._id}
                                user_id={order.user_id}
                                restaurant_id={order.restaurant_id}
                                delivery_person_id={order.delivery_person_id}
                                status={order.status}
                                food_items={order.food_items}
                                total_price={order.total_price}
                                date={order.date}
                                payment_method={order.payment_method}
                                selectedTime={order.selectedTime}
                                selectedDay={order.selectedDay}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Completed Order gula show korsi */}
                      {sortedCompletedOrders.length > 0 && (
                        <div className="row lg-6">
                          <h3 className="mt-4">Previous Orders</h3>
                          <hr />
                          {sortedCompletedOrders.map((order) => (
                            <div
                              key={order._id}
                              className="col-12 col-md-6 col-lg-6 mb-3"
                            >
                              <OrderCard_Rest
                                _id={order._id}
                                user_id={order.user_id}
                                restaurant_id={order.restaurant_id}
                                delivery_person_id={order.delivery_person_id}
                                status={order.status}
                                food_items={order.food_items}
                                total_price={order.total_price}
                                date={order.date}
                                payment_method={order.payment_method}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Footer />
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
