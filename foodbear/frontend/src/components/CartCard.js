import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Example: Import the trash icon
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export const CartCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    width: "100%",
    maxHeight: "150px",
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    transition: "transform 0.1s ease-in-out",
  };

  //fetching food
  const [food, setFood] = useState([]);

  const fetchData = async () => {
    try {
      console.log("here");
      const response = await axios.get(
        `http://localhost:4010/api/order/user/food/${props.id}`
      );
      console.log(response.data);
      setFood(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [restaurant, setRestaurant] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchRestaurant = async () => {
    try {
      const restaurant_id = localStorage.getItem("restaurant_id");
      const response = await axios.get(
        `http://localhost:4010/api/restaurant/homekitchen/${restaurant_id}`
      );
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchData();
  }, []);

  const [time, setSelectedTime] = useState("");
  const [day, setSelectedDay] = useState("");

  const handleSave = () => {
    // Check if the selected day is in the range of available days
    if (!props.daysOfWeek.includes(day)) {
      alert("The selected day is not available. Please choose another day.");
      return;
    }
  
    // Check if the selected time is in the range of available times
    const selectedTimeInMinutes = convertTimeToMinutes(time);
    const startTimeInMinutes = convertTimeToMinutes(props.startTime);
    const endTimeInMinutes = convertTimeToMinutes(props.endTime);
  
    if (selectedTimeInMinutes < startTimeInMinutes || selectedTimeInMinutes > endTimeInMinutes) {
      alert("The selected time is not available. Please choose another time.");
      return;
    }
    alert(`Selected day: ${day}, Selected time: ${time}`);
    props.setSelectedDay(day);
    props.setSelectedTime(time);
    handleClose();
    // If the selected day and time are valid, perform an action
    // For example, you could send the selected day and time to a server
  };

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div
      className="card mt-3"
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            <img
              src={food.img}
              alt="..."
              style={{
                height: "146px",
                width: "150px",
                margin: "-15px 0px 0px -15px",
                borderRadius: "5px",
              }}
            />
          </div>
          <div className="col-4" style={{ margin: "0px 0px 0px -30px" }}>
            <h5 className="card-title">{props.name}</h5>
            <p className="card-text"> {props.type} </p>

            {restaurant && restaurant.is_homekitchen && (
              <button
                className="btn btn-md float-end"
                style={{
                  backgroundColor: "#ff8a00",
                  color: "white",
                  marginRight: "4rem",
                  marginTop: ".8rem",
                }}
                onClick={handleShow}
              >
                Schedule
              </button>
            )}
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Select a time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Available from {props.startTime} to {props.endTime}
              </p>
              <p>Minimum order: {props.minOrder}</p>
              <p>Available days: {props.daysOfWeek.join(", ")}</p>
              <form>
                <label for="appt-time">Choose a time:</label>
                <br />
                <input
                  type="time"
                  id="appt-time"
                  name="appt-time"
                  required
                  style={{ padding: "1px" }}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />

                <select
                  id="appt-day"
                  name="appt-day"
                  required
                  style={{ marginLeft: "14px", padding: "4px" }}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option value="">--Select a day--</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="col-4" style={{ margin: "0px 0px 0px 0px" }}>
            <p className="card-text text-right">Quantity : {props.quantity}</p>
            <p className="card-text text-right" style={{ marginTop: "-10px" }}>
              BDT {props.price * props.quantity}
              <br />
            </p>

            <div className="text-right" style={{ marginTop: "30px" }}>
              <button
                className="btn btn-sm mx-2"
                style={{
                  backgroundColor: "#ff8a00",
                  fontSize: "15px",
                  fontWeight: "bold",
                  padding: "4px 10px",
                  borderRadius: "2px",
                }}
                onClick={() =>
                  props.handleIncreaseQuantity(
                    props.id,
                    localStorage.getItem("user_id")
                  )
                }
              >
                +
              </button>
              <button
                className="btn btn-sm mx-2"
                style={{
                  backgroundColor: "#ff8a00",
                  fontSize: "20px",
                  fontWeight: "bold",
                  padding: "0px 9px",
                  borderRadius: "2px",
                }}
                onClick={() =>
                  props.handleDecreaseQuantity(
                    props.id,
                    localStorage.getItem("user_id")
                  )
                }
              >
                -
              </button>

              <button
                className="btn btn-sm"
                style={{ backgroundColor: "transparent", border: "none" }}
                onClick={() => {
                  props.handleDeleteQuantity(
                    props.id,
                    localStorage.getItem("user_id")
                  );
                  props.handleVoucherRemove();
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  color="white"
                  size="lg"
                  style={{
                    backgroundColor: "#ff8a00",
                    padding: "7px",
                    borderRadius: "2px",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
