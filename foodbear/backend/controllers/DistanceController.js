const UserDpLocation = require("../models/UserDpLocation");

const postUserLocation = async (req, res) => {
  const { userLat, userLng } = req.body;

  try {
    const locationData = await UserDpLocation.findOneAndUpdate(
      {},
      { userLat, userLng },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "User location data saved successfully",
      data: locationData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving user location data",
      error: error.message,
    });
  }
};

const postDpLocation = async (req, res) => {
  const { dpLat, dpLng } = req.body;

  try {
    const locationData = await UserDpLocation.findOneAndUpdate(
      {},
      { dpLat, dpLng },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Delivery person location data saved successfully",
      data: locationData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving delivery person location data",
      error: error.message,
    });
  }
};

const getLocationData = async (req, res) => {
  try {
    const locationData = await UserDpLocation.find();

    res.status(200).json({
      message: "Location data retrieved successfully",
      data: locationData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving location data",
      error: error.message,
    });
  }
};

const deleteAllLocationData = async (req, res) => {
  try {
    await UserDpLocation.deleteMany();

    res.status(200).json({
      message: "All location data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting location data",
      error: error.message,
    });
  }
};

module.exports = {
  postUserLocation,
  postDpLocation,
  getLocationData,
  deleteAllLocationData,
};
