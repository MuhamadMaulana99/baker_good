const express = require("express");
const userController = require("../controller/auth/UserController.js");
const categoryController = require("../controller/main/categoryController.js");
const productController = require("../controller/main/productController.js");
const complaintController = require("../controller/main/complaintController.js");
const authMiddleware = require("../controller/config/authMiddleware.js");

const routers = express.Router();

// 🟢 Tanpa Auth (Public Routes)
routers.post("/login", userController.LoginUser);
routers.post("/register", userController.addUser);

// 🔴 Dengan Auth (Protected Routes)
routers.get("/allUser", authMiddleware, userController.getUser);
routers.get("/allUserByRoles/:role", authMiddleware, userController.getUserByRole);
routers.delete("/allUser/:id", authMiddleware, userController.deleteUser);
routers.put("/allUser/:id", authMiddleware, userController.putUser);

// 🆕 Product Routes
routers.get("/products", authMiddleware, productController.getProducts);
routers.post("/products", authMiddleware, productController.addProduct);
routers.put("/products/:id", authMiddleware, productController.updateProduct);
routers.delete("/products/:id", authMiddleware, productController.deleteProduct);

// 🆕 Category Routes
routers.get("/categories", authMiddleware, categoryController.getCategories);
routers.post("/categories", authMiddleware, categoryController.addCategory);
routers.put("/categories/:id", authMiddleware, categoryController.updateCategory);
routers.delete("/categories/:id", authMiddleware, categoryController.deleteCategory);

// 🆕 Complaint Routes
routers.get("/complaints", authMiddleware, complaintController.getComplaints);
routers.post("/complaints", authMiddleware, complaintController.addComplaint);
routers.put("/complaints/:id", authMiddleware, complaintController.updateComplaintStatus);
routers.delete("/complaints/:id", authMiddleware, complaintController.deleteComplaint);

module.exports = routers;
