import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

export default function (props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const handleDelete = () => {
    setShowConfirmModal(true);
  };
  let percentage = 0;
  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:4010/api/restaurant/deletefood/${props._id}`,
        {
          method: "DELETE",
        }
      );

      if (props.isDiscounted) {
        const response2 = await axios.delete(
          `http://localhost:4010/api/restaurant/offer/${props.restaurant_id}/${props._id}`
        );
      }

      if (response.status === 200) {
        window.location.href = "/restaurant/foods";
        console.log("Food item deleted successfully");
      } else {
        console.log("Failed to delete food item");
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };
  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  // E D I T    F O O D    P A R T
  // create a state to track whether the edit modal is open or not,
  // and another state to hold the edited data temporarily before sending it to the server.
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedFood, setEditedFood] = useState({
    name: props.name,
    CategoryName: props.CategoryName,
    price: props.price,
    img: props.img,
    startTime: props.startTime,
    endTime: props.endTime,
    minOrder: props.minOrder,
    daysOfWeek: props.daysOfWeek || [], // added field daysOfWeek
  });

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    if (type === 'checkbox' && name === 'daysOfWeek') {
      setEditedFood(prevFood => {
        if (checked) {
          // Add the day to the array if it's not already included
          return { ...prevFood, daysOfWeek: [...prevFood.daysOfWeek, value] };
        } else {
          // Remove the day from the array
          return { ...prevFood, daysOfWeek: prevFood.daysOfWeek.filter(day => day !== value) };
        }
      });
    } else {
      setEditedFood(prevFood => ({ ...prevFood, [name]: value }));
    }
  };
  

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4010/api/restaurant/editfood/${props._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedFood),
        }
      );

      setShowEditModal(false);
      window.location.href = "/restaurant/foods";

      const percentage = (
        await axios.get(
          `http://localhost:4010/api/restaurant/offer/${props.restaurant_id}/${props._id}`
        )
      ).data.discountPercentage;
      const response2 = await axios.put(
        `http://localhost:4010/api/restaurant/offer/${props.restaurant_id}/${props._id}`,
        {
          foodItemName: editedFood.name,
          mainPrice: editedFood.price,
          offeredPrice:
            editedFood.price - (editedFood.price * percentage) / 100,
          img: editedFood.img,
        }
      );

      console.log(response2.data);

      if (response.status === 200) {
        // Close the modal after successful edit
        setShowEditModal(false);
        window.location.href = "/restaurant/foods";
      } else {
        console.log("Failed to edit food item");
      }
    } catch (error) {
      console.error("Error editing food item:", error);
    }
  };

  //Card e hover effect add korar jonno
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    width: "16rem",
    maxHeight: "360px",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    transition: "transform 0.1s ease-in-out",
  };

  //stock out part
  const [isInStock, setIsInStock] = useState(props.is_instock); // State to track Stock Out status

  const handleStockOutToggle = async () => {
    try {
      const response = await fetch(
        `http://localhost:4010/api/restaurant/fooditems/stockout/${props._id}`,
        {
          method: "PUT",
        }
      );

      if (response.status === 200) {
        setIsInStock(!isInStock); // Toggle the Stock Out status
        console.log("Stock Out status updated successfully");
      } else {
        console.log("Failed to update Stock Out status");
      }
    } catch (error) {
      console.error("Error updating Stock Out status:", error);
    }
  };

  //I S O P E N

  const handleStockAndRestaurantStatusToggle = async () => {
    try {
      const restaurantId = props.restaurantId; // Assume restaurantId is passed as a prop
      const foodId = props._id;

      const response = await fetch(
        `http://localhost:4010/api/restaurant/updateStock/${foodId}/${restaurantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inStock: !isInStock }), // Toggle the stock status before sending
        }
      );

      if (response.status === 200) {
        console.log(
          "Stock Out status and restaurant is_open field updated successfully"
        );
      } else {
        console.log(
          "Failed to update Stock Out status and restaurant is_open field"
        );
      }
    } catch (error) {
      console.error("Error updating Stock Out status:", error);
    }
  };

  useEffect(() => {
    // Calling the function when isInStock changes
    handleStockAndRestaurantStatusToggle();
  }, [isInStock]);

  //Add offer
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    // Initialize state for the new offer fields
    offercatagory: "",
    discount: "",
  });

  const handleAddOfferChange = (event) => {
    setNewOffer({ ...newOffer, [event.target.name]: event.target.value });
  };

  const handleAddOfferSubmit = async () => {
    try {
      // Make a fetch request to add the offer
      // This would be similar to the fetch request in handleEditSubmit
      // Include the new offer data in the request body
      console.log("Adding offer:", newOffer);
      setDiscountPercentage(newOffer.discount);
      const response = await axios.post(
        `http://localhost:4010/api/restaurant/offer/${props.restaurant_id}/${props._id}`,
        {
          foodItemName: props.name,
          img: props.img,
          offeredCatagoryName: newOffer.offercatagory,
          mainPrice: props.price,
          offeredPrice: props.price - (props.price * newOffer.discount) / 100,
          is_instock: true,
        }
      );

      const response2 = await axios.post(
        "http://localhost:4010/api/restaurant/offer/offerfoodcategory",
        {
          CategoryName: newOffer.offercatagory,
        }
      );

      console.log(response.data);

      // After successfully adding the offer, close the modal
      setShowAddOfferModal(false);
      window.location.reload();
    } catch (error) {
      setShowAddOfferModal(false);
      window.location.reload();
      console.error("Error adding offer:", error);
    }
  };

  //Delete offer
  const handleDeleteOffer = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4010/api/restaurant/offer/${props.restaurant_id}/${props._id}`
      );

      console.log(response.data);

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  const [restaurant, setRestaurant] = useState(null);
  useEffect(() => {
    const fetchRestaurant = async () => {
      const response = await axios.get(
        `http://localhost:4010/api/restaurant/homekitchen/${props.restaurant_id}`
      );
      console.log(response.data);
      setRestaurant(response.data);
    };
    fetchRestaurant();
  }, [props.restaurant_id]);

  const [food, setFood] = useState(null);
  useEffect(() => {
    const fetchFood = async () => {
      console.log(props._id, "food id");
      const response = await axios.get(
        `http://localhost:4010/api/order/homekitchen/${props._id}`
      );
      console.log(response.data, "fetchedddd foood");
      setFood(response.data);
    };
    fetchFood();
  }, []);

  return (
    <div>
      <div
        className="card mt-2"
        style={cardStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={props.img}
          className="card-img-top"
          alt="..."
          style={{ maxHeight: "140px", objectFit: "cover" }}
        />
        <div
          className="card-body"
          style={{ boxShadow: "0px 4px 8px rgba(1, 1, 1, 0.2)" }}
        >
          <h6 className="card-title">{props.name}</h6>

          <div className="h-100 fs-6">
            {props.isDiscounted ? (
              <>
                <del>Tk {props.price}</del> Tk {Math.floor(props.offeredPrice)}
              </>
            ) : (
              `Tk ${props.price}`
            )}
          </div>

          {restaurant && restaurant.is_homekitchen && (
            <>
              <div>
                Available from {props.startTime} to {props.endTime}
              </div>
              <div>Minimum order: {props.minOrder}</div>
            </>
          )}

          {!props.isDiscounted && (
            <div className="form-check form-switch mt-2">
              <input
                className="form-check-input"
                style={{
                  cursor: "pointer",
                  backgroundColor: isInStock ? "transparent" : "#ff8a00",
                }}
                type="checkbox"
                id={`stockout-${props._id}`}
                checked={!isInStock} // Use the state variable here
                onChange={handleStockOutToggle} // Toggle the status when the checkbox is changed
              />
              <label
                className="stockout-label"
                htmlFor={`stockout-${props._id}`}
              >
                Stock Out
              </label>
            </div>
          )}

          <div className="d-flex flex-row justify-content mt-1">
            {!props.isDiscounted && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  style={{ marginRight: "10px" }}
                  onClick={handleDelete}
                >
                  Delete
                </button>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm mr-2"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit
                </button>
              </>
            )}

            {!props.isAddedToOffer && (
              <button
                type="button"
                className={`btn btn-sm mr-4 ${
                  props.isDiscounted
                    ? "btn-outline-danger"
                    : "btn-outline-success"
                }`}
                style={{ marginLeft: props.isDiscounted ? "1px" : "15px" }}
                onClick={() =>
                  props.isDiscounted
                    ? handleDeleteOffer()
                    : setShowAddOfferModal(true)
                }
              >
                {props.isDiscounted ? "Remove Offer" : "Add Offer"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.7)" }}
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ marginTop: "10%" }}
          >
            <div className="modal-content">
              <div className="modal-body">
                <h5>Are you sure you want to Delete this food?</h5>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="EditFoodModalLabel">
                  Edit Food
                </h3>
              </div>
              <div className="modal-body">
                {/* Form with input fields */}
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={editedFood.name}
                      onChange={handleEditChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Food Category"
                      name="CategoryName"
                      value={editedFood.CategoryName}
                      onChange={handleEditChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      name="price"
                      value={editedFood.price}
                      onChange={handleEditChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Image Link"
                      name="img"
                      value={editedFood.img}
                      onChange={handleEditChange}
                    />
                  </Form.Group>

                  {restaurant && restaurant.is_homekitchen && (
                    <>
                      <Form.Group controlId="daysOfWeek">
                        <Form.Label>Days of Week</Form.Label>
                        {[
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ].map((day, index) => (
                          <Form.Check
                            type="checkbox"
                            label={day}
                            name="daysOfWeek"
                            value={day}
                            checked={editedFood.daysOfWeek.includes(day)}
                            onChange={handleEditChange}
                            key={index}
                          />
                        ))}
                      </Form.Group>

                      <Form.Group controlId="formStartTime">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                          type="time"
                          name="startTime"
                          value={editedFood.startTime || ""}
                          onChange={handleEditChange}
                        />
                      </Form.Group>

                      <Form.Group controlId="formEndTime">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                          type="time"
                          name="endTime"
                          value={editedFood.endTime || ""}
                          onChange={handleEditChange}
                        />
                      </Form.Group>

                      <Form.Group controlId="formMinOrder">
                        <Form.Label>Minimum Order</Form.Label>
                        <Form.Control
                          type="number"
                          name="minOrder"
                          value={editedFood.minOrder || ""}
                          onChange={handleEditChange}
                        />
                      </Form.Group>
                    </>
                  )}
                </Form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={handleEditSubmit} // Create this function
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSX for the Add Offer modal */}
      {showAddOfferModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.7)" }}
        >
          {/* Modal content goes here */}
          {/* Similar to the Edit modal, create a modal with input fields for adding an offer */}
          {/* Include input fields for offer description and discount */}
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="AddOfferModalLabel">
                  Add Offer
                </h3>
              </div>
              <div className="modal-body">
                <Form>
                  <Form.Group className="mb-3" controlId="offercatagory">
                    <Form.Label>Catagory</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Offer/Promotional Campaign Name"
                      name="offercatagory"
                      value={newOffer.offercatagory}
                      onChange={handleAddOfferChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="offerDiscount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Offer Discount"
                      name="discount"
                      value={newOffer.discount}
                      onChange={handleAddOfferChange}
                    />
                  </Form.Group>
                </Form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowAddOfferModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={handleAddOfferSubmit}
                >
                  Add Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
