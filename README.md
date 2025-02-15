Project Documentation
Overview

This documentation outlines the current architecture and components of the project before proceeding with the implementation of new features such as the product and blog sections. It serves as a reference guide to understand the existing setup and ensure consistency and coherence as new features are added.
Current Components
1. Authentication Controller (authController.js)
Endpoints and Functions:

    Sign Up:

        Endpoint: POST /signup

        Function: Registers a new user with the provided details and creates a new user document in the database.

    Login:

        Endpoint: POST /login

        Function: Authenticates a user with email and password, generates and returns access and refresh tokens.

    Logout:

        Endpoint: GET /logout

        Function: Invalidates the current access and refresh tokens by setting them to 'loggedOut' in cookies.

    Forget Password:

        Endpoint: POST /forgetpassword

        Function: Sends a password reset link to the user's registered email.

    Reset Password:

        Endpoint: POST /resetpassword/:token

        Function: Allows the user to reset their password using a reset token.

    Refresh Token:

        Endpoint: POST /refreshtoken

        Function: Generates a new access token using a valid refresh token.

    Change Password:

        Endpoint: POST /changepassword

        Function: Allows the user to change their password if the current password is correct.

    Protect Route:

        Middleware: authController.protect

        Function: Protects routes that require user authentication.

    Restrict to Roles:

        Middleware: authController.restrictTo

        Function: Restricts access to routes based on user roles (e.g., admin).

2. User Controller (userController.js)
Endpoints and Functions:

    Get All Users:

        Endpoint: GET /

        Function: Retrieves all users from the database. (Admin only)

    Create User:

        Endpoint: POST /

        Function: Creates a new user. (Admin only)

    Get User:

        Endpoint: GET /:id

        Function: Retrieves a specific user by ID. (Admin only)

    Update Me:

        Endpoint: PATCH /updateme

        Function: Allows the logged-in user to update their profile information.

    Delete Me:

        Endpoint: PATCH /deleteme

        Function: Allows the logged-in user to deactivate their account.

    Delete User:

        Endpoint: DELETE /:id

        Function: Deletes a user by ID. (Admin only)

    Block User:

        Endpoint: PATCH /block/:id

        Function: Blocks a user by ID. (Admin only)

    Unblock User:

        Endpoint: PATCH /unblock/:id

        Function: Unblocks a user by ID. (Admin only)

3. User Model (userModel.js)

    Fields:

        firstname: User's first name.

        lastname: User's last name.

        email: User's email (unique).

        phone: User's phone number (unique).

        password: User's password (hashed).

        role: User's role (user/admin).

        passwordChangedAt: Timestamp for the last password change.

        passwordResetToken: Token for password reset.

        passwordResetTokenExpire: Expiration timestamp for the reset token.

        active: Boolean indicating if the account is active.

        isBlocked: Boolean indicating if the user is blocked.

    Methods:

        comparePassword: Compares the provided password with the hashed password.

        generateResetToken: Generates a password reset token.

4. User Routes (userRoute.js)

    Route Middleware:

        authController.protect: Protects all routes after this middleware.

        authController.restrictTo('admin'): Restricts routes to admin users.

    Routes:

        /login, /signup, /forgetpassword, /resetpassword/:token, /refreshtoken: Auth-related routes.

        /updateme, /changepassword, /deleteme, /logout: User-specific routes.

        /, /createuser, /:id, /block/:id, /unblock/:id: Admin routes.



        