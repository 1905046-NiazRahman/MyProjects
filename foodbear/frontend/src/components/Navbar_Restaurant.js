import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AddFoodModal from "../pages/Restaurant/AddFoodModal";
import AddVoucherModal from "../pages/Restaurant/AddVoucherModal";

export default function () {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const handleShowVoucherModal = () => {
    setShowVoucherModal(true);
  }

  const handleCloseVoucherModal = () => {
    setShowVoucherModal(false);
  }


  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddFood = (foodData) => {
    // Handle submitting the food data to your API or state management
    console.log("Submitted food data:", foodData);
    setShowModal(false);
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-dark"
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 100,
          top: 0,
          borderBottom: "1px solid orange",
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic text-warning" to="/">
            FoodBear
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link fs-5 ${
                    location.pathname === "/restaurant/dashboard"
                      ? "active"
                      : ""
                  }`}
                  to="/restaurant/dashboard"
                  style={{
                    color:
                      location.pathname === "/restaurant/dashboard"
                        ? "orange"
                        : "white",
                  }}
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link fs-5 ${
                    location.pathname === "/restaurant/foods" ? "active" : ""
                  }`}
                  to="/restaurant/foods"
                  style={{
                    color:
                      location.pathname === "/restaurant/foods"
                        ? "orange"
                        : "white",
                  }}
                >
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fs-5 ${
                    location.pathname === "/restaurant/statistics"
                      ? "active"
                      : ""
                  }`}
                  to="/restaurant/statistics"
                  style={{
                    color:
                      location.pathname === "/restaurant/statistics"
                        ? "orange"
                        : "white",
                  }}
                >
                  Analytics
                </Link>
              </li>
            </ul>

            {localStorage.getItem("restaurant_id") ? (
              <div className="d-flex">
                {location.pathname === "/restaurant/foods" && (
                  <>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: "#ff8a00",
                        color: "white",
                        marginRight: "10px",
                      }}
                      onClick={handleShowModal}
                    >
                      Add New Food
                    </button>

                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: "#ff8a00",
                        color: "white",
                        marginRight: "10px",
                      }}
                      onClick={handleShowVoucherModal} // Replace with your function to handle voucher modal
                    >
                      Add Voucher
                    </button>
                  </>
                )}
                <button
                  className="btn"
                  style={{ backgroundColor: "#ff8a00", color: "white" }}
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
      <AddFoodModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleAddFood}
      />

      <AddVoucherModal
        show={showVoucherModal}
        onHide={handleCloseVoucherModal}
       // Replace with your function to handle voucher modal
      />
      
    </div>
  );
}
