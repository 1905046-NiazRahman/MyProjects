import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import GoogleMap from "../../components/Map";

export const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    location: "",
    email: "",
    password: "",
    contact: "",
    latitude:null,
    longitude:null,
  });

  const [showMapModal, setShowMapModal] = useState(false);

  const handleShowMapModal = () => setShowMapModal(true);
  const handleCloseMapModal = () => setShowMapModal(false);

  const updateLocationName = (LocationName,latitudeVal,longitudeVal) => {
    console.log(LocationName + " here");
    setCredentials({ ...credentials, location: LocationName,latitude:latitudeVal,longitude:longitudeVal });
  };


  const validateCredentials = (credentials) => {
    const errors = [];

    if (credentials.name.length === 0) {
      errors.push("Name must not be empty");
    }

    if (credentials.location.length === 0) {
      errors.push("Location must not be empty");
    }

    if (credentials.email.trim() === "") {
      errors.push("Email must not be empty");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        credentials.email
      )
    ) {
      errors.push("Invalid email address");
    }

    if (credentials.password.length < 6) {
      errors.push("Password should be at least 6 characters long");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCredentials(credentials);

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const response = await axios.post(
      "http://localhost:4010/api/userauth/signup",
      {
        name: credentials.name,
        location: credentials.location,
        email: credentials.email,
        password: credentials.password,
        contact: credentials.contact,
        latitude:credentials.latitude,
        longitude:credentials.longitude,
      }
    );

    if (response.status === 200) {
      window.location.href = "/login";
    } else {
      alert("Email already exists! Try again with another one.");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div
        className="container"
        style={{
          width: "600px",
          border: "1px solid white",
          margin: "10px auto",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center mt-4">Signup</h1>

          <Form.Group className="mb-3" controlId="formBasicNmae">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              value={credentials.name}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Enter Location"
                name="location"
                value={credentials.location}
                onChange={onChange}
              />
              <Button variant="outline-secondary" onClick={handleShowMapModal}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicContact">
            <Form.Label>Contact No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your contact"
              name="contact"
              value={credentials.contact}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
          </Form.Group>

          <Button
            variant=" mb-2 mt-4"
            type="submit"
            className="d-block mx-auto"
            style={{ color: "white", backgroundColor: "#ff8a00" }}
          >
            Submit
          </Button>
          <div className="text-center">
            <Link to="/login">Already have an account? Login!</Link>
          </div>
          <br />
        </Form>
      </div>

      {/* GoogleMap Modal */}
      <Modal show={showMapModal} onHide={handleCloseMapModal}>
        <Modal.Header>
          <Modal.Title>Select your Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleMap updateLocationName={updateLocationName} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseMapModal}
            style={{
              color: "white",
              backgroundColor: "#ff8a00",
              border: "1px solid #ff8a00",
              outline: "none",
            }}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
