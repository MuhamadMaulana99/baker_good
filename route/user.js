const express = require("express");
const userController = require("../controller/auth/UserController.js");
const categoryController = require("../controller/main/categoryController.js");
const productController = require("../controller/main/productController.js");
const complaintController = require("../controller/main/complaintController.js");
const authMiddleware = require("../controller/config/authMiddleware.js");
const validate = require("../validation/user/validation.js");

const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validation/scema/categoryValidation.js");
const { createComplaintSchema, updateComplaintStatusSchema } = require("../validation/scema/complaintValidation.js");
const { createProductSchema, updateProductSchema } = require("../validation/scema/productValidation.js");
const { reportQuerySchema } = require("../validation/query/reportValidation.js");
const queryValidator = require("../validation/user/queryValidator.js");

const routers = express.Router();

// 🟢 Tanpa Auth (Public Routes)
routers.post("/login", userController.LoginUser);
routers.post("/register", userController.addUser);
routers.get('/products', productController.getProducts);
routers.post('/complaints', validate(createComplaintSchema), complaintController.addComplaint);
routers.get("/categories", categoryController.getCategories);

// 🔴 Dengan Auth (Protected Routes)
routers.get("/allUser", authMiddleware, userController.getUser);
routers.get("/allUserByRoles/:role", authMiddleware, userController.getUserByRole);
routers.delete("/allUser/:id", authMiddleware, userController.deleteUser);
routers.put("/allUser/:id", authMiddleware, userController.putUser);

// 🆕 Product Routes
// Produk Routes
routers.post(
    '/products',
    authMiddleware,
    validate(createProductSchema),
    productController.addProduct
);
routers.put(
    '/products/:id',
    authMiddleware,
    validate(updateProductSchema),
    productController.updateProduct
);
routers.delete('/products/:id', authMiddleware, productController.deleteProduct);

// 🆕 Category Routes


// 🆕 Category Routes (dengan validasi dan autentikasi)
routers.post(
    "/categories",
    authMiddleware,
    validate(createCategorySchema),
    categoryController.addCategory
);
routers.put(
    "/categories/:id",
    authMiddleware,
    validate(updateCategorySchema),
    categoryController.updateCategory
);
routers.delete(
    "/categories/:id",
    authMiddleware,
    categoryController.deleteCategory
);


// 🆕 Complaint Routes
// GET semua pengaduan
routers.get('/complaints', authMiddleware, complaintController.getComplaints);
routers.get('/complaints/search/:code', authMiddleware, complaintController.searchComplaintByCode);
routers.get('/complaints/filter/:status', authMiddleware, complaintController.filterComplaintByStatus);
routers.get('/complaints/filter/:status/category/:category_id', authMiddleware, complaintController.filterComplaintByStatusAndCategory);
routers.get('/complaints/summary/status', authMiddleware, complaintController.getComplaintOverview);
routers.get('/complaints/today', authMiddleware, complaintController.getTodayComplaints);
routers.get('/complaints/report', authMiddleware, queryValidator(reportQuerySchema), complaintController.getComplaintReport);

// PUT update status pengaduan
routers.put(
    '/complaints/:id',
    authMiddleware,
    validate(updateComplaintStatusSchema),
    complaintController.updateComplaintStatus
);

// DELETE pengaduan
routers.delete(
    '/complaints/:id',
    authMiddleware,
    complaintController.deleteComplaint
);

module.exports = routers;
