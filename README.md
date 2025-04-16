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

## **API Endpoints**
   ### **authentication**

| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/auth/register`    | Register a new user                  |
| POST   | `/auth/login`       | Login an existing user               |
| GET    | `/auth/logout`      | Logout the current user              |
| POST   | `/auth/refresh-token` | Get a new access token             |
| GET    | `/auth/me`          | Get current user information         |


### Users

| Method | Endpoint       | Description                     |
|--------|----------------|---------------------------------|
| GET    | `/users`       | Get all users (Admin only)      |
| GET    | `/users/:id`   | Get user by ID                  |
| PATCH  | `/users/:id`   | Update user by ID               |
| DELETE | `/users/:id`   | Delete user by ID               |

### Products

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/products`      | Get all products                |
| POST   | `/products`      | Create product (Admin only)     |
| GET    | `/products/:id`  | Get product by ID               |
| PATCH  | `/products/:id`  | Update product (Admin only)     |
| DELETE | `/products/:id`  | Delete product (Admin only)     |

### Orders

| Method | Endpoint        | Description                     |
|--------|----------------|---------------------------------|
| GET    | `/orders`      | Get all orders                  |
| POST   | `/orders`      | Create a new order              |
| GET    | `/orders/:id`  | Get order by ID                 |
| PATCH  | `/orders/:id`  | Update order status             |

### Payments

| Method | Endpoint        | Description                     |
|--------|----------------|---------------------------------|
| POST   | `/payments`    | Process payment                 |
| GET    | `/payments/:id`| Get payment details             |

### Cart

| Method | Endpoint       | Description                     |
|--------|---------------|---------------------------------|
| GET    | `/cart`       | Get user's cart                 |
| POST   | `/cart`       | Add item to cart                |
| DELETE | `/cart/:id`   | Remove item from cart           |

### Wishlist

| Method | Endpoint        | Description                     |
|--------|----------------|---------------------------------|
| GET    | `/wishlist`    | Get user's wishlist             |
| POST   | `/wishlist`    | Add item to wishlist            |
| DELETE | `/wishlist/:id`| Remove item from wishlist       |

### Reviews

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| GET    | `/reviews`         | Get all reviews                 |
| POST   | `/reviews`         | Create new review               |
| GET    | `/reviews/:id`     | Get review by ID                |
| PATCH  | `/reviews/:id`     | Update review                   |
| DELETE | `/reviews/:id`     | Delete review                   |

### Categories

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/categories`       | Get all categories             |
| POST   | `/categories`       | Create category (Admin only)   |
| GET    | `/categories/:id`   | Get category by ID             |
| PATCH  | `/categories/:id`   | Update category (Admin only)   |
| DELETE | `/categories/:id`   | Delete category (Admin only)   |

### Subcategories

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/subcategories`       | Get all subcategories          |
| POST   | `/subcategories`       | Create subcategory (Admin only)|
| GET    | `/subcategories/:id`   | Get subcategory by ID          |
| PATCH  | `/subcategories/:id`   | Update subcategory (Admin only)|
| DELETE | `/subcategories/:id`   | Delete subcategory (Admin only)|

### Brands

| Method | Endpoint       | Description                     |
|--------|---------------|---------------------------------|
| GET    | `/brands`     | Get all brands                 |
| POST   | `/brands`     | Create brand (Admin only)      |
| GET    | `/brands/:id` | Get brand by ID                |
| PATCH  | `/brands/:id` | Update brand (Admin only)      |
| DELETE | `/brands/:id` | Delete brand (Admin only)      |

### Shipping

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/shipping`      | Get shipping options           |
| POST   | `/shipping`      | Create option (Admin only)     |
| GET    | `/shipping/:id`  | Get shipping option by ID      |
| PATCH  | `/shipping/:id`  | Update option (Admin only)     |
| DELETE | `/shipping/:id`  | Delete option (Admin only)     |

### Transactions

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/transactions`     | Get all transactions           |
| GET    | `/transactions/:id` | Get transaction by ID          |

### Inventory

| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/inventory`      | Get inventory status           |
| PATCH  | `/inventory/:id`  | Update inventory (Admin only)  |


## Architecture

### Models
Defined using Mongoose:
- User
- Product
- Order
- Cart
- Wishlist
- Review
- Category
- Subcategory
- Brand
- Payment
- Shipping
- Transaction
- Inventory

### Controllers
Each resource has its own controller with:
- CRUD operations
- Business logic
- Uses `handlerFactory.js` for common operations

### Middleware

| File               | Purpose                          |
|--------------------|----------------------------------|
| `catchAsync.js`    | Wraps async routes               |
| `errorController.js` | Global error handler           |
| `authMiddleware.js` | Route protection & role checks |

### Utilities

| File               | Purpose                          |
|--------------------|----------------------------------|
| `apiFeatures.js`   | Filtering, sorting, pagination   |
| `appError.js`      | Custom error class               |
| `sendEmail.js`     | Email delivery via Mailtrap      |
| `stripeGateway.js` | Payment processing               |

## Error Handling
Standardized format:
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "error": {}
}
   


