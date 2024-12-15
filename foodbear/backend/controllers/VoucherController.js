const VoucherModel = require("../models/VoucherModel"); // Replace with the actual path to your Voucher model
const UserModel = require("../models/UserModel"); // Replace with the actual path to your User model

const createVoucher = async (req, res) => {
  const { code,minimumAmount, discount, expiryDate,maxUsage,restaurant_id, users } = req.body;

  try {
    const voucher = new VoucherModel({
      code,
      minimumAmount,
      discount,
      expiryDate,
      maxUsage,
      restaurant_id,
      users,
    });

    await voucher.save();

    res.status(201).json(voucher);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVoucher = async (req, res) => {
    const { restaurant_id } = req.params;
    try {
      const vouchers = await VoucherModel.find({ restaurant_id });
      res.json(vouchers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
}

const deleteVoucher = async (req, res) => {
    const { restaurant_id } = req.params;
    try {
      const vouchers = await VoucherModel.deleteOne({ restaurant_id });
      res.json(vouchers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
}

const updatevoucher = async(req,res)=>{
  try {
    const { id } = req.params;
    const { users } = req.body;

    // Find the voucher by id and update it
    const voucher = await VoucherModel.findByIdAndUpdate(id, { users }, { new: true });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


module.exports = {
  createVoucher,
  getAllUsers,
  getVoucher,
  deleteVoucher,
  updatevoucher,
};
