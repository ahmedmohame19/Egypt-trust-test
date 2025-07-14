
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../DB/models/User/User.js";


export const createAdminAccount = async (req, res, next) => {
  let { name, email, password, role, phoneNumber } = req.body;
  // console.log(name, email, password, role, phoneNumber)
  if (!["WarehouseAdmin", "BranchAdmin"].includes(role)) {
    return res.json({ success: false, message: "Admin can only create WarehouseAdmin and BranchAdmin accounts" });
  }
  const salt = process.env.salt;
  let checkEmail = await User.findOne({ email });
  if (checkEmail) return res.json({ success: false, message: "Email already used" });
  let hashedPassword = bcrypt.hashSync(password, parseInt(salt));
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phoneNumber: phoneNumber || ""
  });

  return res.json({ 
    success: true, 
    message: `${role} account created successfully`,
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
};

// Delete admin account Admin only
export const deleteAdminAccount = async (req, res, next) => {
  const { adminId } = req.body;

  const adminToDelete = await User.findById(adminId);
  if (!adminToDelete) {
    return res.json({ success: false, message: "Admin account not found" });
  }
  if (adminToDelete.role === "Admin") {
    return res.json({ success: false, message: "Cannot delete the main Admin account" });
  }
  if (!["WarehouseAdmin", "BranchAdmin"].includes(adminToDelete.role)) {
    return res.json({ success: false, message: "Can only delete WarehouseAdmin and BranchAdmin accounts" });
  }

  const { Warehouse } = await import("../../../DB/models/Warehouse/Warehouse.js");
  const { Branches } = await import("../../../DB/models/Branches/Branches.js");

  const assignedToWarehouse = await Warehouse.findOne({ warehouseAdmin: adminId, isActive: true });
  const assignedToBranch = await Branches.findOne({ branchAdmin: adminId, isActive: true });

  if (assignedToWarehouse) {
    return res.json({ 
      success: false, 
      message: `Cannot delete admin. ${adminToDelete.name} is assigned to warehouse: ${assignedToWarehouse.name}` 
    });
  }

  if (assignedToBranch) {
    return res.json({ 
      success: false, 
      message: `Cannot delete admin. ${adminToDelete.name} is assigned to branch: ${assignedToBranch.name}` 
    });
  }


  const deletedAdmin = await User.findByIdAndDelete(
    adminId,
  );

  return res.json({ 
    success: true, 
    message: `${adminToDelete.role} account deleted successfully`,
    data: {
      id: deletedAdmin._id,
      name: deletedAdmin.name,
      email: deletedAdmin.email,
      role: deletedAdmin.role
    }
  });
};

// Admin only first account
export const signup = async (req, res, next) => {
  let { name, email, password, role="Admin" } = req.body;

  const salt = process.env.salt;

  if (role !== "Admin") {
    return res.json({ success: false, message: "Wrong Point" });
  }
  if (role === "Admin") {
    let checkAdmin = await User.find({ role })
    if (checkAdmin[0]) return res.json({ success: false, message: "the site have already Admin" });
  }
  let checkEmail = await User.findOne({ email });
  if (checkEmail) return res.json({ success: false, message: "email already used" });
  // Hash password
  let hashedPassword = bcrypt.hashSync(password, parseInt(salt));
  const addUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return res.json({ success: true, message: "Admin account created successfully" });
};

// Login
export const login = async (req, res, next) => {
  let { email, password } = req.body;
  let checkUser = await User.findOne({ email });
  if (!checkUser) return res.json({ success: false, message: "Email not exist try again" });

  let comparePassword = bcrypt.compareSync(password, checkUser.password);

  //  token
  const addToken = jwt.sign(
    { name: checkUser.name, email: checkUser.email, role: checkUser.role ,_id:checkUser._id},
    process.env.secretkey
  );

  if (comparePassword) return res.json({ success: true, message: "success", token: addToken });

  return res.json({ success: false, message: "password wrong try again" });
};