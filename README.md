# 🛒 E-Commerce API Documentation

## 📌 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [Users](#users)
   - [Products](#products)
   - [Orders](#orders)
   - [Payments](#payments)
   - [Cart](#cart)
   - [Wishlist](#wishlist)
   - [Reviews](#reviews)
   - [Categories](#categories)
   - [Brands](#brands)
   - [Shipping](#shipping)
   - [Transactions](#transactions)
   - [Inventory](#inventory)
5. [Models](#models)
6. [Controllers](#controllers)
7. [Middleware](#middleware)
8. [Utilities](#utilities)
9. [Error Handling](#error-handling)
10. [Environment Variables](#environment-variables)
11. [Deployment](#deployment)

---

## 📜 Project Overview
This is a **RESTful E-Commerce API** built with **Node.js, Express, and MongoDB**.  

It provides endpoints for managing:
- **Users** (Authentication, Role-Based Access Control)
- **Products & Categories**
- **Orders & Transactions**
- **Payments** (Integrated with **Stripe**)
- **Cart & Wishlist**
- **Shipping & Inventory Management**
- **Reviews & Brands**

The API is secured using:
- **JWT Authentication**
- **Data Validation & Sanitization**
- **Rate Limiting & Security Headers**


## 📌 Project Structure

E-Commerce-API/
│
├── config/ 
│ ├── dbConnect.js 
│ ├── redisConnect.js 
│
├── controllers/
│ ├── authController.js
│ ├── brandController.js
│ ├── cartController.js
│ ├── categoryController.js
│ ├── handlerFactory.js
│ ├── inventoryController.js
│ ├── orderController.js
│ ├── paymentController.js
│ ├── productController.js
│ ├── reviewController.js
│ ├── shippingController.js
│ ├── subcategoryController.js
│ ├── transactionController.js
│ ├── userController.js
│ ├── wishlistController.js
│
├── middleware/ 
│ ├── catchAsync.js
│ ├── errorController.js
│
├── models/ 
│ ├── brandModel.js
│ ├── cartModel.js
│ ├── categoryModel.js
│ ├── inventoryModel.js
│ ├── orderModel.js
│ ├── paymentModel.js
│ ├── productModel.js
│ ├── reviewModel.js
│ ├── shippingModel.js
│ ├── subcategoryModel.js
│ ├── transactionModel.js
│ ├── userModel.js
│ ├── wishlistModel.js
│
├── routes/ 
│ ├── brandRoutes.js
│ ├── cartRoutes.js
│ ├── categoryRoutes.js
│ ├── inventoryRoutes.js
│ ├── orderRoutes.js
│ ├── paymentRoutes.js
│ ├── productRoutes.js
│ ├── reviewRoutes.js
│ ├── shippingRoutes.js
│ ├── subcategoryRoutes.js
│ ├── transactionRoutes.js
│ ├── userRoutes.js
│ ├── wishlistRoutes.js
│
├── utils/ 
│ ├── apiFeatures.js
│ ├── appError.js
│ ├── sendEmail.js
│ ├── stripeGateway.js
│
├── .gitignore 
├── app.js 
├── README.md 
├── server.js 