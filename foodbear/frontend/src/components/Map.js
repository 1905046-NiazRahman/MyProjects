import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import axios from "axios";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const GoogleMap = ({ updateLocationName }) => {
  const [showModal, setShowModal] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [apiKey, setApiKey] = useState(
    "AIzaSyBzg7NzFmIXnrDx_ectt8aYFtfsTcvuSq0"
  );
  const markerRef = useRef(null);
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const getLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const { results } = response.data;
      if (results && results.length > 0) {
        setLocationName(results[0].formatted_address);
        updateLocationName(results[0].formatted_address, lat, lng);
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  useEffect(() => {
    getLocationName(latitude, longitude);
  }, [latitude, longitude]);

  const handleMarkerDragEnd = () => {
    if (markerRef.current) {
      const newLatLng = markerRef.current.getPosition();
      setLatitude(newLatLng.lat());
      setLongitude(newLatLng.lng());
      getLocationName(newLatLng.lat(), newLatLng.lng());
    }
  };

  const handleApiLoaded = (map, maps) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        markerRef.current = new maps.Marker({
          position: center,
          map,
          title: "You are here!",
          draggable: true,
        });
        markerRef.current.addListener("dragend", handleMarkerDragEnd);
        map.panTo(center);
        getLocationName(center.lat, center.lng);
      });
    }
  };

  const handleSelect = async (value) => {
    setAddress(value);
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setLatitude(latLng.lat);
      setLongitude(latLng.lng);
      setLocationName(value);
      updateLocationName(value, latLng.lat, latLng.lng);

      if (markerRef.current) {
        markerRef.current.setPosition({ lat: latLng.lat, lng: latLng.lng });
      }

      // Center the map on the selected location
      if (markerRef.current && markerRef.current.map) {
        markerRef.current.map.panTo({ lat: latLng.lat, lng: latLng.lng });
      }
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Button variant="primary" onClick={handleShow}>
        Choose Location From Map
      </Button>
      <br />
      <div className="text-center">
        <h5>Your Selected Location</h5>
        <p>{latitude}</p>
        <p>{longitude}</p>
        <p>{locationName}</p>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>FoodBear Map</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "400px", width: "100%" }}>
          <div style={{ height: "100%", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              defaultCenter={{ lat: 0, lng: 0 }}
              defaultZoom={11}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            />
          </div>
          <br />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    width: "10cm",
                    padding: "10px",
                    border: "2px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                    outline: "none",  
                  }}
                  {...getInputProps({ placeholder: "Search Places..." })}
                />

                <div>
                  {loading ? <div>Loading...</div> : null}
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#ff8a00" : "#fff",
                    };
                    return (
                      <div {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              color: "white",
              backgroundColor: "#ff8a00",
              border: "1px solid #ff8a00",
              outline: "none",
            }}
          >
            Place here
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GoogleMap;
