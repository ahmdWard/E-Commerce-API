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


## **Project Overview**

This is a **RESTful E-Commerce API** built with **Node.js**, **Express**, and **MongoDB**. It provides endpoints for managing users, products, orders, payments, and more. The API supports authentication, role-based access control, and integrates with **Stripe** for payment processing.


##  **Project Structure**
```markdown
E-Commerce-API/
│
├── **config/**               
│   ├── dbConnect.js          
│   ├── redisConnect.js      
│
├── **controllers/**          
│   ├── authController.js
│   ├── brandController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── handlerFactory.js
│   ├── inventoryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── reviewController.js
│   ├── shippingController.js
│   ├── subcategoryController.js
│   ├── transactionController.js
│   ├── userController.js
│   ├── wishlistController.js
│
├── **middleware/**          
│   ├── catchAsync.js
│   ├── errorController.js
│
├── **models/**              
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── inventoryModel.js
│   ├── orderModel.js
│   ├── paymentModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   ├── shippingModel.js
│   ├── subcategoryModel.js
│   ├── transactionModel.js
│   ├── userModel.js
│   ├── wishlistModel.js
│
├── **routes/**              
│   ├── brandRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── inventoryRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   ├── shippingRoutes.js
│   ├── subcategoryRoutes.js
│   ├── transactionRoutes.js
│   ├── userRoutes.js
│   ├── wishlistRoutes.js
│
├── **utils/**                
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── sendEmail.js
│   ├── stripeGateway.js
│
├── .gitignore                
├── app.js                    
├── README.md                
├── server.js                
├── README.md 
├── server.js 
```

## **Setup Instructions**

1.  **Clone the Repository**:
    ```bash
    
    git clone https://github.com/ahmdWard/E-Commerce-API.git
    cd E-Commerce-API
    ```
2.  **Install Dependencies**:
    
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:  
       Create a `.env` file in the root directory and add the following variables:
    
   ```env
   PORT = 12345
   NODE_ENV = development

   DATABASE_URL=mongodb://localhost:27017/ecommerce
   DATABASE_PASSWORD = YOURPASSWORD

   ACCESS_SECRET=YOURPASSWORD
   ACCESS_EXPIRATION=15m
   REFRESH_SECRET=YOURPASSWORD
   REFRESH_EXPIRATION=3d

   ACCESS_TOKEN_COOKIE_EXPIRE=15
   REFRESH_TOKEN_COOKIE_EXPIRE=3 

   HOSTNAME=sandbox.smtp.mailtrap.io
   SERVICEPORT=587
   EMAILUESERNAME=YOURUSERNAME
   EMAILPASSWORD=YOURPASSWORD
   FROM=YOUREMAIL

   SECRET_KEY=your_stripe_secret_key
    
```
4.  **Start the Server**:
    
   ``` bash
    npm start
  ```  
5.  **Access the API**:  
    The API will be available at `http://localhost:12345/api/v1`.

