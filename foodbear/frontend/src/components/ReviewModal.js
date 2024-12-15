import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const ReviewModal = ({ show, handleClose, restaurant_id,order_id }) => {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // new state variable

  const handleReviewChange = (event) => {
    setUserReview(event.target.value);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");
    if (userReview !== "") {
        const response = await fetch(
          `http://localhost:4010/api/restaurant/review/${restaurant_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, userName, review: userReview }),
          }
        );
      }
    setIsSubmitted(true);
    await axios.post("http://localhost:4010/api/order/orderReview/addOrderReview", {
        userId: localStorage.getItem("user_id"),
        restaurantId: restaurant_id,
        orderId: order_id,
    }
    );
    
    setTimeout(() => {
      setIsSubmitted(false); // Reset the isSubmitted state
      handleClose();
    }, 2400);
    
  };

  const handleUserRating = async (rating) => {
    setUserRating(rating);

    //user will rate the restaurant
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `http://localhost:4010/api/restaurant/rating/${restaurant_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, rating: rating }),
      }
    );

    const data = await response.json();
    console.log("review er data");
    console.log(data);
  };

  const renderClickableStars = () => {
    if (userRating > 0) {
      return (
        <div>
          You rated {userRating}
          <i class="fa-solid fa-star" style={{ color: "#ff8a00" }}></i>
        </div>
      );
    }

    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= userRating ? "bi bi-star-fill" : "bi bi-star"}
          onClick={() => handleUserRating(i)}
          style={{ cursor: "pointer", color: "#ff8a00" }}
        ></i>
      );
    }
    return stars;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Give Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isSubmitted ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontWeight: "bold",
              }}
            >
              <i
                className="fa fa-check-circle"
                style={{ fontSize: "1em", color: "green" }}
              ></i>
              Thanks for your review!
            </div>
                <br/>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <p style={{ textAlign: 'center' }}>
                This review will provide valuable insights to others seeking to
                experience our service. Thank you for contributing!
              </p>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Your Rating</strong>
              </Form.Label>
              <div>{renderClickableStars()}</div>
              <br />
              <Form.Label>
                <strong>Tell others more about this restaurant</strong>
              </Form.Label>
              <Form.Control
                placeholder="Share your thoughts about the food quality, delivery experience, and overall satisfaction with our service!"
                as="textarea"
                rows={3}
                value={userReview}
                onChange={handleReviewChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: "#ff8a00",
                borderColor: "#ff8a00",
              }}
            >
              Submit
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModal;
