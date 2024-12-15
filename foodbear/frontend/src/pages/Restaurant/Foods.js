import React, { useState, useEffect } from "react";
import Card from "./FoodCard_Restaurant";
import Navbar_Restaurant from "../../components/Navbar_Restaurant";
import axios from "axios";

export default function ShowFoods_Restaurant() {
  const [foods, setFoodItems] = useState([]);
  const [foodCategory, setFoodCategory] = useState([]);
  const [authToken, setAuthToken] = useState("");
  const [offeredFoods, setOfferedFoods] = useState([]);
  const [offeredFoodCategories, setOfferedFoodCategories] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4010/api/restaurant/foods"
      );
      const response2 = await axios.get(
        `http://localhost:4010/api/restaurant/offer/${localStorage.getItem(
          "restaurant_id"
        )}`
      );

      axios
        .get("http://localhost:4010/api/order/offer/getoffercatagory") //i dont know for what the hell reason it worked in this route
        //but not in the restaurant route,maybe i did some crime to someone!
        .then((response) => {
          console.log("ekhane catagory");
          console.log(response.data);
          setOfferedFoodCategories(response.data);
        });

      const responseData = response.data;
      setFoodItems(responseData[0]);
      setFoodCategory(responseData[1]);

      setOfferedFoods(response2.data);
      //console.log(response3)
      //setOfferedFoodCategories(response3.data);

      console.log(offeredFoods);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    setAuthToken(token);
  }, []);

  const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4010/api/voucher/getvoucher/${localStorage.getItem(
            "restaurant_id"
          )}`
        );
        console.log(response.data);
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const deleteVoucher = async (voucherId) => {
    try {
      await axios.delete(
        `http://localhost:4010/api/voucher/getvoucher/${localStorage.getItem('restaurant_id')}`
      );
      setVouchers(vouchers.filter((voucher) => voucher._id !== voucherId));
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  return (
    <div>
      <Navbar_Restaurant />

      <div className="container" style={{ position: "relative", top: "100px" }}>
        {vouchers ? (
          vouchers.map((voucher, index) => (
            <div>
              <h3>🎫 Current Voucher 🎫</h3>
              <div key={index} className="card" style={{ width: "22rem",marginBottom:"2rem",marginTop:"1rem" }}>
                <div className="card-body">
                  <h5 className="card-title"><bold>{voucher.code}</bold></h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                  Expiry Date: {new Date(voucher.expiryDate).getFullYear()}-{new Date(voucher.expiryDate).getMonth() + 1}-{new Date(voucher.expiryDate).getDate()}
                  </h6>
                  <p className="card-text">
                    Minimum Amount: {voucher.minimumAmount}
                  </p>
                  <p className="card-text">Max Usage: {voucher.maxUsage}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteVoucher(voucher._id)}
                  >
                    Delete Voucher
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>Loading Vouchers...</h1>
        )}

        {offeredFoodCategories ? (
          offeredFoodCategories.map((item, index) => {
            const foodsInCategory = offeredFoods.filter(
              (foodItem) =>
                foodItem.offeredCatagoryName === item.CategoryName &&
                foodItem.restaurant_id === localStorage.getItem("restaurant_id")
            );

            if (foodsInCategory.length > 0) {
              return (
                <div key={index} className="row mb-3">
                  <h3>{item.CategoryName}</h3>
                  <hr />

                  {foodsInCategory.map((foodItem) => {
                    const correspondingFood = foods.find(
                      (food) => food._id === foodItem.foodId
                    );
                    return (
                      correspondingFood &&
                      correspondingFood.is_instock && (
                        <div
                          key={foodItem._id}
                          className="col-12 col-md-6 col-lg-3"
                        >
                          <Card
                            _id={foodItem.foodId}
                            restaurant_id={foodItem.restaurant_id}
                            name={foodItem.foodItemName}
                            img={foodItem.img}
                            CategoryName={foodItem.offeredCatagoryName}
                            price={foodItem.mainPrice}
                            offeredPrice={foodItem.offeredPrice}
                            isDiscounted={true}
                            is_instock={correspondingFood.is_instock}
                            startTime={correspondingFood.startTime}
                            endTime={correspondingFood.endTime}
                            minOrder={correspondingFood.minOrder}
                            daysOfWeek={correspondingFood.daysOfWeek}
                          ></Card>
                        </div>
                      )
                    );
                  })}
                </div>
              );
            }
            return null; // Don't render anything if there are no foods in this category
          })
        ) : (
          <h1>Loading...</h1>
        )}

        {foodCategory ? (
          foodCategory.map((item, index) => {
            const foodsInCategory = foods.filter(
              (foodItem) =>
                foodItem.CategoryName === item.CategoryName &&
                foodItem.restaurant_id === localStorage.getItem("restaurant_id")
            );

            if (foodsInCategory.length > 0) {
              return (
                <div key={index} className="row mb-3">
                  <h3>{item.CategoryName}</h3>
                  <hr />

                  {foodsInCategory.map((foodItem) => (
                    <div
                      key={foodItem._id}
                      className="col-12 col-md-6 col-lg-3"
                    >
                      <Card
                        _id={foodItem._id}
                        restaurant_id={foodItem.restaurant_id}
                        name={foodItem.name}
                        img={foodItem.img}
                        CategoryName={foodItem.CategoryName}
                        price={foodItem.price}
                        is_instock={foodItem.is_instock}
                        isDiscounted={false}

                        startTime={foodItem.startTime}
                        endTime={foodItem.endTime}
                        minOrder={foodItem.minOrder}
                        
                        isAddedToOffer={offeredFoods.some(
                          (offeredFood) => offeredFood.foodId === foodItem._id
                        )}
                        daysOfWeek={foodItem.daysOfWeek}
                      ></Card>
                    </div>
                  ))}
                </div>
              );
            }
            return null; // Don't render anything if there are no foods in this category
          })
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
}
