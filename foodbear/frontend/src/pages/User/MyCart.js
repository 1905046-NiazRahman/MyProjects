import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { CartCard } from "../../components/CartCard";
import { Footer } from "../../components/Footer";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios, { toFormData } from "axios";

import Modal from "react-bootstrap/Modal"; // import Modal component
import Button from "react-bootstrap/Button"; // import Button component

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillAlt,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

export const MyCart = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { foodCount, updateFoodCount } = useContext(UserContext);
  const [offeredFoods, setOfferedFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const received_cart = await fetch(
        "http://localhost:4010/api/user/getcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
          }),
        }
      );
      const received_cart_json = await received_cart.json();
      updateFoodCount(received_cart_json.length);

      localStorage.removeItem("food_count");

      //console.log(localStorage.getItem("restaurant_id"));
      const offerfoodRes = await axios.get(
        `http://localhost:4010/api/restaurant/offer/${localStorage.getItem(
          "restaurant_id"
        )}`
      );
      setOfferedFoods(offerfoodRes.data);

      try {
        // Fetch cart_data
        const cartResponse = await fetch(
          "http://localhost:4010/api/user/getcart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
            }),
          }
        );

        const cartData = await cartResponse.json();
        setCartData(cartData);

        // Fetch food_items for each item in cart_data
        const foodPromises = cartData.map((cartItem) =>
          fetch("http://localhost:4010/api/user/getfood", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              food_id: cartItem.food_id,
            }),
          }).then((response) => response.json())
        );

        const foodResults = await Promise.all(foodPromises);

        // Calculate unique food items with quantity and total price
        const uniqueFoodItems = {};
        let totalPrice = 0;

        foodResults.forEach((foodItem) => {
          // Check if the food item is in the offeredFoods array
          const offeredFood = offeredFoods.find(
            (offeredFoodItem) => offeredFoodItem.foodId === foodItem._id
          );

          // If it is, use the discounted price, otherwise use the regular price
          const price = offeredFood
            ? Math.floor(Number(offeredFood.offeredPrice))
            : Math.floor(Number(foodItem.price));

          if (!uniqueFoodItems[foodItem._id]) {
            uniqueFoodItems[foodItem._id] = {
              id: foodItem._id,
              name: foodItem.name,
              type: foodItem.CategoryName,
              quantity: 1,
              price: price,
              //for homekichen stuffs
              minOrder: foodItem.minOrder,
              startTime: foodItem.startTime,
              endTime: foodItem.endTime,
              daysOfWeek: foodItem.daysOfWeek,
            };
          } else {
            uniqueFoodItems[foodItem._id].quantity += 1;
          }
          totalPrice += price;
        });

        // Convert the object into an array of unique food items
        const uniqueFoodItemsArray = Object.values(uniqueFoodItems);

        setFoodItems(uniqueFoodItemsArray);
        // console.log("checkin changes");
        // foodItems.forEach((foodItem) => {
        //   console.log(foodItem);
        // });

        if (localStorage.getItem("discount") !== null) {
          const discount = parseFloat(localStorage.getItem("discount"));
          totalPrice = totalPrice - (discount / 100) * totalPrice;
        }
        setTotalPrice(Math.floor(totalPrice));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [foodItems]);

  const handleIncreaseQuantity = async (foodItemId, user_id) => {
    try {
      const response = await fetch("http://localhost:4010/api/user/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          food_id: foodItemId,
          restaurant_id: localStorage.getItem("restaurant_id"),
        }),
      });
      const data = await response.json();
      updateFoodCount(foodCount + 1);
      if (data.success) {
        setFoodItems((prevFoodItems) =>
          prevFoodItems.map((foodItem) =>
            foodItem.id === foodItemId
              ? { ...foodItem, quantity: foodItem.quantity + 1 }
              : foodItem
          )
        );
        //navigate("/user/mycart");
      } else {
        console.error("Failed to update quantity.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecreaseQuantity = async (foodItemId, user_id) => {
    try {
      const response = await fetch(
        "http://localhost:4010/api/user/decreasefoodquantity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            food_id: foodItemId,
          }),
        }
      );
      const data = await response.json();
      updateFoodCount(foodCount - 1);
      if (data.success) {
        console.log("komse");
        setFoodItems((prevFoodItems) =>
          prevFoodItems.map((foodItem) =>
            foodItem.id === foodItemId && foodItem.quantity > 1
              ? { ...foodItem, quantity: foodItem.quantity - 1 }
              : foodItem
          )
        );
        //navigate("/user/mycart");
      } else {
        console.error("Failed to update quantity.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuantity = async (foodItemId, user_id) => {
    try {
      const response = await fetch(
        "http://localhost:4010/api/user/deletespecificfoodfromcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            food_id: foodItemId,
          }),
        }
      );
      const data = await response.json();
      for (let i = 0; i < foodItems.length; i++) {
        if (foodItems[i].id === foodItemId) {
          updateFoodCount(foodCount - foodItems[i].quantity);
        }
      }
      if (data.success) {
        setFoodItems((prevFoodItems) =>
          prevFoodItems.filter((foodItem) => foodItem.id !== foodItemId)
        );
      } else {
        console.error("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error(error);
    }
    navigate("/user/mycart");
  };

  const [payment_method, setPaymentMethod] = useState("cod");
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4010/api/restaurant/homekitchen/${localStorage.getItem(
            "restaurant_id"
          )}`
        );
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurant();
  }, []);

  const handleOrder = async () => {
    try {
      //check min order is satisfied or not
      if (restaurant !== null && restaurant.is_homekitchen) {
        // Fetch minimum order quantity for each food item
        const minOrderPromises = foodItems.map((foodItem) =>
          axios
            .get(`http://localhost:4010/api/order/homekitchen/${foodItem.id}`)
            .then((response) => response.data.minOrder)
        );

        // Wait for all promises to resolve
        const minOrderQuantities = await Promise.all(minOrderPromises);

        // Check if each food item meets the minimum order requirement
        const allFoodItemsMeetMinOrder = foodItems.every(
          (foodItem, index) => foodItem.quantity >= minOrderQuantities[index]
        );

        if (!allFoodItemsMeetMinOrder) {
          // If any food item does not meet the minimum order requirement, show an error message
          alert(
            "One or more food items do not meet the minimum order requirement."
          );
          return;
        }
      }

      fetch("http://localhost:4010/api/order/user/orders/neworder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          total_price: totalPrice,
          food_items: foodItems,
          restaurant_id: localStorage.getItem("restaurant_id"),
          payment_method: payment_method,
          selectedTime: selectedTime,
          selectedDay: selectedDay,
        }),
      });
      localStorage.removeItem("discount");
      navigate("/user/dashboard");
    } catch (error) {
      console.error(error);
    }

    await fetch("http://localhost:4010/api/user/deleteallfoodafterpayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
      }),
    });
    updateFoodCount(0);
  };

  const [showVoucherModal, setShowVoucherModal] = useState(false); // State to control the visibility of the modal
  const [voucherCode, setVoucherCode] = useState(""); // State to store the voucher code
  const [voucherError, setVoucherError] = useState(""); // State to store error messages
  const [voucherMessage, setVoucherMessage] = useState("");

  useEffect(() => {
    // Perform your action here
    setTotalPrice(totalPrice);
  }, [totalPrice]);

  // Function to handle voucher submission
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);

  const handleVoucherRemove = async () => {
    setIsVoucherApplied(false);
    const response = await axios.get(
      `http://localhost:4010/api/voucher/getvoucher/${localStorage.getItem(
        "restaurant_id"
      )}`
    );
    const voucher = response.data[0];
    const userId = localStorage.getItem("user_id");
    const user = voucher.users.find((user) => user.user_id === userId);
    if (user.usage > 0) user.usage -= 1;
    await axios.put(
      `http://localhost:4010/api/voucher/updatevoucher/${voucher._id}`,
      {
        users: voucher.users,
      }
    );
    localStorage.removeItem("discount");
  };
  const handleVoucherSubmit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4010/api/voucher/getvoucher/${localStorage.getItem(
          "restaurant_id"
        )}`
      );
      const voucher = response.data[0];
      console.log(voucher.minimumAmount);
      const currentDate = new Date();
      const expiryDate = new Date(voucher.expiryDate);
      const userId = localStorage.getItem("user_id");
      const user = voucher.users.find((user) => user.user_id === userId);

      if (voucher.code.toLowerCase() === voucherCode.toLowerCase()) {
        if (currentDate > expiryDate) {
          setVoucherMessage("The voucher is out of date.");
        } else if (user.usage >= voucher.maxUsage) {
          setVoucherMessage(
            "You have reached the maximum usage for this voucher."
          );
        } else if (totalPrice < voucher.minimumAmount) {
          setVoucherMessage(
            "Minimum Order Amount is BDT " + voucher.minimumAmount
          );
        } else {
          setVoucherMessage("Voucher Applied Successfully");
          setVoucherError("");
          setVoucherCode("");
          // Calculate discounted total price
          const discountedTotalPrice =
            totalPrice * ((100 - voucher.discount) / 100);

          // setDiscounted from voucher to local storage
          setIsVoucherApplied(true);
          localStorage.setItem("discount", voucher.discount.toString());

          setShowVoucherModal(false);
          user.usage += 1;
          await axios.put(
            `http://localhost:4010/api/voucher/updatevoucher/${voucher._id}`,
            {
              users: voucher.users,
            }
          );
        }
      } else {
        setVoucherMessage("This voucher does not exist.");
      }
    } catch (error) {
      console.error(error);
      setVoucherMessage("Failed to apply voucher. Please try again later.");
    }
  };

  return (
    <div>
      <div>
        <Navbar />
        <div
          className="container"
          style={{ position: "relative", top: "100px" }}
        >
          <div>
            {foodItems.length > 0 ? (
              <div>
                <h3>My Cart</h3>
                <hr />

                <div className="row lg-6">
                  {foodItems.map((foodItem, index) => (
                    <div className="col-12 col-md-6 col-lg-6 mb-3">
                      <CartCard
                        key={index}
                        id={foodItem.id}
                        name={foodItem.name}
                        type={foodItem.type}
                        price={foodItem.price}
                        quantity={foodItem.quantity}
                        handleIncreaseQuantity={handleIncreaseQuantity}
                        handleDecreaseQuantity={handleDecreaseQuantity}
                        handleDeleteQuantity={handleDeleteQuantity}
                        handleVoucherRemove={handleVoucherRemove}
                        //homekitchen stuffs
                        startTime={foodItem.startTime}
                        endTime={foodItem.endTime}
                        minOrder={foodItem.minOrder}
                        daysOfWeek={foodItem.daysOfWeek}
                        setSelectedTime={setSelectedTime}
                        setSelectedDay={setSelectedDay}
                      />
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <h5>Total: Tk {totalPrice.toFixed(2)}</h5> <br />
                </div>
                <div className="d-flex justify-content-center mb-4">
                  <button
                    className="btn btn-md float-end"
                    style={{ backgroundColor: "#ff8a00", color: "white" }}
                    data-bs-toggle="modal"
                    data-bs-target="#paymentModal"
                  >
                    Review Payment Method
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isVoucherApplied ? (
                    <button
                      onClick={handleVoucherRemove}
                      className="btn btn-md float-end btn-danger"
                      //style={{ backgroundColor: "#ff8a00", color: "white" }}
                    >
                      Remove Voucher
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowVoucherModal(true)}
                      className="btn btn-md float-end"
                      style={{ backgroundColor: "#ff8a00", color: "white" }}
                    >
                      Add a Voucher
                    </button>
                  )}
                  {/* Modal for entering voucher code */}
                  <Modal
                    show={showVoucherModal}
                    onHide={() => setShowVoucherModal(false)}
                    dialogClassName="modal-sm" // Use Bootstrap's small modal size
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Enter Voucher Code</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {/* Input field for voucher code */}
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="w-100" // Make the input field take up the full width of the modal
                      />
                      {/* Display error message, if any */}
                      {voucherError && <div>{voucherError}</div>}
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                      {" "}
                      {/* Center the button */}
                      {/* Button to submit voucher code */}
                      <Button
                        className="btn btn-md"
                        style={{
                          backgroundColor: "#ff8a00",
                          color: "white",
                          border: "none",
                        }}
                        onClick={handleVoucherSubmit}
                      >
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            ) : (
              <div
                className="text-center"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                  alt=""
                />
              </div>
            )}

            <div
              className="modal fade"
              id="paymentModal"
              tabindex="-1"
              aria-labelledby="paymentModalLabel"
              aria-hidden="true"
              size="lg"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="text-center"> Choose Payment Method</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        style={{ width: "20px", height: "20px" }}
                        value="cod" // Set the value to "cod" for Cash on Delivery
                        checked={payment_method === "cod"} // Check if payment_method is "cod"
                        onChange={handlePaymentMethodChange} // Call this function when selected
                      />
                      <label
                        className="form-check-label"
                        for="flexRadioDefault2"
                        style={{ fontSize: "20px" }}
                      >
                        <FontAwesomeIcon
                          icon={faMoneyBillAlt}
                          className="mr-2"
                          color="#ff8a00"
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        Cash on Delivery
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        style={{ width: "20px", height: "20px" }}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        value="card" // Set the value to "card" for Card
                        checked={payment_method === "card"} // Check if payment_method is "card"
                        onChange={handlePaymentMethodChange} // Call this function when selected
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      />
                      <label
                        className="form-check-label"
                        for="flexRadioDefault1"
                        style={{ fontSize: "20px" }}
                      >
                        <FontAwesomeIcon
                          icon={faCreditCard}
                          className="mr-2"
                          color="#ff8a00"
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        Card
                      </label>

                      <div className="collapse" id="collapseExample">
                        <div>
                          <input
                            type="number"
                            className="form-control mt-3"
                            id="cardNumber"
                            placeholder="Card No."
                          />
                          <input
                            type="password"
                            className="form-control mt-3"
                            id="cardPassword"
                            placeholder="Password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{ backgroundColor: "#ff8a00", color: "white" }}
                      onClick={handleOrder}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {foodItems.length > 0 ? <Footer /> : <div></div>}
        </div>
      </div>
      <Modal
        show={!!voucherMessage} // Show the modal if there is a voucher message
        onHide={() => setVoucherMessage("")} // Hide the modal and clear the message when the modal is closed
      >
        <Modal.Header closeButton>
          <Modal.Title>Voucher Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{voucherMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-md"
            style={{ backgroundColor: "#ff8a00", color: "white" }}
            onClick={() => setVoucherMessage("")} // Clear the message when the button is clicked
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
