import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Staff.findOne({ where: { email } });
    let role = "staff";

    if (!user) {
      user = await Customer.findOne({ where: { email } });
      role = "customer";
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const match = await argon2.verify(user.password, password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    req.session.user = {
      id: role === "staff" ? user.staff_id : user.customer_id,
      name: user.name,
      email: user.email,
      role: role === "staff" ? user.role : "customer",
    };

    res.status(200).json({
      msg: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Me = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Please login first" });
  }
  res.status(200).json(req.session.user);
};

export const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Logout failed" });
    res.status(200).json({ msg: "Logout successful" });
  });
};
