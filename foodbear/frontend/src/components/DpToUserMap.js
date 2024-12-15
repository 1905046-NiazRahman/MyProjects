import React, { useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import axios from "axios";

const MapModal = ({ user, onClose, show }) => {
  // Add show prop
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);


  // Log the updated value of deliveryPersonLocation whenever it changes

  useEffect(() => {
    axios
      .get("http://localhost:4010/api/distance/getLocations")
      .then((response) => {
        const locationData = response.data.data[0];
        setStart({ lat: locationData.userLat, lng: locationData.userLng });
        setEnd({ lat: locationData.dpLat, lng: locationData.dpLng });
      })
      .catch((error) => {
        console.error("Error fetching location data", error);
      });
  }, []);

  const handleApiLoaded = (map, maps) => {
    setMap(map);
    setMaps(maps);
  };

 

  useEffect(() => {
    if (map && maps) {
      const directionsService = new maps.DirectionsService();
      const directionsRenderer = new maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "red",
        },
      });
      directionsRenderer.setMap(map);

      //const start = { lat: 23.8103, lng: 90.4125 }; // Arbitrary point in Dhaka
      //const end = { lat: 23.7203, lng: 90.49925 }; // Another arbitrary point in Dhaka
      console.log("herme",start);      
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);

          } else {
            console.error(`Error occurred in direction service: ${status}`);
          }
        }
      );
    }
  }, [map, maps,start,end]);

  return (
    <Modal show={show} onHide={onClose}>
      {" "}
      {/* Use show prop */}
      <Modal.Header closeButton>
        <Modal.Title>FoodBear Map</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBzg7NzFmIXnrDx_ectt8aYFtfsTuSq0" }}
          defaultCenter={{ lat: 23.8103, lng: 90.4125 }} // Center of Dhaka
          defaultZoom={11}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;
