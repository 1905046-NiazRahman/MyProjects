import React, { useState, useEffect } from "react";
import { NavbarDP } from "../../components/NavbarDP";
import { Footer } from "../../components/Footer";
import OrderCard_DP from "../../components/OrderCardDp";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import GoogleMap from "../../components/Map";

export const DashboardDP = () => {
  const [delivery_persons, setDeliveryPersons] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [locationName, setLocationName] = useState("");

  const fetchAllDeliveryPersons = async (req, res) => {
    let response = await axios.get(
      "http://localhost:4010/api/deliveryperson/dashboard"
    );
    setDeliveryPersons(response.data);

    delivery_persons.map((singleDP) => {
      if (singleDP._id === localStorage.getItem("deliveryperson_id")) {
        setIsAvailable(singleDP.is_available);
        setLocationName(singleDP.location);
      }
    });
  };

  //currently jesob dp logged in tader current active status set korbe
  //if they were offine then set offline and vice versa

  //there might be a bug in my code

  const handleIsAvailableToggle = async () => {
    try {
      const response =
        await axios.put(`http://localhost:4010/api/deliveryperson/isavailable/
        ${localStorage.getItem("deliveryperson_id")}`);

      if (response.status === 200) {
        setIsAvailable(!isAvailable);
      }
    } catch (error) {
      console.log("error is available updating");
    }
  };

  useEffect(() => {
    fetchAllDeliveryPersons();
  }, [locationName]);




  const [showMapModal, setShowMapModal] = useState(false);

  const handleShowMapModal = () => setShowMapModal(true); // Should set it to true
  const handleCloseMapModal = () => setShowMapModal(false); // Should set it to false

  const updateLatestLocation = async (
    LocationName,
    latitudeVal,
    longitudeVal
  ) => {
    setLocationName(LocationName);
    console.log("hhhhhh")
    console.log(latitudeVal)
    if(latitudeVal!==null && longitudeVal!==null){
    const response = await axios.put(
      `http://localhost:4010/api/deliveryperson/location/${localStorage.getItem(
        "deliveryperson_id"
      )}`,
      { location: LocationName, latitude:latitudeVal, longitude:longitudeVal }
    );

    console.log("ei j ",response.data);

    axios
    .post("http://localhost:4010/api/distance/currentDp/setLocation", {
      dpLat: latitudeVal,
      dpLng: longitudeVal,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error posting location data", error);
    });
    
    }

  };

  // useEffect to watch for changes in location state
  useEffect(() => {
    // Call updateLatestLocation whenever latestLocation changes
    if (locationName !== "") {
      fetchAllDeliveryPersons();
    }
  }, [locationName]);

  //Order management part
  //Completed orders and active orders
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const fetchCompletedOrders = async () => {
    let response = await fetch(
      `http://localhost:4010/api/order/deliveryperson/orders/${localStorage.getItem(
        "deliveryperson_id"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    response = await response.json();

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
        {delivery_persons.map((item, index) => {
          if (item._id === localStorage.getItem("deliveryperson_id")) {
            const deliveryperson = item;

            return (
              <div>
                <NavbarDP />

                <div
                  className="container"
                  style={{ position: "relative", top: "100px" }}
                >
                  <div className="container mt-3 mx-6">
                    <div className="d-flex flex-row justify-content-between">
                      <h2>{deliveryperson.name}</h2>
                      <div
                        className="form-check form-switch mt-2"
                        style={{ fontSize: "22px" }}
                      >
                        <input
                          className="form-check-input"
                          style={{
                            cursor: "pointer",
                            backgroundColor: isAvailable
                              ? "#ff8a00"
                              : "transparent",
                          }}
                          type="checkbox"
                          id="is_available"
                          checked={isAvailable}
                          onChange={handleIsAvailableToggle}
                        />
                        <label className="form-check-label" htmlFor="is_open">
                          Available Now
                        </label>

                        <button
                          className="btn btn-primary ms-3" // Add proper class for button design
                          onClick={handleShowMapModal} // Add appropriate onClick function
                          style={{
                            background: "#ff8a00",
                            border: "1px solid #ff8a00",
                            outline: "none",
                          }}
                        >
                          Update Location
                        </button>
                      </div>
                    </div>

                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <th scope="row">Delivery Person ID</th>
                          <td>{deliveryperson._id}</td>
                        </tr>
                        <tr>
                          <th scope="row">Location</th>
                          <td>{deliveryperson.location}</td>
                        </tr>
                        <tr>
                          <th scope="row">E-mail</th>
                          <td>{deliveryperson.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">Contact No.</th>
                          <td>{deliveryperson.contact}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="row lg-6">
                      {/* Active Order gula show korsi */}
                      {sortedActiveOrders.length > 0 && (
                        <div className="row lg-6">
                          <h3 className="mt-4">Active Orders</h3>
                          <hr />
                          {sortedActiveOrders.map((order) => (
                            <div
                              key={order._id}
                              className="col-12 col-md-6 col-lg-12 mb-3"
                            >
                              <OrderCard_DP
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

                      {/* Completed Order gula show korsi */}
                      {sortedCompletedOrders.length > 0 && (
                        <div className="row lg-6">
                          <h3 className="mt-4">Previous Deliveries</h3>
                          <hr />
                          {sortedCompletedOrders.map((order) => (
                            <div
                              key={order._id}
                              className="col-12 col-md-6 col-lg-12 mb-3"
                            >
                              <OrderCard_DP
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
                </div>
              </div>
            );
          }
        })}
      </div>

      <Modal />
        <Modal show={showMapModal} onHide={handleCloseMapModal}>
          <Modal.Header>
            <Modal.Title>Select your Location</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GoogleMap updateLocationName={updateLatestLocation} />
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
    </div>
  );
};
