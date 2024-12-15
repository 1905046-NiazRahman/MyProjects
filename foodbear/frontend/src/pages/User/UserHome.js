import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { RestaurantCard } from "./RestaurantCard";
import { Footer } from "../../components/Footer";
import { FaHeart } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import GoogleMap from "../../components/Map";

export const UserHome = () => {
  // Fetch data from /api/restaurants route
  
  const [restaurants, setRestaurants] = useState([]);
  const [homeKitchens, setHomeKitchens] = useState([]);
  const [otherRestaurants, setOtherRestaurants] = useState([]);
  const [foodCount, setFoodCount] = useState(0); // State for food count
  const [mostPopularRestaurants, setMostPopularRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

  const [user, setUser] = useState(null);
  const [latestLocation, setLatestLocation] = useState("");
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);

  useEffect(() => {
    // This will log whenever favoriteRestaurants changes
    console.log("Updated favoriteRestaurants:", favoriteRestaurants);
  }, [favoriteRestaurants]);

  const [topRated, setTopRated] = useState([]);
  const [closed, setClosed] = useState([]);

  const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };

  //Haversine formula
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

  // Fetch restaurant data
  const fetchData = async () => {
    const response = await fetch("http://localhost:4010/api/user/restaurants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    //will do the work of fetching restu (with distance )
    const filteredRestaurants = data.filter((restaurant) => {
      // Calculate distance between restaurant and user's location
      const restaurantLocation = {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      };

      const userId = localStorage.getItem("user_id");
      const latitudeUser = localStorage.getItem(userId + "_lat");
      const longitudeUser = localStorage.getItem(userId + "_long");

      const userLocation = {
        latitude: latitudeUser,
        longitude: longitudeUser,
      };
      const distance = calculateDistance(restaurantLocation, userLocation); // Implement a function to calculate distance

      // Return true if distance is less than 4km
      return distance <= 4;
    });

    console.log("restu with lat long", filteredRestaurants);

    setRestaurants(filteredRestaurants);
    console.log("restaurants", data);

    const fetchOrdersForRestaurant = async (restaurantId) => {
      try {
        const response = await axios.get(
          `http://localhost:4010/api/order/restaurant/orders/${restaurantId}`
        );
        const orders = response.data;
        console.log("order len : ", orders.length);
        return orders.length;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return 0; // Return 0 if there's an error
      }
    };

    // Define a function to calculate popularity based on orders count
    const calculatePopularity = async () => {
      const popularRestaurants = [];

      for (const restaurant of filteredRestaurants) {
        const ordersCount = await fetchOrdersForRestaurant(restaurant._id);
        if (restaurant.averageRating >= 4 && ordersCount >= 10) {
          popularRestaurants.push(restaurant);
        }
      }

      // Take the top 5 (or however many you want) to show as most popular
      const topRated = popularRestaurants.slice(0, 4); // Change to slice(0, 5) if you want top 5
      console.log("Top-rated:", topRated); // Debug line
      // Take the top 4 (or however many you want) to show as most popular
      setMostPopularRestaurants(topRated);
      console.log("most popular", mostPopularRestaurants);
    };

    calculatePopularity();

    const homeKitchens = data.filter((restaurant) => restaurant.is_homekitchen);
    const otherRests = data.filter((restaurant) => !restaurant.is_homekitchen);
    const closed = data.filter((restaurant) => !restaurant.is_open);
    setHomeKitchens(homeKitchens);
    setOtherRestaurants(otherRests);
    setClosed(closed);
  };
  const fetchFavoriteRestaurants = async () => {
    const userId = localStorage.getItem("user_id");
    
    const latitudeUser = localStorage.getItem(userId + "_lat");
    const longitudeUser = localStorage.getItem(userId + "_long");
    await axios
    .post("http://localhost:4010/api/distance/currentUser/setLocation", {
      userLat: latitudeUser,
      userLng: longitudeUser,
    })
    .then((response) => {
      console.log("ooooo vai")
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error posting location data", error);
    });

    try {
      const response = await fetch(
        `http://localhost:4010/api/user/favorites/${userId}`
      );
      const data = await response.json();

      // console.log(data);

      if (response.ok) {
        // // Filter the restaurants that are in the favorite list
        // const favorites = restaurants.filter(r =>
        //   data.some(fav => fav._id === r._id)
        // );

        //will do the work of fetching restu (with distance )
        const filteredRestaurants = data.filter((restaurant) => {
          // Calculate distance between restaurant and user's location
          const restaurantLocation = {
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          };

          const userId = localStorage.getItem("user_id");
          const latitudeUser = localStorage.getItem(userId + "_lat");
          const longitudeUser = localStorage.getItem(userId + "_long");

          const userLocation = {
            latitude: latitudeUser,
            longitude: longitudeUser,
          };
          const distance = calculateDistance(restaurantLocation, userLocation); // Implement a function to calculate distance

          // Return true if distance is less than 4km
          return distance <= 4;
        });

        setFavoriteRestaurants(filteredRestaurants);
        console.log(favoriteRestaurants);
      } else {
        console.log("Error fetching favorites:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching favorites:", error);
    }
  };

  useEffect(()=>{
    fetchFavoriteRestaurants()
  },[latestLocation])

  const updateLatestLocation = async (
    LocationName,
    latitudeVal,
    longitudeVal
  ) => {
    const userId = localStorage.getItem("user_id");
    setLatestLocation(LocationName);
    if (userId) {
      localStorage.removeItem(userId + "_lat");
      localStorage.removeItem(userId + "_long");
    }
    localStorage.setItem(userId + "_lat", latitudeVal);
    localStorage.setItem(userId + "_long", longitudeVal);
    const res = await axios.put(
      `http://localhost:4010/api/user/updateLocation/${userId}`,
      {
        location: LocationName,
        latitude: latitudeVal,
        longitude: longitudeVal,
      }
    );

    console.log(res);
  };

  const fetchUser = async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `http://localhost:4010/api/user/${userId}`
      );
      setUser(response.data);
      setLatestLocation(response.data.location);
      setUserLatitude(response.data.latitude);
      setUserLongitude(response.data.longitude);

      // Store latitude and longitude in local storage
      localStorage.setItem(userId + "_lat", response.data.latitude);
      localStorage.setItem(userId + "_long", response.data.longitude);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDataAndUser = () => {
      fetchUser();
      fetchData();
      fetchFavoriteRestaurants();
    };

    fetchDataAndUser();
  }, []);

  // Search
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search === "") {
      setHomeKitchens(
        restaurants.filter((restaurant) => restaurant.is_homekitchen)
      );
      setOtherRestaurants(
        restaurants.filter((restaurant) => !restaurant.is_homekitchen)
      );
      setClosed(restaurants.filter((restaurant) => !restaurant.is_open));
      // setMostPopularRestaurants(topRated); // Maintain the top-rated restaurants
    } else {
      setHomeKitchens(
        restaurants.filter(
          (restaurant) =>
            restaurant.is_homekitchen &&
            restaurant.is_open &&
            (restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
              restaurant.location.toLowerCase().includes(search.toLowerCase()))
        )
      );
      setOtherRestaurants(
        restaurants.filter(
          (restaurant) =>
            !restaurant.is_homekitchen &&
            restaurant.is_open &&
            (restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
              restaurant.location.toLowerCase().includes(search.toLowerCase()))
        )
      );
      setClosed(
        restaurants.filter(
          (restaurant) =>
            !restaurant.is_open &&
            (restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
              restaurant.location.toLowerCase().includes(search.toLowerCase()))
        )
      );
      setMostPopularRestaurants(
        topRated.filter(
          (restaurant) =>
            restaurant.is_open &&
            (restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
              restaurant.location.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, restaurants, topRated]);

  useEffect(() => {
    const newFoodCount = localStorage.getItem("food_count");
    setFoodCount(newFoodCount);
  }, [localStorage.getItem("food_count")]);

  const [showMapModal, setShowMapModal] = useState(false);

  const handleShowMapModal = () => setShowMapModal(true); // Should set it to true
  const handleCloseMapModal = () => setShowMapModal(false); // Should set it to false

  // useEffect to watch for changes in location state
  useEffect(() => {
    // Call updateLatestLocation whenever latestLocation changes
    if (latestLocation !== "") {
      fetchData();
    }
  }, [latestLocation]);

  const calculatePropDistance = (restaurant)=>{
    const restaurantLocation = {
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    };

    const userId = localStorage.getItem("user_id");
    const latitudeUser = localStorage.getItem(userId + "_lat");
    const longitudeUser = localStorage.getItem(userId + "_long");

    const userLocation = {
      latitude: latitudeUser,
      longitude: longitudeUser,
    };
    const distance = calculateDistance(restaurantLocation, userLocation);
    return distance
  }


  

  return (
    <div>
      <Navbar />

      <div
        className="container"
        style={{
          position: "relative",
          top: "100px",
        }}
      >
        <input
          className="form-control mt-2"
          type="search"
          placeholder="Enter Restaurant Name or Location to Explore"
          aria-label="Search"
          value={search}
          onChange={handleSearch}
          style={{
            boxShadow: "0px 6px 12px rgba(1, 1, 1, 0.2)",
            height: "50px", // Increase the height
            padding: "2px", // Add margin to the text area
            textAlign: "center", // Center the placeholder text
            fontSize: "1.2rem", // Increase the font-size
          }}
        />{" "}
        <br />
        <div className="d-flex align-items-center mb-2">
          <button
            className="btn btn-primary me-2"
            style={{
              background: "#ff8a00",
              border: "1px solid #ff8a00",
              fontSize: ".9rem",
              display: "flex",
              alignItems: "center",
              outline: "none",
            }}
            onClick={handleShowMapModal}
          >
            <i className="fa-solid fa-location-dot"></i>
          </button>
          <p className="m-0">
            <strong>{user && latestLocation}</strong>
          </p>
        </div>
        {favoriteRestaurants.length > 0 && (
          <div className="row mt-4">
            <h4>
              <FaHeart style={{ color: "#dc3545", marginTop: "-5px" }} /> My
              Favourites
            </h4>
            <hr />
            {favoriteRestaurants.slice(0, 4).map((restaurant) => (
              
              <div key={restaurant._id} className="col-12 col-md-6 col-lg-3">
                <RestaurantCard
                  _id={restaurant._id}
                  name={restaurant.name}
                  img={restaurant.img}
                  location={restaurant.location}
                  averageRating={restaurant.averageRating}
                  is_open={restaurant.is_open}
                  distance={calculatePropDistance(restaurant)}
                />
              </div>
            ))}
          </div>
        )}
        {/* Most Popular Restaurants */}
        {mostPopularRestaurants.length > 0 && (
          <div className="row mt-4">
            <h4>
              <FaFire style={{ color: "orange", marginTop: "-10px" }} /> Most
              Popular
            </h4>
            <hr />
            {mostPopularRestaurants
              .filter((restaurant) => restaurant.is_open) // Only include restaurants that are open
              .map((restaurant) => (
                <div key={restaurant._id} className="col-12 col-md-6 col-lg-3">
                  <RestaurantCard
                    _id={restaurant._id}
                    name={restaurant.name}
                    img={restaurant.img}
                    location={restaurant.location}
                    averageRating={restaurant.averageRating}
                    is_open={restaurant.is_open}
                    distance={calculatePropDistance(restaurant)}
                  />
                </div>
              ))}
          </div>
        )}
        {homeKitchens.length > 0 && (
          <div className="row mt-4">
            <h4>Home Kitchens</h4>
            <hr />
            {homeKitchens
              .filter((restaurant) => restaurant.is_open) // Filter open restaurants
              .map((restaurant) => (
                <div key={restaurant._id} className="col-12 col-md-6 col-lg-3">
                  <RestaurantCard
                    _id={restaurant._id}
                    name={restaurant.name}
                    img={restaurant.img}
                    location={restaurant.location}
                    averageRating={restaurant.averageRating}
                    is_open={restaurant.is_open}
                    distance={calculatePropDistance(restaurant)}
                  />
                </div>
              ))}
          </div>
        )}
        {otherRestaurants.length > 0 && (
          <div className="row mt-4">
            <h4>All Restaurants</h4>
            <hr />
            {otherRestaurants
              .filter((restaurant) => restaurant.is_open) // Filter open restaurants
              .map((restaurant) => (
                <div key={restaurant._id} className="col-12 col-md-6 col-lg-3">
                  <RestaurantCard
                    _id={restaurant._id}
                    name={restaurant.name}
                    img={restaurant.img}
                    location={restaurant.location}
                    averageRating={restaurant.averageRating}
                    is_open={restaurant.is_open}
                    distance={calculatePropDistance(restaurant)}
                  />
                </div>
              ))}
          </div>
        )}
        {closed.length > 0 && (
          <div className="row mt-4">
            <h4>Temporarily Closed</h4>
            <hr />
            {closed.map((restaurant) => (
              <div key={restaurant._id} className="col-12 col-md-6 col-lg-3">
                <RestaurantCard
                  _id={restaurant._id}
                  name={restaurant.name}
                  img={restaurant.img}
                  location={restaurant.location}
                  averageRating={restaurant.averageRating}
                  is_open={restaurant.is_open}
                  distance={calculatePropDistance(restaurant)}
                />
              </div>
            ))}
          </div>
        )}
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
        <Footer />
      </div>
    </div>
  );
};
